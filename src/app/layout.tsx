import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
const inter = Inter({ subsets: ['latin'] });
import '../app/globals.css'

export interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}