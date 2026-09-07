'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { getContent } from '@/content';
import { MERCI_CONTEXT_KEY } from '@/hooks/useLeadForm';
import { PATHS } from '@/lib/paths';
import { Footer } from './Footer';
import { Header } from './Header';

interface MerciContext {
  firstName?: string;
  establishmentName?: string;
}

export function MerciClient() {
  const content = getContent();
  const [ctx, setCtx] = useState<MerciContext>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(MERCI_CONTEXT_KEY);
      if (raw) {
        setCtx(JSON.parse(raw) as MerciContext);
        sessionStorage.removeItem(MERCI_CONTEXT_KEY);
      }
    } catch {
      // No greeting context — fall back to the generic copy.
    }
  }, []);

  const title = content.confirmation.title(ctx.firstName || undefined);
  const body = content.confirmation.body(ctx.establishmentName || undefined);

  return (
    <div className="relative min-h-screen bg-background">
      <Header content={content.header} />
      <main className="flex min-h-[80vh] items-center px-5 py-24 pt-32">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-flame/10 text-flame">
            <Check className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl">{title}</h1>
          <p className="text-base leading-relaxed text-muted">{body}</p>

          <div className="w-full rounded-2xl border border-border bg-cream p-6 text-left">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-navy">
              {content.confirmation.nextStepsTitle}
            </h2>
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-snug text-muted">
              {content.confirmation.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <a
            href={PATHS.visibilite}
            className="inline-flex items-center justify-center rounded-full border border-border-strong bg-card px-6 py-3.5 text-sm font-bold text-navy transition-colors hover:bg-[#f2f3f5]"
          >
            {content.confirmation.backHomeLabel}
          </a>
        </div>
      </main>
      <Footer content={content.footer} />
    </div>
  );
}
