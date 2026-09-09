import type { LandingContent } from '@/content/types';
import { PATHS } from '@/lib/paths';

interface HeaderProps {
  content: LandingContent['header'];
}

const CHANNEL_ICON: Record<string, string> = {
  Google: '/assets/landing/fr/google-g.svg',
  ChatGPT: '/assets/landing/fr/chatgpt.svg',
  'Moteurs IA': '/assets/landing/fr/ai-stars.svg',
};

export function Header({ content }: HeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href={PATHS.visibilite} aria-label={`${content.brandStrong} ${content.brandRest}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/landing/fr/logo.png" alt={`${content.brandStrong} ${content.brandRest}`} />
      </a>

      <nav className="channels" aria-label="Canaux de visibilité">
        {content.channels.map((channel) => (
          <span className="channel" key={channel}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={CHANNEL_ICON[channel] ?? '/assets/landing/fr/ai-stars.svg'} alt="" />
            {channel}
          </span>
        ))}
        <span className="growth">
          {content.growth[0]}
          <br />
          {content.growth[1]}
        </span>
        <span className="country">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/landing/fr/france-flag.svg" alt="" /> {content.countryLabel}
        </span>
      </nav>
    </header>
  );
}
