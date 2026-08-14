/**
 * Kleiner gezackter Riss von der Bildkante — das „Edge"-Markenzeichen.
 * Papier-farbener Spalt + violette Linie entlang einer Risskante.
 * Positionierung (top/left/right, Größe) kommt per `style` vom Aufrufer.
 */
export const EdgeRip = ({ style }: { style: React.CSSProperties }) => (
  <svg
    aria-hidden
    viewBox="0 0 36 84"
    style={{ position: "absolute", pointerEvents: "none", ...style }}
  >
    <path
      d="M 12 0 L 27 0 L 19 15 L 28 32 L 15 50 L 21 64 L 9 84 L 13 60 L 7 46 L 19 30 L 11 14 Z"
      fill="#F2F2F2"
    />
    <path
      d="M 27 0 L 19 15 L 28 32 L 15 50 L 21 64 L 9 84"
      fill="none"
      stroke="#171717"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);
