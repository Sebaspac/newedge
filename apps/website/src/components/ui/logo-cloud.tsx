import { clientLogos as LOGOS_STATIC, clientLogosHeading as HEADING_STATIC } from "@/content/sections/clientLogos";
import { clientLogos as clientLogosEn, clientLogosHeading as clientLogosHeadingEn } from "@/content/en/sections/clientLogos";
import { img } from "@/content";
import { useHomeSection } from "@/hooks/useHomeContent";

/** Re-export für Bestandsimporte (z. B. PainPoint-Hero-Ticker) — bewusst statisch. */
export { LOGOS_STATIC as clientLogos };

const SANS =
  "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

/* Gemeinsame SVG-Gradient-Definition */
const ARC_GRADIENT_ID = "orb-stroke-split";

/* SVG-Bogen: obere Hälfte (erscheint VOR den Logos) */
const TopArc = ({ size }: { size: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 800 800"
    preserveAspectRatio="xMidYMid meet"
    style={{
      position: "absolute",
      left: "50%", top: "50%",
      transform: "translate(-50%, -50%)",
      width: size, height: size,
      zIndex: 3, // vor den Logos
      pointerEvents: "none",
      overflow: "visible",
    }}
  >
    <defs>
      <linearGradient id={ARC_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#CCFF00" stopOpacity="0.45" />
        <stop offset="25%"  stopColor="#CCFF00" stopOpacity="0.68" />
        <stop offset="50%"  stopColor="#CCFF00" stopOpacity="0.92" />
        <stop offset="75%"  stopColor="#CCFF00" stopOpacity="1" />
        <stop offset="100%" stopColor="#171717" stopOpacity="0.92" />
      </linearGradient>
    </defs>
    {/* Oberer Bogen: endet ÜBER der Mittellinie → lässt einen Kanal für die Logos frei.
        Endpunkte bei y=330 (= 70 Einheiten über Mitte 400), x≈9 / x≈791. */}
    <path
      d="M 9,330 A 397,397 0 0 1 791,330"
      fill="none"
      stroke={`url(#${ARC_GRADIENT_ID})`}
      strokeWidth="2"
      strokeLinecap="round"
      style={{
        filter:
          "drop-shadow(0 0 8px rgba(204,255,0,0.68)) drop-shadow(0 0 20px rgba(204,255,0,0.45)) drop-shadow(0 0 36px rgba(23,23,23,0.22))",
      }}
    />
  </svg>
);

/* SVG-Bogen: untere Hälfte (erscheint HINTER den Logos) */
const BottomArc = ({ size }: { size: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 800 800"
    preserveAspectRatio="xMidYMid meet"
    style={{
      position: "absolute",
      left: "50%", top: "50%",
      transform: "translate(-50%, -50%)",
      width: size, height: size,
      zIndex: 0, // hinter den Logos
      pointerEvents: "none",
      overflow: "visible",
    }}
  >
    {/* Unterer Bogen: beginnt UNTER der Mittellinie → spiegelt den Kanal.
        Endpunkte bei y=470 (= 70 Einheiten unter Mitte 400), x≈791 / x≈9. */}
    <path
      d="M 791,470 A 397,397 0 0 1 9,470"
      fill="none"
      stroke={`url(#${ARC_GRADIENT_ID})`}
      strokeWidth="2"
      strokeLinecap="round"
      style={{
        filter:
          "drop-shadow(0 0 8px rgba(132,118,239,0.5)) drop-shadow(0 0 16px rgba(86,88,223,0.35))",
      }}
    />
  </svg>
);

export default function LogoCloud() {
  // Inhalte live aus dem CMS (locale-fähig); Fallback: sprachrichtiger Content-Layer
  const clientLogos = useHomeSection("clientLogos", LOGOS_STATIC, clientLogosEn);
  const clientLogosHeading = useHomeSection("clientLogosHeading", HEADING_STATIC, clientLogosHeadingEn);

  const duplicatedLogos = [...clientLogos, ...clientLogos];
  const arcSize = "clamp(340px, 52vh, 520px)";
  const BG = "#0A0A18"; // muss zur Hintergrundfarbe des Hero-Blocks passen

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "transparent",
        padding: "32px 0 24px",
      }}
    >
      {/* Heading */}
      <div
        role="heading"
        aria-level={2}
        className="text-center px-4"
        style={{
          fontFamily: SANS,
          color: "#fff",
          fontSize: "clamp(16px, 1.5vw, 19px)",
          fontWeight: 700,
          letterSpacing: "-0.5px",
          lineHeight: 1.15,
        }}
      >
        {clientLogosHeading.lead} <span style={{ color: "#CCFF00" }}>{clientLogosHeading.highlight}</span>
      </div>

      {/* Verbindungslinie zum Kreis */}
      <div
        style={{
          width: "2px",
          height: "clamp(40px, 5vh, 64px)",
          background: "linear-gradient(to bottom, #C2C3F6, rgba(194,195,246,0))",
          marginTop: "20px",
          boxShadow: "0 0 8px rgba(194,195,246,0.6)",
        }}
      />

      {/* Kreis-Bühne */}
      <div
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{ height: "clamp(260px, 42vh, 400px)" }}
      >
        {/* ─── Unterer Bogen — hinter Logos (z:0) ─── */}
        <BottomArc size={arcSize} />

        {/* ─── Logos-Strip — mittlere Ebene (z:1) ─── */}
        <div
          style={{
            position: "absolute",
            left: 0, right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            padding: "16px 0",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          {/* Edge-Fades mit Hero-Hintergrundfarbe */}
          <div
            aria-hidden
            style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: "120px", zIndex: 2, pointerEvents: "none",
              background: `linear-gradient(to right, ${BG}, transparent)`,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute", right: 0, top: 0, bottom: 0,
              width: "120px", zIndex: 2, pointerEvents: "none",
              background: `linear-gradient(to left, ${BG}, transparent)`,
            }}
          />

          <div
            className="flex animate-marquee hover:[animation-play-state:paused]"
            style={{ width: "max-content", gap: "48px", alignItems: "center" }}
          >
            {duplicatedLogos.map((logo, index) => {
              const h = logo.height || 56;
              return (
                <div
                  key={`logo-${index}`}
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ height: `${h}px` }}
                >
                  <img
                    src={img(logo.src)}
                    alt={logo.alt}
                    loading="lazy"
                    className="object-contain brightness-0 invert"
                    style={{
                      height: `${h}px`,
                      width: "auto",
                      maxWidth: "220px",
                      opacity: 0.85,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Oberer Bogen — vor Logos (z:3) ─── */}
        <TopArc size={arcSize} />
      </div>
    </section>
  );
}
