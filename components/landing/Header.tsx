import type { LandingContent } from '@/content/types';
import { PATHS } from '@/lib/paths';
import { Logo } from './Logo';

interface HeaderProps {
  content: LandingContent['header'];
}

export function Header({ content }: HeaderProps) {
  return (
    <header className="relative z-20 flex h-[58px] items-center border-b border-border bg-background px-5 sm:h-[64px] sm:px-10 lg:px-16">
      <a href={PATHS.visibilite} aria-label={content.logoAlt}>
        <Logo src={content.logoSrc} alt={content.logoAlt} priority />
      </a>
    </header>
  );
}
