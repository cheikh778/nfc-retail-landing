'use client';

import { useEffect } from 'react';
import { getContent } from '@/content';
import { captureAttribution } from '@/lib/utm';
import { Header } from './Header';
import { Hero } from './Hero';
import { TrustBar } from './TrustBar';

export function LandingClient() {
  const content = getContent();

  useEffect(() => {
    captureAttribution();
  }, []);

  return (
    <div className="landing-page">
      <a href="#top" className="skip-link" data-analytics-id="skip_to_content" data-analytics-location="header">
        Aller au contenu principal
      </a>
      <Header content={content.header} cookieSettingsLabel={content.footer.manageCookiesLabel} />
      <Hero content={content.hero} form={content.form} />
      <TrustBar content={content.trust} />
      <a
        className="mobile-sticky-cta"
        href="#diagnostic"
        data-analytics-id="diagnostic_cta"
        data-analytics-location="mobile_sticky"
        data-analytics-event="cta_click"
      >
        {content.mobileCtaLabel}
      </a>
    </div>
  );
}
