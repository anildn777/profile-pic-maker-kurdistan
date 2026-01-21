import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kurdistan Profile Pic Maker ☀️',
  description:
    'Frame your profile with the colors of Kurdistan. Show solidarity and identity through your profile picture.',
  // ⚠️ WICHTIG: auf deine neue Pages-Domain anpassen
  metadataBase: new URL('https://profile-pic-maker-kurdistan.pages.dev'),
  openGraph: {
    title: 'Kurdistan Profile Pic Maker ☀️',
    description:
      'Create your Kurdistan profile picture to show your solidarity and pride.',
    siteName: 'Kurdistan Profile Pic Maker ☀️',
    images: '/social-card.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
