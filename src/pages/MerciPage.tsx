import { useParams } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { CheckIcon } from '../components/icons';
import { getContent } from '../content';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { normalizeMarket, ROUTES } from '../lib/routes';
import styles from './MerciPage.module.css';

export function MerciPage() {
  const market = normalizeMarket(useParams<{ market: string }>().market);
  const content = getContent(market);

  useDocumentMeta({
    title: `${content.confirmation.title} — NFC Retail`,
    robots: 'noindex, nofollow',
  });

  return (
    <>
      <Header content={content.header} />
      <main id="main-content">
        <section className={`section ${styles.section}`}>
          <div className={`container ${styles.inner}`}>
            <span className={styles.check}>
              <CheckIcon />
            </span>
            <h1 className={styles.title}>{content.confirmation.title}</h1>
            <p className={styles.body}>{content.confirmation.body}</p>

            <div className={styles.nextSteps}>
              <h2 className={styles.nextStepsTitle}>{content.confirmation.nextStepsTitle}</h2>
              <ol className={styles.stepsList}>
                {content.confirmation.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>

            <a href={ROUTES.visibilite(market)} className="btn btn-secondary">
              {content.confirmation.backHomeLabel}
            </a>
          </div>
        </section>
      </main>
      <Footer content={content.footer} logoSrc={content.header.logoSrc} market={market} />
    </>
  );
}
