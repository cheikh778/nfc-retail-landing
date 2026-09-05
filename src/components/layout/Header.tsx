import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { track } from '../../lib/tracking';
import type { LandingContent } from '../../content/types';
import { Logo } from './Logo';

interface HeaderProps {
  content: LandingContent['header'];
}

export function Header({ content }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-border/70 bg-background/80 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" aria-label={content.logoAlt}>
          <Logo src={content.logoSrc} alt={content.logoAlt} />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {content.navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-600 text-muted-foreground transition-colors duration-200 hover:text-navy"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={content.ctaHref}
            onClick={() => track('cta_click', { location: 'header' })}
            className="hidden rounded-xl bg-flame px-4 py-2.5 text-[13px] font-700 uppercase tracking-wide text-primary-foreground shadow-glow-flame transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 sm:inline-flex"
          >
            {content.ctaLabel}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-navy lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-b border-border bg-background/95 px-4 pb-5 pt-2 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1">
            {content.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-600 text-navy transition-colors hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
            <a
              href={content.ctaHref}
              onClick={() => {
                setOpen(false);
                track('cta_click', { location: 'header_mobile' });
              }}
              className="mt-2 rounded-xl bg-flame px-4 py-3 text-center text-sm font-700 uppercase tracking-wide text-primary-foreground shadow-glow-flame"
            >
              {content.ctaLabel}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
