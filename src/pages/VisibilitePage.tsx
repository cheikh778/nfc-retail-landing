import { useEffect } from 'react';
import { ConsentBanner } from '../components/consent/ConsentBanner';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { StickyCta } from '../components/layout/StickyCta';
import { Automation } from '../components/sections/Automation';
import { Faq } from '../components/sections/Faq';
import { FinalCta } from '../components/sections/FinalCta';
import { Hero } from '../components/sections/Hero';
import { Journey } from '../components/sections/Journey';
import { Proof } from '../components/sections/Proof';
import { LeadForm } from '../components/form/LeadForm';
import { getContent } from '../content';
import { useAnalyticsBootstrap } from '../hooks/useAnalyticsBootstrap';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { captureAttribution } from '../lib/utm';
import { track } from '../lib/tracking';

export function VisibilitePage() {
  const content = getContent('fr');

  useDocumentMeta({
    title: content.meta.title,
    description: content.meta.description,
    canonicalUrl: content.meta.canonicalUrl,
    robots: content.meta.robots,
  });
  useAnalyticsBootstrap();

  useEffect(() => {
    captureAttribution();
    track('landing_view');
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <Header content={content.header} />
      <main id="main-content">
        <Hero content={content.hero} />
        <Journey content={content.journey} />
        <Automation content={content.automation} />
        <Faq content={content.faq} />
        <Proof content={content.proof} />
        <LeadForm content={content.form} />
        <FinalCta content={content.finalCta} />
      </main>
      <Footer content={content.footer} logoSrc={content.header.logoSrc} />
      <StickyCta label={content.stickyCta.label} href={content.hero.ctaHref} formAnchorId={content.form.anchorId} />
      <ConsentBanner />
    </>
  );
}
