import { useMusicStore } from '@/stores/use-music-store';
import { usePlayerStore } from '@/stores/use-player-store';
import { Track } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Gradient {
  bg: string;
  text: string;
}

interface GradientLyrics {
  bg: string;
  activeText: string;
  lessText: string;
  greaterText: string;
}

export interface LyricLine {
  time: number;
  text: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const bgGradient = (): string => {
  const gradients = [
    '#5038a0',
    '#ffba08',
    '#d90429',
    '#9cf6f6',
    '#fffffc',
    '#ffd60a',
    '#80b918',
    '#4ad66d',
    '#fb6f92',
    '#000000',
    '#80ffdb',
    '#ffea00',
    '#15616d',
    '#b9faf8',
    '#ffffff',
    '#2d00f7',
    '#e2eafc',
    '#99d98c',
    '#f72585',
    '#2a9d8f',
    '#344e41',
  ];

  const i = Math.floor(Math.random() * gradients.length);

  return gradients[i];
};

export const bgGradientDisplay = (): Gradient => {
  const gradients = [
    { bg: '#ffd60a', text: '#003' },
    { bg: '#c9184a', text: '#ffe' },
    { bg: '#3a86ff', text: '#fff' },
    { bg: '#14213d', text: '#fff' },
    { bg: '#212529', text: '#fff' },
    { bg: '#2a9134', text: '#ffe' },
  ];

  const i = Math.floor(Math.random() * gradients.length);

  return gradients[i];
};

export const bgGradientLyrics = (): GradientLyrics => {
  const gradients = [
    {
      bg: '#ef233c',
      activeText: '#fff',
      lessText: '#fefae0',
      greaterText: '#f1faee',
    },
    { bg: '#0077b6', activeText: '#fff', lessText: '', greaterText: '' },
    { bg: '#022b3a', activeText: '#fff', lessText: '', greaterText: '' },
  ];

  const i = Math.floor(Math.random() * gradients.length);

  return gradients[i];
};

export const bgActive = (): string => {
  const gradients = ['#04080f', '#000500', '#000'];

  return gradients[Math.floor(Math.random() * gradients.length)];
};

export const bgGradientLiked = (): string => {
  const gradients = [
    '#3f37c9',
    '#4361ee',
    '#c9184a',
    '#8d0801',
    '#aacc00',
    '#008000',
  ];

  const i = Math.floor(Math.random() * gradients.length);

  return gradients[i];
};

export const downloadSong = async () => {
  const { currentTrackId } = usePlayerStore.getState();
  const { tracksByIds } = useMusicStore.getState();

  const currentTrack = tracksByIds[currentTrackId!];

  if (!currentTrack?.audioUrl) return;

  try {
    const res = await fetch(currentTrack.audioUrl);

    if (!res.ok) throw new Error('Download failed');

    const blob = await res.blob();

    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = currentTrack.data.title
      ? `${currentTrack.data.title}-${currentTrack.data.artist.name}.mp3`
      : 'download.mp3';
    document.body.appendChild(a);

    a.click();
    a.remove();

    return URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.log('Error downloading song:', error);
  }
};

export const skipForward = (): number => {
  const { audioRef: audio, requestSeek } = usePlayerStore.getState();
  if (audio) {
    const nextTime = Math.min(audio.currentTime + 10, audio.duration);
    requestSeek(nextTime);
    return nextTime;
  }
  return 0;
};

export const skipBackward = (): number => {
  const { audioRef: audio, requestSeek } = usePlayerStore.getState();
  if (audio) {
    const nextTime = Math.max(audio.currentTime - 10, 0);
    requestSeek(nextTime);
    return nextTime;
  }
  return 0;
};

export const getGreetings = async (userName?: string): Promise<string> => {
  const now = new Date();

  const hr = now.getHours();

  let greeting: string;

  if (hr >= 5 && hr < 12) {
    greeting = 'Good morning';
  } else if (hr >= 12 && hr < 17) {
    greeting = 'Good afternoon';
  } else if (hr >= 17 && hr < 21) {
    greeting = 'Good evening';
  } else {
    greeting = 'Good night';
  }

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  let location = '';

  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
      });
    });

    const { latitude, longitude } = pos.coords;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );

    const data = await res.json();

    location =
      data.address.city.split(' ')[0] || data.address.city.split('')[2] || '';
  } catch (error) {
    location = tz;
  }

  if (userName && location) {
    return `${greeting},${userName} in ${location}`;
  } else if (userName) {
    return `${greeting},${userName}`;
  } else if (location) {
    return `${greeting}, friend in ${location}`;
  } else {
    return `${greeting}`;
  }
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDuration = (duration: number): string => {
  const mins = Math.floor(duration / 60);
  const remainingSecs = duration % 60;

  return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
};

export const albumTimeLength = (songs: Track[]): string => {
  if (!songs || songs.length === 0) return '0 sec';

  const totalSecs = songs.reduce((acc, song) => acc + song.duration, 0);

  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = Math.floor(totalSecs % 60);

  let timeStr = '';
  if (hrs > 0) timeStr += `${hrs} hr `;
  if (mins > 0 || hrs > 0) timeStr += `${mins} min `;
  timeStr += `${secs} sec`;

  return timeStr.trim();
};

export const getDeviceName = (): string => {
  const ua = navigator.userAgent;

  let os = '';

  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac/i.test(ua)) os = 'Mac';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = '';

  if (/chrome|crios/i.test(ua) && !/edge|edg/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/edg/i.test(ua)) browser = 'Edge';

  return `${browser} on ${os}`;
};

export const getOnlineStatus = (): boolean => {
  return navigator.onLine;
};

export const parseLyrics = (lyrics: string): LyricLine[] => {
  return lyrics
    .split('\n')
    .map((line) => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\]\s*(.*)/);
      if (!match) return null;

      const minutes = Number(match[1]);
      const seconds = Number(match[2]);

      return {
        time: minutes * 60 + seconds,
        text: match[3].trim(),
      };
    })
    .filter(Boolean) as LyricLine[];
};

export const getFlag = (code: string) => {
  return `https://flagcdn.com/w320/${code.toLowerCase()}.png`;
};
