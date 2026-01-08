import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import ServerProvider from '@/providers/server.provider';
import SocketProvider from '@/providers/socket.provider';
import PlaybackProvider from '@/providers/playback.provider';
import { PlaybackResolver } from '@/hooks/useplaybackresolver';

const outfitFont = Outfit({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Spotifye',
  description: 'Stream and Play music anywhere',
  icons: {
    icon: '/spotify.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className='dark'>
      <link rel='icon' href='/spotify.png' />

      <body className={`${outfitFont.className} antialiased`}>
        <ClerkProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <PlaybackProvider />
            <ServerProvider />
            <SocketProvider />
            {children}
            <ToastContainer position='bottom-right' />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
