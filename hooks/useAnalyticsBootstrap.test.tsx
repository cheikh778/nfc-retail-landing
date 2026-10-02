import { StrictMode } from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setConsent } from '@/lib/consent';
import { useAnalyticsBootstrap } from './useAnalyticsBootstrap';

const route = vi.hoisted(() => ({ path: '/fr/visibilite' }));
vi.mock('next/navigation', () => ({ usePathname: () => route.path }));

function Harness() {
  useAnalyticsBootstrap();
  return null;
}
function pageViews() {
  return window.dataLayer.filter((entry) => (entry as { event?: string }).event === 'page_view');
}

beforeEach(() => {
  localStorage.clear();
  window.dataLayer = [];
  route.path = '/fr/visibilite';
  window.history.replaceState({}, '', route.path);
});
afterEach(cleanup);

describe('page measurement', () => {
  it('counts the current page once after late consent, including React StrictMode', () => {
    render(<StrictMode><Harness /></StrictMode>);
    expect(pageViews()).toHaveLength(0);
    act(() => setConsent('accepted'));
    expect(pageViews()).toHaveLength(1);
    act(() => setConsent('accepted'));
    expect(pageViews()).toHaveLength(1);
  });

  it('counts navigation and return visits but skips rejected visits', () => {
    setConsent('accepted');
    const { rerender } = render(<Harness />);
    route.path = '/fr/visibilite/merci';
    window.history.replaceState({}, '', route.path);
    rerender(<Harness />);
    expect(pageViews()).toHaveLength(2);
    act(() => setConsent('rejected'));
    route.path = '/fr/mentions-legales';
    window.history.replaceState({}, '', route.path);
    rerender(<Harness />);
    expect(pageViews()).toHaveLength(2);
    act(() => setConsent('accepted'));
    expect(pageViews()).toHaveLength(3);
  });
});
