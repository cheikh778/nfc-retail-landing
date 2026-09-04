interface EyebrowProps {
  children: string;
  dark?: boolean;
}

/** Small uppercase label with a slowly spinning sparkle mark, used above every section title. */
export function Eyebrow({ children, dark }: EyebrowProps) {
  return (
    <span className={`eyebrow ${dark ? 'eyebrow-dark' : ''}`}>
      <svg className="eyebrow-icon" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
        <path d="M18 8.1H11.16L16.02 3.24L14.76 1.98L9.9 6.84V0H8.1V6.84L3.24 1.98L1.98 3.24L6.84 8.1H0V9.9H6.84L1.98 14.76L3.24 16.02L8.1 11.16V18H9.9V11.16L14.76 16.02L16.02 14.76L11.16 9.9H18V8.1Z" />
      </svg>
      {children}
    </span>
  );
}
