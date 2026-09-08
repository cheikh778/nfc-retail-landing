'use client';

import { useEffect, useState } from 'react';
import { CONSENT_REOPEN_EVENT, getConsent, setConsent } from '@/lib/consent';
import { PATHS } from '@/lib/paths';

/**
 * First-party, minimal consent gate for analytics. No CMP exists yet, so this
 * is deliberately simple: accept/reject, nothing loads before a choice is
 * made. Copy should be reviewed by the legal team before launch.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === 'unset');
    const reopen = () => setVisible(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  if (!visible) return null;

  const choose = (status: 'accepted' | 'rejected') => {
    setConsent(status);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-[28rem] rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:inset-x-auto sm:bottom-6 sm:right-6"
    >
      <div className="flex flex-col gap-4">
        <p className="text-xs leading-relaxed text-muted">
          Nous utilisons des cookies de mesure d’audience pour comprendre l’usage de cette page. Aucune donnée
          personnelle n’est envoyée à ces outils.{' '}
          <a href={PATHS.politiqueConfidentialite} className="font-semibold text-navy underline underline-offset-2">
            En savoir plus
          </a>
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            data-testid="consent-reject"
            onClick={() => choose('rejected')}
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-xs font-bold text-navy transition-colors hover:bg-[#f2f3f5]"
          >
            Refuser
          </button>
          <button
            type="button"
            data-testid="consent-accept"
            onClick={() => choose('accepted')}
            className="flex-1 rounded-xl bg-flame px-4 py-3 text-xs font-bold uppercase tracking-wide text-white transition-[filter] hover:brightness-105"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
