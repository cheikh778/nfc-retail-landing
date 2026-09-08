/**
 * Hero backdrop: three faint concentric "orbit" rings in the primary colour,
 * plus the Google / ChatGPT marks blown up, blurred and merged behind the
 * gauge — a hint of "search + AI" texture, never a focal point. All decorative.
 */
export function OrbitField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-backdrop">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/landing/fr/google-logo.png" alt="" className="hero-backdrop__mark hero-backdrop__mark--a" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/landing/fr/chatgpt-logo.png" alt="" className="hero-backdrop__mark hero-backdrop__mark--b" />
      </div>

      <svg className="orbit-rings" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <g fill="none" stroke="currentColor" strokeWidth="0.35">
          <circle cx="50" cy="50" r="19" />
          <circle cx="50" cy="50" r="32" />
          <g className="orbit-rings__spin">
            <circle cx="50" cy="50" r="46" strokeDasharray="0.5 2.6" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
