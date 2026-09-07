import { useParams } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { getContent } from '../content';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { normalizeMarket } from '../lib/routes';

interface LegalPlaceholderPageProps {
  title: string;
}

export function LegalPlaceholderPage({ title }: LegalPlaceholderPageProps) {
  const market = normalizeMarket(useParams<{ market: string }>().market);
  const content = getContent(market);

  useDocumentMeta({ title: `${title} — NFC Retail`, robots: 'noindex, follow' });

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Header content={content.header} />
      <main id="main-content">
        <section className="min-h-[50vh] py-24 pt-32 sm:pt-40">
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <h1 className="mb-4 font-display text-2xl font-700 text-navy">{title}</h1>
            <p className="max-w-[60ch] text-base leading-relaxed text-muted-foreground">
              {content.legalPlaceholder.body}
            </p>
          </div>
        </section>
      </main>
      <Footer content={content.footer} logoSrc={content.header.logoSrc} market={market} />
    </div>
  );
}
