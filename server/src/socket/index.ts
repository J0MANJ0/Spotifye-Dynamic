import { Socket, Server, DisconnectReason } from 'socket.io';
import { Server as HttpServer } from 'http';
import { ENV } from '../lib/env';
import logger from '../lib/logger';
import { UAParser } from 'ua-parser-js';
import { MESSAGE_REPO } from '../repos/message.repo';
import {
  PlaybackCommand,
  PlaybackState,
  SetDevice,
  ToggleExplicit,
} from '../types/playback';

interface DeviceMeta {
  userId: string;
  socketId: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
}

const activeSocket = new Map<string, string>();

const socketMeta = new Map<string, DeviceMeta>();

const playbackState = new Map<string, PlaybackState>();

const userSockets = new Map<string, Set<string>>();

const userActivities = new Map<string, string>();

function getDeviceType(ua: string): 'desktop' | 'mobile' | 'tablet' {
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobi|android/i.test(ua)) return 'mobile';
  return 'desktop';
}

function createInitialState(): PlaybackState {
  return {
    isPlaying: false,
    shuffle: false,
    likedAlbumPlaying: false,
    artistAlbumPlaying: false,
    madeForYouAlbumPlaying: false,
    queue: [],
    shuffledQueue: [],
    volume: 50,
    prevVolume: 50,
    currentIndex: 0,
    currentTrackId: null,
    currentAlbumId: null,
    repeatMode: 'off',
    currentTime: 0,
    syncAt: Date.now(),
    syncReason: '',
    explicitContent: true,
  };
}

function ensureUserState(userId: string): PlaybackState {
  if (!playbackState.has(userId)) {
    playbackState.set(userId, createInitialState());
  }
  return playbackState.get(userId)!;
}

function addSocket(userId: string, socketId: string) {
  if (!userSockets.has(userId)) {
    userSockets.set(userId, new Set());
  }

  const sockets = userSockets.get(userId)!;
  sockets.add(socketId);
  userActivities.set(userId, 'Idle');

  if (!activeSocket.has(userId)) {
    activeSocket.set(userId, socketId);
  }
}

function removeSocket(userId: string, socketId: string) {
  const sockets = userSockets.get(userId);
  if (!sockets) return;

  sockets.delete(socketId);

  if (activeSocket.get(userId) === socketId) {
    const next = sockets.values().next().value;

    if (next) {
      activeSocket.set(userId, next);
    } else {
      activeSocket.delete(userId);
    }
  }

  // Optional cleanup
  if (sockets.size === 0) {
    userSockets.delete(userId);
    activeSocket.delete(userId);
    // ❗ Decide if you want to keep playback state or clean it
    // playbackState.delete(userId);
  }
}

function resolveCurrentTime(state: PlaybackState) {
  if (!state.isPlaying) return state.currentTime;

  const now = Date.now();
  const elapsed = (now - state.syncAt) / 1000;
  return state.currentTime + elapsed;
}

function emitDevices(io: Server, userId: string, room: string) {
  const sockets = userSockets.get(userId);

  if (!sockets) return;

  const activeId = activeSocket.get(userId);

  const devices = Array.from(sockets).map((sid) => {
    const meta = socketMeta.get(sid)!;
    return {
      socketId: sid,
      deviceType: meta.deviceType,
      browser: meta.browser,
      os: meta.os,
      isActive: sid === activeId,
    };
  });

  io.to(room).emit('devices:update', { devices });
}

function emitUsers(io: Server, socket: Socket) {
  if (!socket) return;

  const onlineUsers = Array.from(userSockets.keys());
  const activities = Array.from(userActivities.entries());

  socket.emit('users:online', onlineUsers);
  io.emit('users:activities', activities);
}

