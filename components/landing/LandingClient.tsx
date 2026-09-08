'use client';

import { useCallback, useEffect, useState } from 'react';
import { ConsentBanner } from '@/components/consent/ConsentBanner';
import { LeadModal } from '@/components/modal/LeadModal';
import { getContent } from '@/content';
import { useAnalyticsBootstrap } from '@/hooks/useAnalyticsBootstrap';
import { track } from '@/lib/tracking';
import { captureAttribution } from '@/lib/utm';
import { Header } from './Header';
import { Hero } from './Hero';

export function LandingClient() {
  const content = getContent();
  const [modalOpen, setModalOpen] = useState(false);

  useAnalyticsBootstrap();

  useEffect(() => {
    captureAttribution();
    track('landing_view');
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu principal
      </a>
      <Header content={content.header} />
      <main id="contenu">
        <Hero content={content.hero} onOpenModal={openModal} />
      </main>
      <LeadModal open={modalOpen} onClose={closeModal} content={content.modal} />
      <ConsentBanner />
    </>
  );
}
