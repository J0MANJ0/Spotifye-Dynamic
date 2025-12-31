// client/src/store/socket.store.ts
import { ENV } from '@/lib/envs';
import { Track } from '@/types';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface DeviceInfo {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  capabilities: string[];
  metadata: any;
}

interface PlaybackState {
  track: Track | null;
  isPlaying: boolean;
  position: number;
  volume: number;
  queue: Track[];
  lastUpdated: number;
  lastUpdatedBy: string;
  lastUpdatedDevice: string;
}

interface DeviceStatus {
  userId: string;
  deviceId: string;
  status: 'online' | 'offline' | 'idle';
  timestamp: number;
}

interface SocketStoreProps {
  socket: Socket | null;
  isConnected: boolean;
  activeSession: string | null;
  devices: DeviceInfo[];
  currentPlayback: PlaybackState | null;

  // Core methods
  emit: (event: string, data?: any, ack?: (response: any) => void) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;

  // Initialization
  initSocket: (authToken: string, userId: string) => void;
  disconnect: () => void;

  // Session management
  joinSession: (sessionId: string, deviceInfo?: Partial<DeviceInfo>) => void;
  leaveSession: (sessionId: string) => void;

  // Playback control
  playTrack: (sessionId: string, track: Track, position?: number) => void;
  pauseTrack: (sessionId: string, position: number) => void;
  seekTrack: (sessionId: string, position: number) => void;
  updateQueue: (sessionId: string, queue: Track[]) => void;

  // Device management
  registerDevice: (deviceInfo: Partial<DeviceInfo>) => void;
  setActiveDevice: (sessionId: string) => void;
  transferPlayback: (targetDeviceId: string, sessionId: string) => void;

  // Sync
  requestSync: (sessionId: string) => void;
}

