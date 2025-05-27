import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tracy Cui - Senior Front-end Engineer, JavaScript Expert',
  description: 'Tracy Cui - Senior Front-end Engineer, JavaScript Expert',
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
