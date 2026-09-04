import type { ReactNode, SVGProps } from 'react';

/**
 * Minimal inline stroke icons (no icon library — keeps the bundle light).
 * All 24x24, currentColor, 1.75 stroke.
 */
type IconProps = SVGProps<SVGSVGElement>;

function base(children: ReactNode, props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const EyeIcon = (props: IconProps) =>
  base(
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>,
    props,
  );

export const StarIcon = (props: IconProps) =>
  base(<path d="m12 3 2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L12 3Z" />, props);

export const ChatIcon = (props: IconProps) =>
  base(<path d="M4 5h16v11H8.5L4 20V5Z" />, props);

export const MegaphoneIcon = (props: IconProps) =>
  base(
    <>
      <path d="M3 10v4a1 1 0 0 0 1 1h2l5 4V5L6 9H4a1 1 0 0 0-1 1Z" />
      <path d="M16 8a4 4 0 0 1 0 8" />
      <path d="M19 5a8 8 0 0 1 0 14" />
    </>,
    props,
  );

export const UsersIcon = (props: IconProps) =>
  base(
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 4.5a3 3 0 0 1 0 6.9" />
      <path d="M18.5 20a6 6 0 0 0-3.5-5.4" />
    </>,
    props,
  );

export const SearchIcon = (props: IconProps) =>
  base(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </>,
    props,
  );

export const MapPinIcon = (props: IconProps) =>
  base(
    <>
      <path d="M12 22s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>,
    props,
  );

export const RepeatIcon = (props: IconProps) =>
  base(
    <>
      <path d="M4 12a8 8 0 0 1 14.5-4.5M20 12a8 8 0 0 1-14.5 4.5" />
      <path d="M18.5 3v4.5H14M5.5 21v-4.5H10" />
    </>,
    props,
  );

export const TrendingUpIcon = (props: IconProps) =>
  base(
    <>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>,
    props,
  );

export const CheckIcon = (props: IconProps) => base(<path d="M20 6 9 17l-5-5" />, props);

export const ChevronDownIcon = (props: IconProps) => base(<path d="m6 9 6 6 6-6" />, props);

export const ShieldCheckIcon = (props: IconProps) =>
  base(
    <>
      <path d="M12 3 4.5 6v6c0 4.6 3.2 8 7.5 9 4.3-1 7.5-4.4 7.5-9V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </>,
    props,
  );

export const ArrowRightIcon = (props: IconProps) => base(<path d="M4 12h16M13 5l7 7-7 7" />, props);

export const SparklesIcon = (props: IconProps) =>
  base(
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="m6 6 2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </>,
    props,
  );
