import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { siteConfig } from '@/src/config/site';
import { JsonLd } from '@/src/components/JsonLd';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || siteConfig.seo.siteUrl),
  title: {
    default: `${siteConfig.businessName} - Commercial Rooftop Solar & Hybrid EPC Ethiopia`,
    template: `%s | ${siteConfig.businessName}`,
  },
  description: siteConfig.shortDescription,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.businessName }],
  creator: siteConfig.businessName,
  publisher: siteConfig.businessName,
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: `${siteConfig.businessName} - Commercial Solar EPC Contractor Ethiopia`,
    description: siteConfig.shortDescription,
    url: siteConfig.seo.siteUrl,
    siteName: siteConfig.businessName,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://picsum.photos/seed/ethiopia-solar-rooftop/1200/630',
        width: 1200,
        height: 630,
        alt: `${siteConfig.businessName} - Commercial Rooftop Solar Array Installation`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.businessName} - Commercial Solar EPC Contractor Ethiopia`,
    description: siteConfig.shortDescription,
    images: ['https://picsum.photos/seed/ethiopia-solar-rooftop/1200/630'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#12372A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-[#12372A] text-[#F5F7F2] antialiased selection:bg-[#2F7D57]/35 selection:text-[#FFFFFF] font-sans" suppressHydrationWarning>
        <Suspense fallback={null}>
          <JsonLd />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
