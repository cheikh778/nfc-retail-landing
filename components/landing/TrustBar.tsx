import { ShieldCheck, Users } from 'lucide-react';
import type { LandingContent } from '@/content/types';

interface Props {
  content: LandingContent['trust'];
}

export function TrustBar({ content }: Props) {
  return (
    <section className="trustbar" aria-label="Éléments de confiance">
      <div>
        <b aria-hidden>
          <Users strokeWidth={2.4} />
        </b>
        <span>{content.establishments}</span>
      </div>
      <div>
        <b className="stars" aria-hidden>
          ★★★★★
        </b>
        <span>
          <strong>{content.ratingScore}</strong>
          <br />
          {content.ratingLabel}
        </span>
      </div>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/landing/fr/google-g.svg" alt="" />
        <span>{content.googlePartner}</span>
      </div>
      <div>
        <b aria-hidden>
          <ShieldCheck strokeWidth={2.4} />
        </b>
        <span>{content.rgpd}</span>
      </div>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/landing/fr/france-flag.svg" alt="" />
        <span>{content.madeInFrance}</span>
      </div>
    </section>
  );
}
