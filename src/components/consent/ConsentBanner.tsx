import { useEffect, useState } from 'react';
import { CONSENT_REOPEN_EVENT, getConsent, setConsent } from '../../lib/consent';

/**
 * First-party, minimal consent gate for analytics (brief §36/§37). No CMP
 * exists yet in this greenfield project, so this is deliberately simple:
 * accept/reject, nothing loads before a choice is made. Copy is generic and
 * should be reviewed by the legal team before launch.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(() => getConsent() === 'unset');

  useEffect(() => {
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
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-[28rem] rounded-2xl border border-border bg-card p-5 shadow-card sm:inset-x-auto sm:right-6 sm:bottom-6"
    >
      <div className="flex flex-col gap-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Nous utilisons des cookies de mesure d’audience pour comprendre l’usage de cette page. Aucune donnée
          personnelle n’est envoyée à ces outils.{' '}
          <a href="/fr/politique-de-confidentialite" className="font-600 text-navy">
            En savoir plus
          </a>
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            data-testid="consent-reject"
            onClick={() => choose('rejected')}
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-xs font-700 text-navy transition-colors duration-200 hover:bg-muted"
          >
            Refuser
          </button>
          <button
            type="button"
            data-testid="consent-accept"
            onClick={() => choose('accepted')}
            className="flex-1 rounded-xl bg-flame px-4 py-3 text-xs font-700 uppercase tracking-wide text-primary-foreground shadow-glow-flame transition-all duration-300 hover:brightness-105"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
