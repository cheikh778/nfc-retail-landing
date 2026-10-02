'use client';

import type { LandingContent } from '@/content/types';
import { PATHS } from '@/lib/paths';
import { reopenConsentBanner } from '@/lib/consent';

interface HeaderProps {
  content: LandingContent['header'];
  cookieSettingsLabel?: string;
}

const CHANNEL_ICON: Record<string, string> = {
  Google: '/assets/landing/fr/google-g.svg',
  ChatGPT: '/assets/landing/fr/chatgpt.svg',
  'Moteurs IA': '/assets/landing/fr/ai-stars.svg',
};

export function Header({ content, cookieSettingsLabel }: HeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href={PATHS.visibilite} aria-label={`${content.brandStrong} ${content.brandRest}`} data-analytics-id="brand_home" data-analytics-location="header">
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
        {cookieSettingsLabel && (
          <button
            type="button"
            className="cookie-settings"
            onClick={reopenConsentBanner}
            data-analytics-id="manage_cookies"
            data-analytics-location="header"
          >
            {cookieSettingsLabel}
          </button>
        )}
      </nav>
    </header>
  );
}
