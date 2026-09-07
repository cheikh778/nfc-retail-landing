import Image from 'next/image';

interface LogoProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/** NFC Retail wordmark. Source asset is 440×211. */
export function Logo({ src, alt, className = 'h-10 w-auto sm:h-11', priority }: LogoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={440}
      height={211}
      priority={priority}
      className={className}
      sizes="176px"
    />
  );
}
