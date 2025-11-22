import '../styles/globals.css';
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/theme-provider';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Sofia.AI | AI-Powered Technical Interview Platform',
    template: '%s | Sofia.AI',
  },
  description:
    'Conduct professional technical interviews with AI-powered assistance. Sofia.AI helps you assess candidates with real-time insights and intelligent evaluation.',
  twitter: {
    creator: '@sofiaai',
    site: '@sofiaai',
    card: 'summary_large_image',
  },
  openGraph: {
    url: 'https://sofia.ai',
    images: [
      {
        url: '/images/livekit-meet-open-graph.png',
        width: 2000,
        height: 1000,
        type: 'image/png',
      },
    ],
    siteName: 'Sofia.AI',
  },
  icons: {
    icon: {
      rel: 'icon',
      url: '/favicon.ico',
    },
    apple: [
      {
        rel: 'apple-touch-icon',
        url: '/images/livekit-apple-touch.png',
        sizes: '180x180',
      },
      { rel: 'mask-icon', url: '/images/livekit-safari-pinned-tab.svg', color: '#E1D5F2' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#E1D5F2',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        data-lk-theme="default"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
