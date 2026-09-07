import { SectionHeader } from '../ui/SectionHeader';
import { ProcessStep } from '../ui/ProcessStep';
import type { LandingContent } from '../../content/types';

interface JourneyProps {
  content: LandingContent['journey'];
}

export function Journey({ content }: JourneyProps) {
  return (
    <section id="promesse" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-10">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} />

        <div className="mt-20">
          <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-6">
            {content.steps.map((step, i) => (
              <ProcessStep
                key={step.label}
                index={String(i + 1).padStart(2, '0')}
                title={step.label}
                description={step.description || undefined}
                delay={i * 90}
                last={i === content.steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
