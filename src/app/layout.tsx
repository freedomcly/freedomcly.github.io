import type {Metadata} from 'next';
import {Suspense} from 'react';
import '@/styles/common/globals.css';
import '@/styles/common/globals-scroll-lock.css';
import {LanguageProvider} from '@/contexts/LanguageContext';
import {ThemeProvider} from '@/contexts/ThemeContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import PageTracker from '@/components/PageTracker';
import ScrollTracker from '@/components/ScrollTracker';
// import ImagePreloader from '@/components/ImagePreloader';

export const metadata: Metadata = {
  title: 'Tracy Cui - Senior Front End Engineer, JavaScript Expert',
  description: 'Tracy Cui - Senior Front End Engineer, JavaScript Expert',
  icons: [{
    rel: 'icon',
    url: '/favicon.ico'
  }]
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <link rel="preload" as="image" href="/images/tracy-400.webp" /> */}
        {/* <link rel="preload" as="image" href="/images/me-800.webp" /> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <GoogleAnalytics />
        {/* <ImagePreloader /> */}
        <ThemeProvider>
          <LanguageProvider>
            <Suspense fallback={null}>
              <PageTracker />
            </Suspense>
            <ScrollTracker />
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
