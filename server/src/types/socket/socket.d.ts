import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    data: {
      userId?: string;
    };
  }
}

export {};
