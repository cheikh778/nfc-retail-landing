'use client';

import { useEffect } from 'react';
import { ConsentBanner } from '@/components/consent/ConsentBanner';
import { getContent } from '@/content';
import { useAnalyticsBootstrap } from '@/hooks/useAnalyticsBootstrap';
import { track } from '@/lib/tracking';
import { captureAttribution } from '@/lib/utm';
import { Header } from './Header';
import { Hero } from './Hero';
import { TrustBar } from './TrustBar';

export function LandingClient() {
  const content = getContent();

  useAnalyticsBootstrap();

  useEffect(() => {
    captureAttribution();
    track('landing_view');
  }, []);

  return (
    <>
      <a href="#top" className="skip-link">
        Aller au contenu principal
      </a>
      <Header content={content.header} />
      <Hero content={content.hero} form={content.form} />
      <TrustBar content={content.trust} />
      <a
        className="mobile-sticky-cta"
        href="#diagnostic"
        onClick={() => track('cta_click', { location: 'mobile_sticky' })}
      >
        {content.mobileCtaLabel}
      </a>
      <ConsentBanner />
    </>
  );
}
