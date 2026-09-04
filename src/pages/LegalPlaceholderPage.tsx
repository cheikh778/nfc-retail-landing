import { useParams } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { getContent } from '../content';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { normalizeMarket } from '../lib/routes';
import styles from './LegalPlaceholderPage.module.css';

interface LegalPlaceholderPageProps {
  title: string;
}

export function LegalPlaceholderPage({ title }: LegalPlaceholderPageProps) {
  const market = normalizeMarket(useParams<{ market: string }>().market);
  const content = getContent(market);

  useDocumentMeta({ title: `${title} — NFC Retail`, robots: 'noindex, follow' });

  return (
    <>
      <Header content={content.header} />
      <main id="main-content">
        <section className={`section ${styles.section}`}>
          <div className="container">
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.body}>{content.legalPlaceholder.body}</p>
          </div>
        </section>
      </main>
      <Footer content={content.footer} logoSrc={content.header.logoSrc} market={market} />
    </>
  );
}
