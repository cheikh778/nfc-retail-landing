'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { LandingContent } from '@/content/types';
import { useLeadForm } from '@/hooks/useLeadForm';
import { LeadModalStep1 } from './LeadModalStep1';
import { LeadModalStep2 } from './LeadModalStep2';

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  content: LandingContent['modal'];
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function LeadModal({ open, onClose, content }: LeadModalProps) {
  const form = useLeadForm();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      returnFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={content.stepIndicator(form.step)}
    >
      <button
        type="button"
        aria-label={content.closeLabel}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[rgba(10,13,18,0.55)] backdrop-blur-[3px] animate-[overlay-fade-in_0.35s_ease-out_both]"
      />

      <div
        ref={panelRef}
        className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-y-auto rounded-t-[24px] bg-card px-5 pb-8 pt-4 shadow-[0_-20px_44px_rgba(10,13,18,0.28)] animate-[sheet-slide-up_0.5s_cubic-bezier(0.16,1,0.3,1)_both] sm:max-h-[calc(100vh-3rem)] sm:w-[540px] sm:rounded-[20px] sm:p-11 sm:shadow-[var(--shadow-card)] sm:animate-[modal-pop_0.28s_cubic-bezier(0.16,1,0.3,1)_both]"
      >
        <span aria-hidden className="mx-auto mb-4 block h-1 w-9 shrink-0 rounded-full bg-field-border sm:hidden" />

        <button
          type="button"
          aria-label={content.closeLabel}
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-[#f2f3f5] sm:right-5 sm:top-5"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div className="pt-1">
          {form.step === 1 ? (
            <LeadModalStep1 content={content} form={form} />
          ) : (
            <LeadModalStep2 content={content} form={form} />
          )}
        </div>
      </div>
    </div>
  );
}
