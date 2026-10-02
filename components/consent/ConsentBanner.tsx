'use client';

import { useEffect, useRef, useState } from 'react';
import { CONSENT_CHANGE_EVENT, CONSENT_KEY, CONSENT_REOPEN_EVENT, getConsent, setConsent } from '@/lib/consent';
import { PATHS } from '@/lib/paths';

/**
 * First-party, minimal consent gate for analytics. No CMP exists yet, so this
 * is deliberately simple: accept/reject, nothing loads before a choice is
 * made. Copy should be reviewed by the legal team before launch.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const focusOnReopen = useRef(false);

  const restoreFocus = () => {
    const opener = openerRef.current;
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  };

  useEffect(() => {
    setVisible(getConsent() === 'unset');
    const reopen = () => {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (dialogRef.current) {
        dialogRef.current.querySelector('button')?.focus();
      } else {
        focusOnReopen.current = true;
      }
      setVisible(true);
    };
    const sync = () => {
      const show = getConsent() === 'unset';
      if (!show && dialogRef.current?.contains(document.activeElement)) restoreFocus();
      setVisible(show);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) sync();
    };
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
      window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    if (visible && focusOnReopen.current) {
      dialogRef.current?.querySelector('button')?.focus();
      focusOnReopen.current = false;
    }
  }, [visible]);

  if (!visible) return null;

  const choose = (status: 'accepted' | 'rejected') => {
    setConsent(status);
    setVisible(false);
    restoreFocus();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      data-analytics-ignore
      onFocusCapture={(event) => {
        if (event.relatedTarget instanceof HTMLElement && !event.currentTarget.contains(event.relatedTarget)) {
          openerRef.current = event.relatedTarget;
        }
      }}
      aria-label="Gestion des cookies"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-[28rem] rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] sm:inset-x-auto sm:bottom-6 sm:right-6"
    >
      <div className="flex flex-col gap-4">
        <p className="text-xs leading-relaxed text-muted">
          Nous utilisons Google Analytics pour mesurer les visites et les interactions sur ce site. Le contenu
          du formulaire n’est pas envoyé à Google Analytics. Vous pouvez refuser ou modifier votre choix à tout moment.{' '}
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
