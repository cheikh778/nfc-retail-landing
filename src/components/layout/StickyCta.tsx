import { useEffect, useState } from 'react';
import { track } from '../../lib/tracking';
import styles from './StickyCta.module.css';

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
      className={`${styles.bar} ${formVisible ? styles.hidden : ''}`}
      aria-hidden={formVisible}
      data-testid="sticky-cta"
    >
      <a
        href={href}
        className={`btn btn-primary btn-block ${styles.cta}`}
        tabIndex={formVisible ? -1 : undefined}
        onClick={() => track('cta_click', { location: 'sticky' })}
      >
        {label}
      </a>
    </div>
  );
}
