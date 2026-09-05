import { Check } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { getContent } from '../content';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { normalizeMarket, ROUTES } from '../lib/routes';

interface MerciLocationState {
  firstName?: string;
  establishmentName?: string;
}

export function MerciPage() {
  const market = normalizeMarket(useParams<{ market: string }>().market);
  const content = getContent(market);
  const { firstName, establishmentName } = (useLocation().state as MerciLocationState | null) ?? {};
  const title = content.confirmation.title(firstName);
  const body = content.confirmation.body(establishmentName);

  useDocumentMeta({
    title: `${title} — NFC Retail`,
    robots: 'noindex, nofollow',
  });

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Header content={content.header} />
      <main id="main-content">
        <section className="flex min-h-[70vh] items-center py-24 pt-32 sm:pt-40">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-5 text-center sm:px-6">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-flame-soft text-flame">
              <Check className="h-7 w-7" aria-hidden />
            </span>
            <h1 className="text-balance font-display text-2xl font-700 text-navy sm:text-3xl">{title}</h1>
            <p className="text-base leading-relaxed text-muted-foreground">{body}</p>

            <div className="w-full rounded-2xl border border-border bg-cream p-6 text-left">
              <h2 className="mb-3 text-xs font-700 uppercase tracking-[0.14em] text-navy">
                {content.confirmation.nextStepsTitle}
              </h2>
              <ol className="flex flex-col gap-2 pl-5 text-sm leading-snug text-muted-foreground">
                {content.confirmation.nextSteps.map((step) => (
                  <li key={step} className="list-decimal">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <a
              href={ROUTES.visibilite(market)}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-700 text-navy transition-colors duration-200 hover:bg-muted"
            >
              {content.confirmation.backHomeLabel}
            </a>
          </div>
        </section>
      </main>
      <Footer content={content.footer} logoSrc={content.header.logoSrc} market={market} />
    </div>
  );
}
