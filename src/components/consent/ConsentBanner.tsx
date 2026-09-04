import { useEffect, useState } from 'react';
import { CONSENT_REOPEN_EVENT, getConsent, setConsent } from '../../lib/consent';
import styles from './ConsentBanner.module.css';

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
    <div className={styles.banner} role="dialog" aria-label="Gestion des cookies" aria-live="polite">
      <div className={styles.inner}>
        <p className={styles.text}>
          Nous utilisons des cookies de mesure d’audience pour comprendre l’usage de cette page. Aucune donnée
          personnelle n’est envoyée à ces outils.{' '}
          <a href="/fr/politique-de-confidentialite" className={styles.link}>
            En savoir plus
          </a>
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className="btn btn-secondary"
            data-testid="consent-reject"
            onClick={() => choose('rejected')}
          >
            Refuser
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-testid="consent-accept"
            onClick={() => choose('accepted')}
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
