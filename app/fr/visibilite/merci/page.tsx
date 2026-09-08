import type { Metadata } from 'next';
import { MerciClient } from '@/components/landing/MerciClient';

export const metadata: Metadata = {
  title: 'Merci — votre demande a bien été reçue',
  robots: { index: false, follow: false },
};

export default function MerciPage() {
  return <MerciClient />;
}
