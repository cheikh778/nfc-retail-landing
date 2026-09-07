import { SectionHeader } from '../ui/SectionHeader';
import { Reveal } from '../ui/Reveal';
import { DashboardMockup } from '../ui/DashboardMockup';
import type { LandingContent } from '../../content/types';

interface ProductProps {
  content: LandingContent['product'];
}

export function Product({ content }: ProductProps) {
  return (
    <section id="produit" className="relative overflow-hidden bg-cream py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(50rem 26rem at 85% 10%, oklch(0.572 0.196 36.3 / 0.05), transparent 60%)' }}
      />
      <div className="relative mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-10">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />
        <Reveal delay={150} className="mx-auto mt-16 max-w-5xl">
          <DashboardMockup />
        </Reveal>
      </div>
    </section>
  );
}