export const useSocketStore = create<SocketStoreProps>((set, get) => ({
  socket: null,
  isConnected: false,
  activeSession: null,
  devices: [],
  currentPlayback: null,

  // Core emit method
  emit: (event, data, ack) => {
    const { socket } = get();

    if (!socket || !socket.connected) {
      console.warn(`Cannot emit "${event}": socket not connected`);
      return;
    }

    if (ack) {
      socket.emit(event, data, ack);
    } else {
      socket.emit(event, data);
    }
  },

  // Core on method
  on: (event, callback) => {
    const { socket } = get();

    if (!socket) {
      console.warn(`Cannot listen to "${event}": socket not initialized`);
      return () => {};
    }

    socket.on(event, callback);
    return () => socket.off(event, callback);
  },

  // Core off method
  off: (event, callback) => {
    const { socket } = get();
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  },

  // Initialize socket connection
  initSocket: (authToken, userId) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) {
      console.log('Socket already connected');
      return;
    }

    // Disconnect existing socket if any
    if (existingSocket) {
      existingSocket.disconnect();
    }

    // Generate device ID (store in localStorage for persistence)
    const deviceId = localStorage.getItem('deviceId') || generateDeviceId();
    localStorage.setItem('deviceId', deviceId);

    // Get device info
    const deviceInfo = getDeviceInfo();

    const socket = io(ENV.SOCKET_URL, {
      auth: {
        token: authToken,
        deviceId: deviceId,
        userId,
      },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
    });

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      set({ isConnected: true, socket });

      // Register device with server
      get().registerDevice(deviceInfo);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connect error:', err.message);
      set({ isConnected: false });
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      set({ isConnected: false });

      // Attempt reconnection
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    // Session events
    socket.on('session:state', (state: PlaybackState) => {
      console.log('📦 Session state received:', state);
      set({ currentPlayback: state });
    });

    socket.on('session:user_joined', (data) => {
      console.log('👤 User joined:', data);
      // Handle user joined notification
    });

    socket.on('session:user_left', (data) => {
      console.log('👋 User left:', data);
      // Handle user left notification
    });

    socket.on('session:error', (error) => {
      console.error('❌ Session error:', error);
    });

    // Playback events
    socket.on('playback:play', (data) => {
      console.log('▶️ Remote play:', data);
      // Update local playback state
      // This would trigger your audio player to play
    });

    socket.on('playback:pause', (data) => {
      console.log('⏸️ Remote pause:', data);
      // Update local playback state
    });

    socket.on('playback:seek', (data) => {
      console.log('🎯 Remote seek:', data);
      // Seek local player
    });

    socket.on('playback:queue_updated', (data) => {
      console.log('📋 Queue updated:', data);
      // Update local queue
    });

    socket.on('playback:volume', (data) => {
      console.log('🔊 Volume changed:', data);
      // Update local volume
    });

    // Device events
    socket.on('device:list', (devices: DeviceInfo[]) => {
      console.log('📱 Device list:', devices);
      set({ devices });
    });

    socket.on('device:registered', (data) => {
      console.log('📱 Device registered:', data);
      // Update devices list
      const { devices } = get();
      if (!devices.some((d) => d.id === data.deviceId)) {
        set({ devices: [...devices, data.deviceInfo] });
      }
    });

    socket.on('device:active_changed', (data) => {
      console.log('📱 Active device changed:', data);
      // Handle active device change
    });

    socket.on('device:transfer_request', (data) => {
      console.log('🔄 Transfer request:', data);
      // Show UI prompt for transfer
      if (confirm('Accept playback transfer?')) {
        get().setActiveDevice(data.sessionId);
      }
    });

    socket.on('device:status', (data: DeviceStatus) => {
      console.log('📱 Device status:', data);
      // Update device status in UI
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    // Set socket in store
    set({ socket });

    // Cleanup function
    return () => {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    };
  },

  // Disconnect socket
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, activeSession: null });
    }
  },

  // Join a session
  joinSession: (sessionId, deviceInfo = {}) => {
    const { emit, socket } = get();

    if (!socket?.connected) {
      console.warn('Cannot join session: socket not connected');
      return;
    }

    const defaultDeviceInfo: Partial<DeviceInfo> = {
      name: navigator.userAgent.substring(0, 50),
      type: getDeviceType(),
      capabilities: ['playback', 'volume'],
      ...deviceInfo,
    };

    emit('session:join', {
      sessionId,
      deviceInfo: defaultDeviceInfo,
    });

    set({ activeSession: sessionId });
    console.log(`Joining session: ${sessionId}`);
  },

  // Leave a session
  leaveSession: (sessionId) => {
    const { emit, activeSession } = get();

    if (activeSession === sessionId) {
      emit('session:leave', { sessionId });
      set({ activeSession: null, currentPlayback: null });
      console.log(`Left session: ${sessionId}`);
    }
  },

  // Playback control methods
  playTrack: (sessionId, track, position = 0) => {
    get().emit('playback:play', {
      sessionId,
      track,
      position,
    });
  },

  pauseTrack: (sessionId, position) => {
    get().emit('playback:pause', {
      sessionId,
      position,
    });
  },

  seekTrack: (sessionId, position) => {
    get().emit('playback:seek', {
      sessionId,
      position,
    });
  },

  updateQueue: (sessionId, queue) => {
    get().emit('playback:queue_update', {
      sessionId,
      queue,
    });
  },

  // Device management
  registerDevice: (deviceInfo) => {
    get().emit('device:register', deviceInfo);
  },

  setActiveDevice: (sessionId) => {
    get().emit('device:set_active', { sessionId });
  },

  transferPlayback: (targetDeviceId, sessionId) => {
    get().emit('device:transfer', {
      targetDeviceId,
      sessionId,
    });
  },

  // Sync
  requestSync: (sessionId) => {
    get().emit('session:sync_request', { sessionId });
  },
}));

// Helper functions
function generateDeviceId(): string {
  const deviceId = `device_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  localStorage.setItem('deviceId', deviceId);
  return deviceId;
}

function getDeviceInfo(): Partial<DeviceInfo> {
  return {
    name: navigator.userAgent.substring(0, 50),
    type: getDeviceType(),
    capabilities: ['playback', 'volume'],
    metadata: {
      platform: navigator.platform,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  };
}

function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const ua = navigator.userAgent.toLowerCase();

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }

  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
}
