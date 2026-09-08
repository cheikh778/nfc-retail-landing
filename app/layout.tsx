import type { Metadata } from 'next';
import { Public_Sans, Space_Grotesk } from 'next/font/google';
import { ORGANIZATION_JSON_LD, SITE_NAME, SITE_URL, WEBSITE_JSON_LD } from '@/lib/seo';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Améliorez la visibilité de votre établissement`,
    template: `%s — ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${publicSans.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([ORGANIZATION_JSON_LD, WEBSITE_JSON_LD]),
          }}
        />
      </body>
    </html>
  );
}
