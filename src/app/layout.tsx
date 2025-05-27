import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tracy Cui - Senior Front End Engineer, JavaScript Expert',
  description: 'Tracy Cui - Senior Front End Engineer, JavaScript Expert',
  icons: [{
    rel: 'icon',
    url: '/favicon.ico'
  }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
