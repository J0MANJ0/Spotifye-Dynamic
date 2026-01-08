export interface Track {
  _id: string;
  trackId: number;
  albumId: string;
  audioUrl: string;
  duration: number;
  data: TrackData;
  createdAt: string;
  updatedAt: string;
}

export interface TrackData {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  isrc: string;
  link: string;
  share: string;
  duration: string;
  track_position: string;
  disk_number: string;
  rank: number;
  release_date: string;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  bpm: number;
  gain: number;
  available_countries: [string];
  contributors: [
    {
      id: number;
      name: string;
      link: string;
      share: string;
      picture: string;
      picture_small: string;
      picture_medium: string;
      picture_big: string;
      picture_xl: string;
      radio: string;
      tracklist: string;
      type: string;
      role: string;
    }
  ];
  md5_image: string;
  track_token: string;
  artist: ArtistData;
  album: AlbumData;
  type: string;
}

export interface User {
  _id: string;
  clerkId: string;
  fullName: string;
  imageUrl: string;
  explicitContent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  _id: string;
  artistId: number;
  data: ArtistData;
  createdAt: string;
  updatedAt: string;
}

export interface FollowArtist {
  _id: string;
  follower: string;
  target: Artist;
  targetType: 'users' | 'artists';
  createdAt: string;
  updatedAt: string;
}

export interface FollowUser {
  _id: string;
  follower: string;
  target: User;
  targetType: 'users' | 'artists';
  createdAt: string;
  updatedAt: string;
}

export interface ArtistData {
  id: number;
  name: string;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
  type: string;
}

export interface ArtistTrackInfo {
  id: number;
  name: string;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  radio: string;
  tracklist: string;
  type: string;
  role: string;
}

export interface Album {
  _id: string;
  albumId: number;
  tracks: Track[];
  data: AlbumData;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumData {
  id: number;
  title: string;
  upc: string;
  link: string;
  share: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  genre_id: number;
  genres: {
    data: [{ id: number; name: string; picture: string; type: string }];
  };
  label: string;
  nb_tracks: number;
  duration: number;
  fans: number;
  release_date: string;
  recored_type: string;
  available: boolean;
  tracklist: string;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  contributors: [
    {
      id: number;
      name: string;
      link: string;
      share: string;
      picture: string;
      picture_small: string;
      picture_medium: string;
      picture_big: string;
      picture_xl: string;
      radio: string;
      tracklist: string;
      type: string;
      role: string;
    }
  ];
  artist: ArtistData;
  type: string;
  tracks: {
    data: Track[];
  };
}

export interface PodcastData {
  id: number;
  title: string;
  description: string;
  available: boolean;
  fans: number;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  type: 'podcast';
}

export interface PlaylistData {
  id: number;
  title: string;
  public: boolean;
  nb_tracks: number;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  checksum: string;
  tracklist: string;
  creation_date: string;
  add_date: string;
  mod_date: string;
  md5_image: string;
  picture_type: 'playlist';
  user: {
    id: number;
    name: string;
    tracklist: string;
    type: 'user';
  };
  type: 'playlist';
}

export interface Stats {
  albums: number;
  tracks: number;
  users: number;
  artists: number;
  lyrics: number;
}

export interface LikeSong {
  _id: string;
  userId: string;
  tracks: Track[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  content: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lrc {
  _id: string;
  trackId: number;
  lyrics: {
    format: string;
    url: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Info {
  country_iso: string;
  country: string;
  open: boolean;
  pop: string;
  upload_token: string;
  upload_token_lifetime: number;
  user_token: string | number | null;
  hosts: {
    stream: string;
    images: string;
  };
  ads: {
    audio: {
      default: {
        start: number;
        interval: number;
        unit: string;
      };
    };
    display: {
      interstitial: {
        start: number;
        interval: number;
        unit: string;
      };
    };
    big_native_ads_home: {
      iphone: {
        enabled: boolean;
      };
      ipad: {
        enabled: boolean;
      };
      android: {
        enabled: boolean;
      };
      android_tablet: {
        enabled: boolean;
      };
    };
  };
  has_podcasts: boolean;
  offers: [any];
}

export interface Device {
  socketId: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  isActive: boolean;
}
