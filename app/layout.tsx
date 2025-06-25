import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/store/provider';
import { MSWProvider } from '@/src/providers/msw-provider';
import { QueryProvider } from '@/src/providers/query-provider';
import { AuthProvider } from '@/src/contexts/auth-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '家計簿アプリ',
  description: '家計を管理するためのアプリケーション',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MSWProvider>
          <QueryProvider>
            <Providers>
              <AuthProvider>{children}</AuthProvider>
            </Providers>
          </QueryProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
