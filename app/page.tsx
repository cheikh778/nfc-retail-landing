import type { Metadata } from 'next';
import { PATHS } from '@/lib/paths';

/**
 * In production the Cloudflare Worker routes "/" to WordPress, so this page is
 * only hit in local/static contexts. It bounces to the landing.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: PATHS.visibilite },
};

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${PATHS.visibilite}`} />
      <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <p>
          Redirection vers <a href={PATHS.visibilite}>{PATHS.visibilite}</a>…
        </p>
      </main>
    </>
  );
}
