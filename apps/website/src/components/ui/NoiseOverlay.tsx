interface NoiseOverlayProps {
  opacity?: number;
  fixed?: boolean;
  blendMode?: "overlay" | "soft-light" | "screen" | "multiply";
  zIndex?: number;
}

/**
 * Subtle SVG noise/grain overlay for cinematic texture on dark sections.
 */
export const NoiseOverlay = ({
  opacity = 0.04,
  fixed = false,
  blendMode = "overlay",
  zIndex = 1,
}: NoiseOverlayProps) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  const url = `url("data:image/svg+xml;utf8,${svg}")`;

  return (
    <div
      aria-hidden
      className={`${fixed ? "fixed" : "absolute"} inset-0 pointer-events-none`}
      style={{
        backgroundImage: url,
        backgroundSize: "240px 240px",
        opacity,
        mixBlendMode: blendMode,
        zIndex,
      }}
    />
  );
};

export default NoiseOverlay;
