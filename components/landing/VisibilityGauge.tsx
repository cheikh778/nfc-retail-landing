import type { LandingContent } from '@/content/types';

interface Props {
  gauge: LandingContent['hero']['gauge'];
}

/**
 * "Score de visibilité" gauge — a half-circle meter with the search / AI engines
 * arranged on the arc feeding into it (the Solocal audit reference). Pure SVG so
 * it stays crisp at any size and themes with the design tokens.
 */
const CX = 150;
const CY = 150;
const R = 126;
/** score 0 → needle at 180° (left), score 100 → 0° (right). */
const scoreToAngle = (score: number) => 180 - (Math.min(100, Math.max(0, score)) * 180) / 100;

/** Rounded to 2dp so server and client render byte-identical SVG (no hydration mismatch). */
const r2 = (n: number) => Number(n.toFixed(2));

function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [r2(CX + r * Math.cos(a)), r2(CY - r * Math.sin(a))];
}

function arcPath(r: number, startDeg: number, endDeg: number): string {
  const [x1, y1] = polar(r, startDeg);
  const [x2, y2] = polar(r, endDeg);
  const largeArc = Math.abs(startDeg - endDeg) > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

const CONNECTOR_COLORS = ['#4285F4', '#34A853', '#10A37F', '#FBBC05', '#E2452C'];

export function VisibilityGauge({ gauge }: Props) {
  const needleAngle = scoreToAngle(gauge.score);
  const [needleX, needleY] = polar(R - 28, needleAngle);
  const engines = gauge.engines.slice(0, 5);
  // Keep every logo on the upper arc — not hanging off the horizontal ends.
  const spread = 108;
  const step = engines.length > 1 ? spread / (engines.length - 1) : 0;

  return (
    <div className="visibility-gauge" aria-hidden>
      <svg viewBox="-18 -44 336 210" role="img">
        <defs>
          <linearGradient id="gaugeArc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#E2452C" />
            <stop offset="0.55" stopColor="#F0A92C" />
            <stop offset="1" stopColor="#33A15D" />
          </linearGradient>
        </defs>

        {/* track + value arc */}
        <path d={arcPath(R, 180, 0.01)} stroke="#ECE9E6" strokeWidth="15" fill="none" strokeLinecap="round" />
        <path
          d={arcPath(R, 180, needleAngle)}
          stroke="url(#gaugeArc)"
          strokeWidth="15"
          fill="none"
          strokeLinecap="round"
        />

        {/* engines on the arc, each with a short connector spoke */}
        {engines.map((engine, i) => {
          const angle = 90 + spread / 2 - i * step;
          const [lineX1, lineY1] = polar(R + 8, angle);
          const [lineX2, lineY2] = polar(R + 24, angle);
          const [bubbleX, bubbleY] = polar(R + 44, angle);
          return (
            <g key={engine.alt}>
              <line
                x1={lineX1}
                y1={lineY1}
                x2={lineX2}
                y2={lineY2}
                stroke={CONNECTOR_COLORS[i % CONNECTOR_COLORS.length]}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx={bubbleX} cy={bubbleY} r="22" fill="#fff" stroke="#ECE9E6" strokeWidth="1" />
              <image
                href={engine.src}
                x={bubbleX - 14}
                y={bubbleY - 14}
                width="28"
                height="28"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          );
        })}

        {/* needle */}
        <line x1={CX} y1={CY} x2={needleX} y2={needleY} stroke="#213F74" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx={CX} cy={CY} r="9" fill="#213F74" />
      </svg>

      <div className="visibility-gauge__readout">
        <span className="visibility-gauge__score">
          {gauge.score}
          <i>%</i>
        </span>
        <span className="visibility-gauge__label">{gauge.scoreLabel}</span>
      </div>
    </div>
  );
}
