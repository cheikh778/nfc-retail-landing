import type { Metadata } from 'next';
import { getContent } from '@/content';
import { LegalPage } from '@/components/landing/LegalPage';

export const metadata: Metadata = {
  title: 'Mentions légales',
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  const content = getContent();
  return <LegalPage title="Mentions légales" document={content.legal.mentionsLegales} />;
}
