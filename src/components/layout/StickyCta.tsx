import { useEffect, useState } from 'react';
import { track } from '../../lib/tracking';

interface StickyCtaProps {
  label: string;
  href: string;
  formAnchorId: string;
}

/** Mobile-only sticky CTA bar; hides while the lead form itself is on screen. */
export function StickyCta({ label, href, formAnchorId }: StickyCtaProps) {
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const formEl = document.getElementById(formAnchorId);
    if (!formEl) return;
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(formEl);
    return () => observer.disconnect();
  }, [formAnchorId]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,26,48,0.08)] backdrop-blur-md transition-all duration-300 sm:hidden ${
        formVisible ? 'pointer-events-none translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      aria-hidden={formVisible}
      data-testid="sticky-cta"
    >
      <a
        href={href}
        tabIndex={formVisible ? -1 : undefined}
        onClick={() => track('cta_click', { location: 'sticky' })}
        className="flex w-full items-center justify-center rounded-xl bg-flame px-6 py-4 text-sm font-700 uppercase tracking-wide text-primary-foreground shadow-glow-flame transition-all duration-300 hover:brightness-105"
      >
        {label}
      </a>
    </div>
  );
}
