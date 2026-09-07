import { reopenConsentBanner } from '../../lib/consent';
import type { LandingContent } from '../../content/types';
import type { MarketCode } from '../../lib/routes';
import { Logo } from './Logo';

interface FooterProps {
  content: LandingContent['footer'];
  logoSrc: string;
  market: MarketCode;
}

export function Footer({ content, logoSrc, market }: FooterProps) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row lg:px-8">
        <Logo src={logoSrc} alt={content.logoAlt} />
        <nav aria-label="Liens légaux" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {content.legalLinks.map((link) => (
            <a
              key={link.slug}
              href={`/${market}/${link.slug}`}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-navy"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={reopenConsentBanner}
            className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-navy"
          >
            Gérer les cookies
          </button>
        </nav>
        <p className="text-xs text-muted-foreground">{content.copyright}</p>
      </div>
    </footer>
  );
}
