import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { statementStats as statementStatsStatic, img } from "@/content";
import { statementStats as statementStatsEn } from "@/content/en/sections/statementStats";
import { useLocalizedStatic } from "@/hooks/useLocalized";
import { EdgePillButton, EdgeTextButton } from "@/components/ui/EdgeCta";
import { EdgeRip } from "@/components/ui/EdgeRip";
import { impactCounter as IMPACT_STATIC } from "@/content/sections/impactCounter";
import { impactCounter as impactCounterEn } from "@/content/en/sections/impactCounter";
import { useHomeSection } from "@/hooks/useHomeContent";

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const PAPER = "#F2F2F2";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Vertikaler Versatz pro Kennzahl-Block — die gestaffelte Diagonale der Referenz. */
const STAGGER_TOP = ["0px", "clamp(60px, 12vh, 150px)", "clamp(30px, 6vh, 80px)"];

/** Wie weit das Bild in die Headline hineinragt (~unteres Viertel des Schriftzugs). */
const OVERLAP = "clamp(1.15rem, 3.4vw, 3.2rem)";
/** Breite des Team-Bilds. */
const IMG_W = "min(760px, 82vw)";
/** Geteilter Stil für Headline + Ghost-Kopie (müssen pixelidentisch sein).
    Untergrenze so gewählt, dass „Wir sind NEWEDGE" (nowrap) auch bei 375px
    Viewport-Breite auf eine Zeile passt; Desktop-Größe bleibt unverändert. */
const TITLE_STYLE: React.CSSProperties = {
  fontFamily: OUTFIT,
  fontWeight: 700,
  fontSize: "clamp(2rem, 9.5vw, 9rem)",
  lineHeight: 1,
  letterSpacing: "-0.03em",
  whiteSpace: "nowrap",
};

/**
 * Statement + Kennzahlen (Referenz-Layout): zentriertes Statement,
 * Absatz, zwei Pill-CTAs, darunter drei riesige, versetzt gestaffelte
 * Kennzahlen über die volle Breite.
 */
