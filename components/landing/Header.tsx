import type { LandingContent } from '@/content/types';
import { PATHS } from '@/lib/paths';
import { Logo } from './Logo';

interface HeaderProps {
  content: LandingContent['header'];
}

export function Header({ content }: HeaderProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex h-[72px] items-center px-5 sm:h-[88px] sm:px-10 lg:px-16">
      <a href={PATHS.visibilite} aria-label={content.logoAlt}>
        <Logo src={content.logoSrc} alt={content.logoAlt} priority />
      </a>
    </header>
  );
}
