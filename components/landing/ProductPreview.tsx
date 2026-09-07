import Image from 'next/image';
import { BarChart3, Star } from 'lucide-react';
import type { LandingContent } from '@/content/types';

interface ProductPreviewProps {
  content: LandingContent['hero']['preview'];
}

/** Browser-framed dashboard shot with two floating stat cards — from Main.dc.html. */
export function ProductPreview({ content }: ProductPreviewProps) {
  return (
    <div
      id="apercu"
      className="pointer-events-none absolute left-1/2 z-[2]"
      style={{
        top: 'var(--card-top)',
        width: 'var(--card-w)',
        transform: 'translateX(-50%) scale(var(--card-scale))',
        transformOrigin: 'top center',
      }}
    >
      <div className="relative">
        <div className="overflow-hidden rounded-[18px] bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-1.5 border-b border-[#f0eeec] px-[18px] py-3.5">
            <span className="h-[9px] w-[9px] rounded-full bg-border-strong" />
            <span className="h-[9px] w-[9px] rounded-full bg-border-strong" />
            <span className="h-[9px] w-[9px] rounded-full bg-border-strong" />
            <span className="ml-2.5 text-[11.5px] text-muted-soft">{content.browserBar}</span>
          </div>
          <div className="relative h-[220px] overflow-hidden bg-[#f3f4f6] sm:h-[320px] xl:h-[400px]">
            <Image
              src={content.dashboardSrc}
              alt={content.dashboardAlt}
              width={1400}
              height={760}
              className="absolute left-0 top-0 w-full"
              sizes="(min-width: 1120px) 760px, (min-width: 768px) 620px, 340px"
              priority
            />
          </div>
        </div>

        <div className="absolute -left-[10%] top-8 hidden items-center gap-2.5 rounded-[18px] bg-card px-[15px] py-[11px] shadow-[var(--shadow-card)] sm:flex">
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px]"
            style={{ background: 'color-mix(in oklch, #e2452c 15%, white)' }}
          >
            <BarChart3 className="h-4 w-4 text-flame" aria-hidden />
          </span>
          <span>
            <span className="block text-[9.5px] font-semibold uppercase tracking-[0.02em] text-muted-soft">
              {content.statVisibiliteLabel}
            </span>
            <span className="mt-px block text-sm font-bold text-navy">{content.statVisibiliteValue}</span>
          </span>
        </div>

        <div className="absolute -right-[7%] bottom-8 hidden items-center gap-2.5 rounded-[18px] bg-card px-[15px] py-[11px] shadow-[var(--shadow-card)] sm:flex">
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px]"
            style={{ background: 'color-mix(in oklch, #e2452c 15%, white)' }}
          >
            <Star className="h-4 w-4 text-flame" aria-hidden />
          </span>
          <span>
            <span className="block text-[9.5px] font-semibold uppercase tracking-[0.02em] text-muted-soft">
              {content.statAvisLabel}
            </span>
            <span className="mt-px block text-sm font-bold text-navy">{content.statAvisValue}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
