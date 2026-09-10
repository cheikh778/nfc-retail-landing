import type { Metadata } from 'next';
import { getContent } from '@/content';
import { LegalPage } from '@/components/landing/LegalPage';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  robots: { index: false, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  const content = getContent();
  return <LegalPage title="Politique de confidentialité" document={content.legal.politiqueConfidentialite} />;
}
