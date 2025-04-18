import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import '../styles/globals.css'
const inter = Inter({ subsets: ['latin'] });

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