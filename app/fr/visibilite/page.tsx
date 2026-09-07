import type { Metadata } from 'next';
import { LandingClient } from '@/components/landing/LandingClient';
import { getContent } from '@/content';

const content = getContent();

export const metadata: Metadata = {
  title: { absolute: content.meta.title },
  description: content.meta.description,
  alternates: { canonical: content.meta.canonicalUrl },
  robots:
    content.meta.robots === 'index, follow'
      ? { index: true, follow: true }
      : { index: false, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: content.meta.canonicalUrl,
    siteName: 'NFC Retail',
    title: content.meta.title,
    description: content.meta.description,
    images: [{ url: content.meta.ogImage, width: 1200, height: 630, alt: 'NFC Retail' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: content.meta.title,
    description: content.meta.description,
    images: [content.meta.ogImage],
  },
};

export default function VisibilitePage() {
  return <LandingClient />;
}
