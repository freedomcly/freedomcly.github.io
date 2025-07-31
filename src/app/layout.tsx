import type {Metadata} from 'next';
import '@/styles/common/globals.css';
import {LanguageProvider} from '@/contexts/LanguageContext';
import {ThemeProvider} from '@/contexts/ThemeContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import PageTracker from '@/components/PageTracker';
import ScrollTracker from '@/components/ScrollTracker';

export const metadata: Metadata = {
  title: 'Tracy Cui - Senior Front End Engineer, JavaScript Expert',
  description: 'Tracy Cui - Senior Front End Engineer, JavaScript Expert',
  icons: [{
    rel: 'icon',
    url: '/favicon.ico'
  }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <ThemeProvider>
          <LanguageProvider>
            <PageTracker />
            <ScrollTracker />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
