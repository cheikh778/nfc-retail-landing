interface LogoProps {
  src: string;
  alt: string;
  tone?: 'dark' | 'light';
  className?: string;
}

export function Logo({ src, alt, tone = 'dark', className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src={src}
        alt={alt}
        width={440}
        height={211}
        className={`h-11 w-auto sm:h-14 ${tone === 'light' ? 'rounded-md bg-card px-2 py-1' : ''}`}
      />
    </span>
  );
}
