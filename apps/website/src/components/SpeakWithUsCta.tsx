import { useRef } from "react";
import { CursorLine } from "@/components/ui/CursorLine";
import { FloatingConsultButton } from "@/components/ui/FloatingConsultButton";
import { EdgeTextButton } from "@/components/ui/EdgeCta";

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const PAPER = "#F2F2F2";
const HEAD: React.CSSProperties = { fontFamily: OUTFIT, fontWeight: 700 };

interface SpeakWithUsCtaProps {
  eyebrow?: string;
  headingLine1: string;
  headingLine2: string;
  phoneHref: string;
  phoneLabel: string;
}

/**
 * „Sprechen Sie direkt mit uns"-CTA (Referenz: Anwendungsfelder-Seite) —
 * Verlaufs-Karte im Look des Video-Moduls mit FloatingConsultButton +
 * CursorLine. Als geteilte Komponente, damit Anwendungsfelder, Über uns
 * und Methodik pixelidentisch bleiben.
 */
export const SpeakWithUsCta = ({ eyebrow, headingLine1, headingLine2, phoneHref, phoneLabel }: SpeakWithUsCtaProps) => {
  const ctaBtnRef = useRef<HTMLDivElement>(null);

  return (
    <CursorLine buttonRef={ctaBtnRef} buttonRadius={76}>
      <div style={{ background: PAPER, padding: "0 0 clamp(56px,7vw,96px)" }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "24px",
              // Cooler Lime→Ink-Verlauf aus der unteren rechten Ecke (Referenz: Video-Modul der Homepage)
              background:
                "radial-gradient(150% 150% at 100% 100%, #CCFF00 0%, #6B7A00 26%, #2E3300 48%, #171717 70%)",
              border: "1px solid rgba(204,255,0,0.14)",
              padding: "clamp(48px,7vw,88px) clamp(24px,5vw,64px)",
            }}
          >
            {/* Zusätzlicher weicher Lime-Schimmer oben links — hält den Verlauf lebendig,
                ohne die weiße Headline zu überstrahlen */}
            <div
              aria-hidden
              style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 50% 60% at 0% 0%, rgba(204,255,0,0.14) 0%, transparent 55%)",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                maxWidth: "900px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "clamp(32px, 6vw, 80px)",
                alignItems: "center",
              }}
            >
              {/* LEFT */}
              <div>
                {eyebrow && (
                  <p
                    style={{
                      fontFamily: OUTFIT,
                      fontWeight: 600,
                      fontSize: "14px",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: LIME,
                      marginBottom: "14px",
                    }}
                  >
                    {eyebrow}
                  </p>
                )}
                <h2
                  style={{
                    color: "#fff",
                    marginBottom: "28px",
                  }}
                >
                  {headingLine1}
                  <br />
                  {headingLine2}
                </h2>
                <EdgeTextButton href={phoneHref} tone="light">
                  {phoneLabel}
                </EdgeTextButton>
              </div>
              {/* RIGHT */}
              <div ref={ctaBtnRef} style={{ display: "flex", justifyContent: "center" }}>
                <FloatingConsultButton textColor="#ffffff" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CursorLine>
  );
};
