import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

/** jsdom has no IntersectionObserver; components using it (e.g. Reveal) only need a no-op stub in tests. */
class MockIntersectionObserver {
  root: Element | Document | null = null;
  rootMargin = '';
  thresholds: ReadonlyArray<number> = [];
  scrollMargin = '';
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
