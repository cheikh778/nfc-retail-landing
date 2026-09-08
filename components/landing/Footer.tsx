'use client';

import Image from 'next/image';
import { reopenConsentBanner } from '@/lib/consent';
import type { LandingContent } from '@/content/types';

interface FooterProps {
  content: LandingContent['footer'];
}

export function Footer({ content }: FooterProps) {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3.5 px-5 py-12 text-center">
        <Image
          src="/assets/landing/fr/logo.png"
          alt={content.logoAlt}
          width={440}
          height={211}
          className="h-7 w-auto"
          sizes="112px"
        />
        <p className="max-w-sm text-[13px] text-muted-soft">{content.tagline}</p>
        <nav aria-label="Liens légaux" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] font-medium text-muted-soft">
          {content.links.map((link, i) => (
            <span key={link.href} className="inline-flex items-center gap-3">
              {i > 0 && <span aria-hidden className="opacity-50">•</span>}
              <a
                href={link.href}
                {...(link.external ? { rel: 'noopener' } : {})}
                className="transition-colors hover:text-navy"
              >
                {link.label}
              </a>
            </span>
          ))}
          <span className="inline-flex items-center gap-3">
            <span aria-hidden className="opacity-50">•</span>
            <button type="button" onClick={reopenConsentBanner} className="transition-colors hover:text-navy">
              {content.manageCookiesLabel}
            </button>
          </span>
        </nav>
        <p className="text-xs text-[#b7bbc2]">{content.copyright}</p>
      </div>
    </footer>
  );
}