export const StatementStatsSection = () => {
  const statementStats = useLocalizedStatic(statementStatsStatic, statementStatsEn);
  // Inhalte live aus dem CMS (Strapi „Home"); Fallback: statischer Content-Layer
  const impact = useHomeSection("impactCounter", IMPACT_STATIC, impactCounterEn);

  /* ── Zoom-Settle + Parallax (scroll-getrieben, nur Transforms — kein Scroll-Jacking) ──
     Der Bild-RAHMEN bleibt statisch (Ghost-Clip bleibt dadurch immer bündig);
     animiert wird nur der Bild-INHALT: startet eingezoomt (1.18) und beruhigt
     sich beim Reinscrollen auf 1.08 Rest-Overscan, der den ±4%-Parallax abdeckt. */
  const titleBlockRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: titleBlockRef,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 0.45], [1.18, 1.08]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  // Drei stärkste Kennzahlen (Index 0 = Zielgruppen-Range, bewusst außen vor)
  const metrics = impact.metrics.slice(1, 4).map((m) => ({
    value: `${m.prefix ?? ""}${m.value}${m.suffix ?? ""}`,
    label: m.label,
  }));

  return (
    <section aria-label={impact.ariaLabel} className="relative w-full" style={{ background: PAPER }}>
      <div
        className="max-w-[1280px] mx-auto px-6 lg:px-8"
        style={{ paddingTop: "clamp(64px, 10vh, 120px)", paddingBottom: "clamp(72px, 11vh, 140px)" }}
      >
        {/* ── Riesige Headline + überlappendes Team-Bild (Referenz: „We're Noramble") ──
            Das Bild schneidet die Schrift auf ~halber Höhe; darüber liegt eine
            transparente Ghost-Kopie der Schrift, geclippt auf die Bildfläche —
            so läuft der Schriftzug durchscheinend auf dem Foto weiter. */}
        <motion.div
          ref={titleBlockRef}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative text-center"
          style={{ marginBottom: "clamp(48px, 7vh, 80px)" }}
        >
          <div
            style={{
              ...TITLE_STYLE,
              position: "relative",
              zIndex: 0,
              color: INK_DEEP,
            }}
          >
            {statementStats.title}
          </div>

          {/* Bild überlappt die untere Hälfte der Headline — statischer Rahmen,
              der Inhalt zoomt/parallaxt scroll-getrieben darin.
              Edgy-Schnitt + Outline-Rahmen + Riss wie bei den Folien-Bildern. */}
          <div
            className="mx-auto"
            style={{
              position: "relative",
              zIndex: 1,
              width: IMG_W,
              marginTop: `calc(-1 * ${OVERLAP})`,
            }}
          >
            {/* Versetzter Outline-Rahmen hinter dem Bild — ragt nur unten/rechts heraus,
                oben (wo die Ghost-Schrift liegt) bleibt er hinter dem Bild verborgen */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: "14px -12px -12px 12px",
                border: "1.5px solid rgba(23,23,23,0.22)",
                borderRadius: "20px 20px 64px 20px",
                transform: "rotate(-1.2deg)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 3",
                borderRadius: "20px 20px 64px 20px",
                overflow: "hidden",
              }}
            >
              <motion.img
                src={img(statementStats.image.src)}
                alt={statementStats.image.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  scale: imgScale,
                  y: imgY,
                }}
                loading="lazy"
              />
              {/* Kleiner Riss von der Unterkante — die „Edge" der Marke */}
              <EdgeRip style={{ bottom: "-1px", right: "26%", width: "34px", height: "80px", zIndex: 1, transform: "scaleY(-1)" }} />
            </div>
          </div>

          {/* Ghost-Kopie: nur der Teil über dem Bild ist sichtbar (Clip auf Bildfläche),
              gefüllt mit Helllila-Verlauf aus der CI */}
          <div
            aria-hidden
            style={{
              ...TITLE_STYLE,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              background: "linear-gradient(120deg, #CCFF00 0%, #D9F53A 45%, #CCFF00 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              opacity: 0.9,
              pointerEvents: "none",
              clipPath: `inset(calc(100% - ${OVERLAP}) calc((100% - ${IMG_W}) / 2) 0 round 20px 20px 0 0)`,
            }}
          >
            {statementStats.title}
          </div>
        </motion.div>

        {/* ── Statement + Absatz + CTAs, zentriert ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center mx-auto"
          style={{ maxWidth: "760px" }}
        >
          <h2
            style={{
              color: INK_DEEP,
            }}
          >
            {statementStats.statement}
          </h2>
          <p
            style={{
              fontFamily: OUTFIT,
              color: "#3C3C3C",
              marginBottom: "32px",
            }}
          >
            {statementStats.paragraph}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <EdgePillButton to="/kontakt">{statementStats.ctaPrimary.label}</EdgePillButton>
            {/* Sekundär-CTA optional — entfällt, solange „Über uns" ausgeblendet ist */}
            {statementStats.ctaSecondary && (
              <EdgeTextButton to={statementStats.ctaSecondary.to}>{statementStats.ctaSecondary.label}</EdgeTextButton>
            )}
          </div>
        </motion.div>

        {/* ── Kennzahlen: riesig, versetzt gestaffelt (Referenz) ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-y-12"
          style={{ marginTop: "clamp(56px, 9vh, 110px)" }}
        >
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              className={i === 0 ? "md:justify-self-start" : i === 1 ? "md:justify-self-center" : "md:justify-self-end"}
              style={{ paddingTop: STAGGER_TOP[i] }}
            >
              <div
                style={{
                  fontFamily: OUTFIT,
                  fontWeight: 700,
                  fontSize: "clamp(4rem, 9vw, 8.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: INK_DEEP,
                  whiteSpace: "nowrap",
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontFamily: OUTFIT,
                  fontWeight: 500,
                  fontSize: "clamp(16px, 1.4vw, 20px)",
                  color: INK_DEEP,
                  marginTop: "18px",
                }}
              >
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
