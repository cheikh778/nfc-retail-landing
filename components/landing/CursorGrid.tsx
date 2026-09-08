'use client';

import { useEffect, useRef } from 'react';

/**
 * A sheet of graph-paper "carreaux" that only shows through wherever the cursor
 * is — a soft radial window into the grid follows the pointer, so empty areas of
 * the hero reveal a faint primary-colour lattice as you move over them. Content
 * sits above it (z-0, pointer-events: none), so it reads as texture behind the
 * page, never in the way. Disabled for touch pointers and reduced-motion users.
 */
export function CursorGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (noMotion || coarse) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--cx', `${event.clientX - rect.left}px`);
        el.style.setProperty('--cy', `${event.clientY - rect.top}px`);
        el.style.setProperty('--on', '1');
      });
    };
    const onLeave = () => el.style.setProperty('--on', '0');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} aria-hidden className="cursor-grid" />;
}