const initSocket = (httpServer: HttpServer) => {
  if (ENV.ENABLE_SOCKETS === 'false') return;
  const io = new Server(httpServer, {
    cors: { origin: ENV.CLIENT_URL, credentials: true },
  });

  io.on('connection', (socket: Socket) => {
    if (!socket) return;
    const userId = socket.handshake.auth?.userId;

    if (!userId) {
      logger.warn(`Socket ${socket.id} connected without userId`);
      return;
    }

    const ua = socket.handshake.headers['user-agent'] ?? '';
    const parser = new UAParser(ua);
    const result = parser.getResult();
    const browser = result.browser.name ?? 'Unknown';
    const os = result.os.name ?? 'Unknown';

    socketMeta.set(socket.id, {
      userId,
      socketId: socket.id,
      deviceType: getDeviceType(ua),
      browser,
      os,
    });

    const room = `user:${userId}`;

    socket.join(room);

    addSocket(userId, socket.id);

    emitDevices(io, userId, room);

    emitUsers(io, socket);

    io.emit('user:connected', userId);

    const state = ensureUserState(userId);

    const nowPlayingTime = resolveCurrentTime(state);

    logger.info(`Active device: ${activeSocket.get(userId)}`);
    logger.info(`User ${userId} connected on socket: ${socket.id}`);

    io.to(room).emit('sync:active', {
      isActiveSocket: activeSocket.get(userId),
    });

    socket.emit('sync:playback', {
      ...state,
      currentTime: nowPlayingTime,
      syncAt: Date.now(),
      syncReason: 'join',
    });

    socket.on('playback:command', (cmd: PlaybackCommand) => {
      const state = playbackState.get(userId);

      if (!state) return;

      if (state.isPlaying) {
        state.currentTime = resolveCurrentTime(state);
      }

      switch (cmd.type) {
        case 'TOGGLE_PLAY': {
          if (state.isPlaying) {
            state.isPlaying = false;
            state.syncReason = 'pause';
          } else {
            state.isPlaying = true;
            state.syncAt = Date.now();
            state.syncReason = 'play';
          }
          break;
        }
        case 'SET_QUEUE': {
          const { queue, startIndex } = cmd;
          state.queue = queue;
          state.currentIndex = startIndex;
          state.currentTrackId = queue[startIndex];
          state.isPlaying = true;
          state.currentTime = 0;

          (state.syncAt = Date.now()), (state.syncReason = 'track-change');

          break;
        }
        case 'SET_TRACK': {
          const idx = state.queue.findIndex((t) => t === cmd.trackId);

          if (idx !== -1) {
            state.currentIndex = idx;
            state.currentTime = 0;
            state.currentTrackId = cmd.trackId;
            state.isPlaying = true;
            state.syncAt = Date.now();
            state.syncReason = 'track-change';
          }
          break;
        }
        case 'NEXT': {
          const list = state.shuffle ? state.shuffledQueue : state.queue;

          if (state.repeatMode === 'one') {
            state.currentTime = 0;
            state.isPlaying = true;
            state.syncAt = Date.now();
            state.syncReason = 'repeat-one';
            break;
          }

          let nextIndex = state.currentIndex + 1;

          if (nextIndex >= list.length) {
            if (state.repeatMode === 'all') {
              nextIndex = 0;
            } else {
              state.isPlaying = false;
              break;
            }
          }

          state.currentIndex = nextIndex;
          state.currentTrackId = list[nextIndex];
          state.currentTime = 0;
          state.isPlaying = true;
          state.syncAt = Date.now();
          state.syncReason = 'track-change';
          break;
        }
        case 'PREV': {
          const prevIndex = state.currentIndex - 1;

          if (prevIndex >= 0) {
            state.currentIndex = prevIndex;
            state.currentTime = 0;
            state.currentTrackId = state.queue[prevIndex];
            state.isPlaying = true;

            state.syncAt = Date.now();
            state.syncReason = 'track-change';
          }

          break;
        }
        case 'SEEK': {
          state.currentTime = cmd.time;

          (state.syncAt = Date.now()), (state.syncReason = 'seek');

          break;
        }
        case 'SET_REPEAT': {
          state.repeatMode = cmd.mode;
          if (state.isPlaying) {
            state.syncAt = Date.now();
          }

          break;
        }
        case 'TOGGLE_SHUFFLE': {
          state.shuffle = !state.shuffle;
          if (state.isPlaying) {
            state.syncAt = Date.now();
          }

          break;
        }
        case 'PLAY_ALBUM': {
          const { queue, startIndex, TYPE, albumId } = cmd;

          state.queue = queue;
          state.currentIndex = startIndex!;
          state.currentTime = 0;
          state.currentTrackId = queue[startIndex!];
          state.isPlaying = true;
          (state.syncAt = Date.now()), (state.syncReason = 'track-change');

          if (TYPE === 'album' && albumId) {
            state.currentAlbumId = albumId;
            state.likedAlbumPlaying = false;
            state.madeForYouAlbumPlaying = false;
            state.artistAlbumPlaying = false;
          } else if (TYPE === 'likedSongsAlbum') {
            state.likedAlbumPlaying = true;
            state.madeForYouAlbumPlaying = false;
            state.artistAlbumPlaying = false;
            state.currentAlbumId = null;
          } else if (TYPE === 'artistAlbum') {
            state.artistAlbumPlaying = true;
            state.likedAlbumPlaying = false;
            state.madeForYouAlbumPlaying = false;
            state.currentAlbumId = null;
          } else if (TYPE === 'madeForYouAlbum') {
            state.madeForYouAlbumPlaying = true;
            state.artistAlbumPlaying = false;
            state.likedAlbumPlaying = false;
            state.currentAlbumId = null;
          }
          break;
        }
        case 'SET_VOLUME': {
          if (cmd.volume > 0) {
            state.prevVolume = cmd.volume;
          }

          state.volume = cmd.volume;
          if (state.isPlaying) {
            state.syncAt = Date.now();
          }
          break;
        }
        default:
          break;
      }

      io.to(room).emit('sync:playback', {
        ...state,
        currentTime: resolveCurrentTime(state),
        syncAt: Date.now(),
      });
    });

    socket.on('set:active:device', (cmd: SetDevice) => {
      switch (cmd.type) {
        case 'SET_ACTIVE': {
          const { socketId } = cmd;
          const sockets = userSockets.get(userId);

          if (!sockets || !sockets.has(socketId)) return;

          activeSocket.set(userId, socketId);

          io.to(room).emit('sync:active', {
            isActiveSocket: activeSocket.get(userId),
          });
          logger.info(`SOCKET :${socketId}`);
          emitDevices(io, userId, room);
          break;
        }

        default:
          break;
      }
    });

    socket.on('explicit:content:toggle', (cmd: ToggleExplicit) => {
      const state = playbackState.get(userId);

      if (!state) return;

      switch (cmd.type) {
        case 'TOGGLE_EXPLICIT': {
          state.explicitContent = cmd.explicitContent;
          break;
        }
        default:
          break;
      }

      io.to(room).emit('sync:explicit', {
        explicitContent: state.explicitContent,
      });
    });

    socket.on(
      'update:user:activity',
      ({ userId, activity }: { userId: string; activity: string }) => {
        userActivities.set(userId, activity);
        io.emit('updated:user:activity', { userId, activity });
      }
    );

    socket.on(
      'send:message',
      async ({
        senderId,
        recipientId,
        content,
      }: {
        senderId: string;
        recipientId: string;
        content: string;
      }) => {
        try {
          const message = await MESSAGE_REPO.SEND_MESSAGE(
            senderId,
            recipientId,
            content
          );

          const recipientSockets = userSockets.get(recipientId);

          if (recipientSockets) {
            for (const sid of recipientSockets) {
              io.to(sid).emit('receive:message', message);
            }
          }
          socket.emit('sent:message', message);
        } catch (error: any) {
          logger.error(`Message error: ${error}`);
          socket.emit('message:error', error?.message);
        }
      }
    );

    socket.on('disconnect', (reason: DisconnectReason) => {
      logger.error(`Socket disconnected ${socket.id}: ${reason}`);
      removeSocket(userId, socket.id);
      socketMeta.delete(socket.id);

      emitDevices(io, userId, room);
      emitUsers(io, socket);
      io.emit('user:disconnected', userId);
    });
  });

  return io;
};

export const SOC_INIT = {
  INIT_SOCKET: initSocket,
};
