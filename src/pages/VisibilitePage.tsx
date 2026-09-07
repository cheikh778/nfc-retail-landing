import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ConsentBanner } from '../components/consent/ConsentBanner';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { StickyCta } from '../components/layout/StickyCta';
import { Automation } from '../components/sections/Automation';
import { FinalCta } from '../components/sections/FinalCta';
import { Hero } from '../components/sections/Hero';
import { Journey } from '../components/sections/Journey';
import { Product } from '../components/sections/Product';
import { LeadForm } from '../components/form/LeadForm';
import { getContent } from '../content';
import { useAnalyticsBootstrap } from '../hooks/useAnalyticsBootstrap';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { normalizeMarket } from '../lib/routes';
import { captureAttribution } from '../lib/utm';
import { track } from '../lib/tracking';

export function VisibilitePage() {
  const market = normalizeMarket(useParams<{ market: string }>().market);
  const content = getContent(market);

  useDocumentMeta({
    title: content.meta.title,
    description: content.meta.description,
    canonicalUrl: content.meta.canonicalUrl,
    robots: content.meta.robots,
  });
  useAnalyticsBootstrap();

  useEffect(() => {
    captureAttribution();
    track('landing_view', { market });
  }, [market]);

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <Header content={content.header} />
      <main id="main-content">
        <Hero content={content.hero} />
        <Journey content={content.journey} />
        <Product content={content.product} />
        <Automation content={content.automation} />
        <LeadForm content={content.form} market={market} />
        <FinalCta content={content.finalCta} />
      </main>
      <Footer content={content.footer} logoSrc={content.header.logoSrc} market={market} />
      <StickyCta label={content.stickyCta.label} href={content.hero.ctaHref} formAnchorId={content.form.anchorId} />
      <ConsentBanner />
    </div>
  );
}
