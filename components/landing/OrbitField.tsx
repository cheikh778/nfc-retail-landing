/**
 * Two counter-rotating groups of brand logos. Group A rides the outer ring and
 * turns clockwise; group B rides the middle ring and turns anticlockwise — so
 * the groups sweep toward each other but, being on different radii, never
 * touch. Ported from the design's orbit concept (scratchpad/design/Main.dc.html).
 */
const RINGS = [
  { radiusVar: 'var(--r1)', color: 'color-mix(in oklch, #e2452c 10%, white)' },
  { radiusVar: 'var(--r2)', color: 'color-mix(in oklch, #e2452c 8%, white)' },
  { radiusVar: 'var(--r3)', color: 'color-mix(in oklch, #e2452c 6%, white)' },
] as const;

interface Badge {
  key: string;
  src: string;
  alt: string;
  /** Angle (deg) of this logo within its group. */
  slot: number;
  imgPct: number;
}

interface OrbitGroup {
  radiusVar: string;
  durationSeconds: number;
  /** 'normal' = clockwise, 'reverse' = anticlockwise. */
  direction: 'normal' | 'reverse';
  badges: Badge[];
}

const GROUPS: OrbitGroup[] = [
  {
    // Outer ring — starts clustered on the right, turns clockwise toward the left.
    radiusVar: 'var(--r3)',
    durationSeconds: 78,
    direction: 'normal',
    badges: [
      { key: 'google', src: '/assets/landing/fr/google-logo.png', alt: 'Google', slot: -54, imgPct: 0.58 },
      { key: 'chatgpt', src: '/assets/landing/fr/chatgpt-logo.png', alt: 'ChatGPT', slot: -18, imgPct: 0.54 },
      { key: 'maps', src: '/assets/landing/fr/maps-icon.png', alt: 'Google Maps', slot: 18, imgPct: 0.48 },
      { key: 'ads', src: '/assets/landing/fr/ads-icon.png', alt: 'Google Ads', slot: 54, imgPct: 0.56 },
    ],
  },
  {
    // Middle ring — starts clustered on the left, turns anticlockwise toward the right.
    radiusVar: 'var(--r2)',
    durationSeconds: 64,
    direction: 'reverse',
    badges: [
      { key: 'cart', src: '/assets/landing/fr/logo-icon.png', alt: 'NFC Retail', slot: 150, imgPct: 0.52 },
      { key: 'star', src: '/assets/landing/fr/review-star.png', alt: 'Avis clients', slot: 180, imgPct: 0.64 },
      { key: 'thumbs', src: '/assets/landing/fr/review-thumbs.png', alt: 'Avis positifs', slot: 210, imgPct: 0.64 },
    ],
  },
];

export function OrbitField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {RINGS.map((ring, i) => (
        <div
          key={i}
          className="orbit-ring"
          style={
            {
              width: `calc(${ring.radiusVar} * 2)`,
              height: `calc(${ring.radiusVar} * 2)`,
              ['--ring-color' as string]: ring.color,
            } as React.CSSProperties
          }
        />
      ))}

      {GROUPS.map((group, gi) => (
        <div
          key={gi}
          className="orbit-group"
          style={
            {
              ['--spin-dur' as string]: `${group.durationSeconds}s`,
              ['--spin-dir' as string]: group.direction,
              ['--spin-dir-rev' as string]: group.direction === 'normal' ? 'reverse' : 'normal',
            } as React.CSSProperties
          }
        >
          {group.badges.map((badge) => (
            <div
              key={badge.key}
              className="orbit-badge"
              style={
                {
                  ['--radius' as string]: group.radiusVar,
                  ['--slot' as string]: `${badge.slot}deg`,
                  ['--img-pct' as string]: String(badge.imgPct),
                } as React.CSSProperties
              }
            >
              <span className="orbit-badge__img" style={{ ['--spin-dur' as string]: `${group.durationSeconds}s` } as React.CSSProperties}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={badge.src} alt={badge.alt} loading="lazy" />
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
