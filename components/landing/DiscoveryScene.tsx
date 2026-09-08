interface Props {
  scribbles: { left: string; right: string };
}

/** Renders a string with `\n` as <br/>. */
function multiline(text: string) {
  return text.split('\n').map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line}
    </span>
  ));
}

/**
 * "Found on Google & ChatGPT" scene — the supplied two-phone render
 * (public/assets/landing/fr/phone.webp) with the two hand-written notes.
 * Purely illustrative.
 */
export function DiscoveryScene({ scribbles }: Props) {
  return (
    <div className="discovery-scene" aria-hidden>
      <span className="scribble s1">{multiline(scribbles.left)}</span>
      <span className="scribble s2">{multiline(scribbles.right)}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="discovery-scene__img"
        src="/assets/landing/fr/phone.webp"
        alt="Votre établissement mis en avant sur Google et ChatGPT"
      />
    </div>
  );
}
