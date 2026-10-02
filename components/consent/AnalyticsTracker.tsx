'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalyticsBootstrap } from '@/hooks/useAnalyticsBootstrap';
import { CONSENT_CHANGE_EVENT, CONSENT_KEY, getConsent } from '@/lib/consent';
import { track } from '@/lib/tracking';

/** Delegated clicks use static IDs; never read input values or personalized text. */
export function AnalyticsTracker() {
  const pathname = usePathname();
  useAnalyticsBootstrap();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>('[data-analytics-id]');
      if (!element || element.closest('[data-analytics-ignore]') || element.matches(':disabled')) return;
      const eventName = element.dataset.analyticsEvent === 'cta_click'
        ? 'cta_click' : element.tagName === 'BUTTON' ? 'button_click' : 'link_click';
      track(eventName, {
        element_id: element.dataset.analyticsId,
        element_type: element.tagName === 'BUTTON' ? 'button' : 'link',
        location: element.dataset.analyticsLocation,
      });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    const reached = new Set<number>();
    const onScroll = () => {
      if (getConsent() !== 'accepted') return;
      const height = document.documentElement.scrollHeight;
      if (height <= window.innerHeight) return;
      const percent = ((window.scrollY + window.innerHeight) / height) * 100;
      for (const threshold of [25, 50, 75, 90]) {
        if (percent >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          track('scroll_depth', { percent_scrolled: threshold });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let formViewed = false;
    const observer = new IntersectionObserver((entries) => {
      if (formViewed || getConsent() !== 'accepted' || !entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.25)) return;
      formViewed = true;
      track('form_view', { form_id: 'visibility_diagnostic' });
      observer.disconnect();
    }, { threshold: 0.25 });
    const observeForm = () => {
      observer.disconnect();
      const form = document.getElementById('leadForm');
      if (form && !formViewed && getConsent() === 'accepted') observer.observe(form);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) observeForm();
    };
    observeForm();
    window.addEventListener(CONSENT_CHANGE_EVENT, observeForm);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener(CONSENT_CHANGE_EVENT, observeForm);
      window.removeEventListener('storage', onStorage);
      observer.disconnect();
    };
  }, [pathname]);
  return null;
}
