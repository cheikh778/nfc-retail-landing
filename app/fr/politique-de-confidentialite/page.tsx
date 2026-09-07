import type { Metadata } from 'next';
import { LegalPage } from '@/components/landing/LegalPage';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  robots: { index: false, follow: true },
};

export default function PolitiqueConfidentialitePage() {
  return <LegalPage title="Politique de confidentialité" />;
}
