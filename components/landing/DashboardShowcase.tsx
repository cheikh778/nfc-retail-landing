import Image from 'next/image';
import type { LandingContent } from '@/content/types';

interface Props {
  showcase: LandingContent['hero']['showcase'];
}

/**
 * Closing section — real product screenshots in a light browser frame. Three
 * side by side on desktop, only the first one on mobile ("trois pour desktop,
 * un pour mobile").
 */
export function DashboardShowcase({ showcase }: Props) {
  const shots = showcase.shots.slice(0, 3);

  return (
    <section className="showcase">
      <div className="showcase__grid">
        {shots.map((shot, i) => (
          <figure key={shot.src} className="showcase__screen" data-pos={i}>
            <span className="showcase__bar" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            <div className="showcase__viewport">
              <Image
                src={shot.src}
                alt={shot.alt}
                width={1400}
                height={760}
                className="showcase__img"
                sizes="(min-width: 1024px) 380px, 320px"
              />
            </div>
            <figcaption className="showcase__caption">{shot.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
