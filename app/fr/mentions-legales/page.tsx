import type { Metadata } from 'next';
import { LegalPage } from '@/components/landing/LegalPage';

export const metadata: Metadata = {
  title: 'Mentions légales',
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return <LegalPage title="Mentions légales" />;
}
