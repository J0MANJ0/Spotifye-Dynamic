type RepeatMode = 'off' | 'all' | 'one';

type Activity = {
  title: string;
  artist: string;
};

type AlbumType =
  | 'likedSongsAlbum'
  | 'artistAlbum'
  | 'madeForYouAlbum'
  | 'album';

type PlaybackCommand =
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SET_QUEUE'; queue: string[]; startIndex: number }
  | {
      type: 'PLAY_ALBUM';
      queue: string[];
      TYPE: AlbumType;
      albumId?: string;
      startIndex?: number;
    }
  | { type: 'SET_TRACK'; trackId: string }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SEEK'; time: number }
  | { type: 'SET_REPEAT'; mode: RepeatMode }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'TOGGLE_SHUFFLE' };

type ToggleExplicit = { type: 'TOGGLE_EXPLICIT'; explicitContent: boolean };
type SetDevice = { type: 'SET_ACTIVE'; socketId: string };

interface PlaybackState {
  isPlaying: boolean;
  likedAlbumPlaying: boolean;
  artistAlbumPlaying: boolean;
  madeForYouAlbumPlaying: boolean;
  repeatMode: RepeatMode;
  volume: number;
  prevVolume: number;
  shuffle: boolean;
  queue: string[];
  shuffledQueue: string[];
  currentIndex: number;
  currentTrackId: string | null;
  currentTime: number;
  currentAlbumId: string | null;
  explicitContent: boolean;
  syncAt: number;
  syncReason: string;
}
