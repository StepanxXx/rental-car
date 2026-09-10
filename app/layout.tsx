import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import 'modern-normalize';
import './reset.css';
import './globals.css';
import Header from '@/components/Header/Header';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import baseUrl from '@/lib/getBaseUrl';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-family',
  display: 'swap',
});


export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'RentalCar',
  description: 'Application for rental cars.',
  openGraph: {
    title: 'RentalCar',
    description: 'Application for rental cars.',
    url: baseUrl,
    siteName: 'RentalCar',
    images: [
      {
        url: '/hero.avif',
        width: 1200,
        height: 630,
        alt: 'RentalCar',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentalCar',
    description: 'Application for rental cars.',
    images: ['/hero.avif'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={manrope.variable}>
        <TanStackProvider>
          <Header />
          {children}
        </TanStackProvider>
      </body>
    </html>
  );
}
