/**
 * Scattered field of "coin" badges (Google, ChatGPT, Maps, Ads, reviews…) that
 * float gently and independently around the hero — like a slow constellation
 * drifting behind the headline. No rigid rings: each badge has its own drift
 * vector, duration and phase so the field never looks mechanical.
 */
interface FieldBadge {
  key: string;
  src: string;
  alt: string;
  /** Position inside the hero-visual box, in percent. */
  x: number;
  y: number;
  /** Size relative to --badge. */
  scale: number;
  /** Logo size inside the badge, as a fraction of the badge. */
  imgPct: number;
  /** Drift target for the float loop, in px. */
  driftX: number;
  driftY: number;
  floatDur: number;
  floatDelay: number;
  inDelay: number;
  /** Hidden on narrow screens where the preview card would cover it. */
  wide?: boolean;
}

const A = '/assets/landing/fr/google-logo.png';
const B = '/assets/landing/fr/chatgpt-logo.png';
const C = '/assets/landing/fr/maps-icon.png';
const D = '/assets/landing/fr/ads-icon.png';
const E = '/assets/landing/fr/review-star.png';
const F = '/assets/landing/fr/review-thumbs.png';
const G = '/assets/landing/fr/logo-icon.png';

const BADGES: FieldBadge[] = [
  { key: 'g1', src: A, alt: 'Google', x: 9, y: 13, scale: 1, imgPct: 0.56, driftX: 10, driftY: -18, floatDur: 9, floatDelay: 0, inDelay: 0.05 },
  { key: 'b1', src: B, alt: 'ChatGPT', x: 89, y: 10, scale: 0.92, imgPct: 0.54, driftX: -12, driftY: -14, floatDur: 10.5, floatDelay: 0.6, inDelay: 0.12 },
  { key: 'c1', src: C, alt: 'Google Maps', x: 15, y: 31, scale: 0.86, imgPct: 0.5, driftX: 14, driftY: 12, floatDur: 8, floatDelay: 1.2, inDelay: 0.18 },
  { key: 'e1', src: E, alt: 'Avis clients', x: 82, y: 27, scale: 1.04, imgPct: 0.62, driftX: -10, driftY: 16, floatDur: 11, floatDelay: 0.3, inDelay: 0.24 },
  { key: 'd1', src: D, alt: 'Google Ads', x: 93, y: 41, scale: 0.8, imgPct: 0.56, driftX: -8, driftY: -12, floatDur: 9.5, floatDelay: 1.8, inDelay: 0.3 },
  { key: 'f1', src: F, alt: 'Avis positifs', x: 5, y: 41, scale: 0.94, imgPct: 0.62, driftX: 12, driftY: 14, floatDur: 10, floatDelay: 0.9, inDelay: 0.36 },
  { key: 'g2', src: G, alt: 'NFC Retail', x: 20, y: 6, scale: 0.7, imgPct: 0.52, driftX: 8, driftY: -10, floatDur: 8.5, floatDelay: 2.1, inDelay: 0.42, wide: true },
  { key: 'b2', src: B, alt: 'ChatGPT', x: 7, y: 58, scale: 0.78, imgPct: 0.54, driftX: 10, driftY: -14, floatDur: 12, floatDelay: 1.5, inDelay: 0.48, wide: true },
  { key: 'g3', src: A, alt: 'Google', x: 91, y: 56, scale: 0.82, imgPct: 0.56, driftX: -12, driftY: 12, floatDur: 10.5, floatDelay: 0.4, inDelay: 0.54, wide: true },
  { key: 'c2', src: C, alt: 'Google Maps', x: 85, y: 71, scale: 0.72, imgPct: 0.5, driftX: -9, driftY: -13, floatDur: 9, floatDelay: 2.4, inDelay: 0.6, wide: true },
  { key: 'e2', src: E, alt: 'Avis clients', x: 12, y: 74, scale: 0.76, imgPct: 0.62, driftX: 11, driftY: -12, floatDur: 11.5, floatDelay: 1.1, inDelay: 0.66, wide: true },
  { key: 'd2', src: D, alt: 'Google Ads', x: 95, y: 19, scale: 0.68, imgPct: 0.56, driftX: -7, driftY: 12, floatDur: 8, floatDelay: 0.7, inDelay: 0.72 },
];

export function OrbitField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Three faint concentric "orbit" rings in the primary colour, centred
       *  behind the field. Kept very low-opacity — a hint of structure, not a
       *  focal point. The outer dashed ring drifts slowly for a sense of orbit. */}
      <svg className="orbit-rings" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <g fill="none" stroke="currentColor" strokeWidth="0.35">
          <circle cx="50" cy="50" r="19" />
          <circle cx="50" cy="50" r="32" />
          <g className="orbit-rings__spin">
            <circle cx="50" cy="50" r="46" strokeDasharray="0.5 2.6" strokeLinecap="round" />
          </g>
        </g>
      </svg>

      {BADGES.map((badge) => (
        <div
          key={badge.key}
          className={`field-badge${badge.wide ? ' field-badge--wide' : ''}`}
          style={
            {
              ['--x' as string]: `${badge.x}%`,
              ['--y' as string]: `${badge.y}%`,
              ['--scale' as string]: String(badge.scale),
              ['--in-delay' as string]: `${badge.inDelay}s`,
            } as React.CSSProperties
          }
        >
          <span
            className="field-badge__inner"
            style={
              {
                ['--drift-x' as string]: `${badge.driftX}px`,
                ['--drift-y' as string]: `${badge.driftY}px`,
                ['--float-dur' as string]: `${badge.floatDur}s`,
                ['--float-delay' as string]: `${badge.floatDelay}s`,
              } as React.CSSProperties
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={badge.src}
              alt={badge.alt}
              loading="lazy"
              style={{ width: `calc(100% * ${badge.imgPct})` }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
