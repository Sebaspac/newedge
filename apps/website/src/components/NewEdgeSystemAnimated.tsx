import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { newEdgeSystem as SYSTEM_STATIC } from "@/content/sections/newEdgeSystem";
import { newEdgeSystem as newEdgeSystemEn } from "@/content/en/sections/newEdgeSystem";
import { useLocalized } from "@/hooks/useLocalized";

/* ── Tokens (Rebrush 2026-07: Outfit statt Serif/Mono) ──── */
const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const SERIF: CSSProperties = { fontFamily: OUTFIT, fontWeight: 700 };
const MONO: CSSProperties = { fontFamily: OUTFIT, fontWeight: 500 };
const INK_DEEP = "#171717";
const LIME = "#CCFF00";
const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Card accent palette (1:1 aus dem Mockup) ──────────── */

const YELLOW = "#FACC15";
const YELLOW_DK = "#EAB308";
const CYAN = "#22D3EE";
const GREEN = "#34D399";


type IconProps = { still: boolean };

/* ════════════════════════════════════════════════════════
   01 · CORTEX — gestapelte Rauten + gelber Punkt
   ════════════════════════════════════════════════════════ */
const CortexIcon = ({ still }: IconProps) => (
  <motion.svg viewBox="0 0 120 110" width="120" height="110" fill="none" strokeLinecap="round"
    animate={still ? {} : { y: [0, -4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
    {/* äußere gestrichelte Raute — rotiert */}
    <motion.rect x="32" y="27" width="56" height="56" rx="12" stroke={LIME} strokeWidth="1.5"
      strokeDasharray="4 6" opacity="0.55"
      style={{ transformOrigin: "60px 55px", transformBox: "view-box" }}
      animate={still ? { rotate: 45 } : { rotate: [45, 405] }}
      transition={{ duration: 24, repeat: Infinity, ease: "linear" }} />
    {/* mittlere Raute */}
    <rect x="40" y="35" width="40" height="40" rx="10" stroke={LIME} strokeWidth="2"
      style={{ transformOrigin: "60px 55px", transformBox: "view-box", transform: "rotate(45deg)" }} />
    {/* innerer Kern */}
    <rect x="49" y="44" width="22" height="22" rx="7" fill="rgba(204,255,0,0.22)" stroke={LIME} strokeWidth="1.5"
      style={{ transformOrigin: "60px 55px", transformBox: "view-box", transform: "rotate(45deg)" }} />
    {/* gelber Punkt unten-links */}
    <motion.circle cx="42" cy="70" r="5" fill={YELLOW}
      style={{ transformOrigin: "42px 70px", transformBox: "view-box" }}
      animate={still ? {} : { scale: [1, 1.25, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
  </motion.svg>
);

/* ════════════════════════════════════════════════════════
   02 · STRATEGIE — Kreis + Diagonale + Orbit
   ════════════════════════════════════════════════════════ */
const StrategieIcon = ({ still }: IconProps) => (
  <svg viewBox="0 0 120 110" width="120" height="110" fill="none" strokeLinecap="round">
    {/* gestrichelter Orbit */}
    <motion.ellipse cx="60" cy="55" rx="44" ry="30" stroke="rgba(234,179,8,0.35)" strokeWidth="1.5"
      strokeDasharray="3 6"
      style={{ transformOrigin: "60px 55px", transformBox: "view-box" }}
      animate={still ? {} : { rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
    {/* Kreis */}
    <circle cx="60" cy="55" r="26" stroke={YELLOW_DK} strokeWidth="2" />
    {/* Diagonale */}
    <line x1="34" y1="79" x2="86" y2="31" stroke={YELLOW_DK} strokeWidth="2" />
    {/* gleitendes Quadrat auf der Diagonale */}
    <motion.rect x="63" y="46" width="11" height="11" rx="2" fill={YELLOW}
      style={{ transformOrigin: "60px 55px", transformBox: "view-box" }}
      animate={still ? {} : { x: [0, 8, 0], y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
  </svg>
);

/* ════════════════════════════════════════════════════════
   03 · DIGITALE SYSTEME — Browserfenster + Orbit
   ════════════════════════════════════════════════════════ */
const DigitalIcon = ({ still }: IconProps) => (
  <motion.svg viewBox="0 0 120 110" width="120" height="110" fill="none" strokeLinecap="round"
    animate={still ? {} : { y: [0, -3, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
    {/* Orbit hinter dem Fenster */}
    <motion.ellipse cx="60" cy="55" rx="46" ry="26" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5"
      style={{ transformOrigin: "60px 55px", transformBox: "view-box" }}
      animate={still ? { rotate: -15 } : { rotate: [-15, 345] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
    {/* Browserfenster */}
    <rect x="33" y="33" width="54" height="44" rx="10" stroke={CYAN} strokeWidth="2" fill="rgba(34,211,238,0.05)" />
    {/* Top-Bar Linie */}
    <line x1="33" y1="47" x2="87" y2="47" stroke={CYAN} strokeWidth="1.5" opacity="0.6" />
    {/* Top-Bar Punkte (blinken alternierend) */}
    <motion.circle cx="42" cy="40" r="2.4" fill={CYAN}
      animate={still ? {} : { opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
    <motion.circle cx="50" cy="40" r="2.4" fill={CYAN}
      animate={still ? {} : { opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
    <circle cx="80" cy="40" r="3.2" fill={CYAN} opacity="0.85" />
  </motion.svg>
);

/* ════════════════════════════════════════════════════════
   04 · AUTOMATISIERUNG — Kern + umlaufender Würfel
   ════════════════════════════════════════════════════════ */
const AutomationIcon = ({ still }: IconProps) => (
  <svg viewBox="0 0 120 110" width="120" height="110" fill="none" strokeLinecap="round">
    {/* Kreis */}
    <circle cx="60" cy="55" r="28" stroke={GREEN} strokeWidth="2" />
    {/* rotierende Gruppe: Diagonale + Würfel */}
    <motion.g
      style={{ transformOrigin: "60px 55px", transformBox: "view-box" }}
      animate={still ? {} : { rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}>
      <line x1="26" y1="67" x2="94" y2="43" stroke={GREEN} strokeWidth="2" opacity="0.7" />
      <rect x="79" y="40" width="12" height="12" rx="2" fill={GREEN}
        style={{ transformOrigin: "85px 46px", transformBox: "view-box", transform: "rotate(45deg)" }} />
    </motion.g>
    {/* dunkler Kern */}
    <motion.circle cx="60" cy="55" r="15" fill={INK_DEEP}
      style={{ transformOrigin: "60px 55px", transformBox: "view-box" }}
      animate={still ? {} : { scale: [1, 1.06, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
    <circle cx="60" cy="55" r="6" fill={GREEN} opacity="0.9" />
  </svg>
);

/* ════════════════════════════════════════════════════════
   05 · OWNERSHIP — Hexagon + leuchtender Slot
   ════════════════════════════════════════════════════════ */
const OwnershipIcon = ({ still }: IconProps) => (
  <svg viewBox="0 0 120 110" width="120" height="110" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Hexagon (leichtes Schwingen) */}
    <motion.polygon points="60,22 92,40 92,70 60,88 28,70 28,40"
      fill="#101010" stroke="rgba(204,255,0,0.45)" strokeWidth="1.5"
      style={{ transformOrigin: "60px 55px", transformBox: "view-box" }}
      animate={still ? {} : { rotate: [-2, 2, -2] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
    {/* Glow hinter dem Slot */}
    <motion.rect x="46" y="48" width="28" height="14" rx="2" fill={LIME}
      style={{ filter: "blur(6px)", transformOrigin: "60px 55px", transformBox: "view-box" }}
      animate={still ? {} : { opacity: [0.4, 0.85, 0.4], scaleX: [1, 1.12, 1] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} />
    {/* Slot */}
    <motion.rect x="46" y="48" width="28" height="14" rx="2" fill="#CCFF00"
      style={{ transformOrigin: "60px 55px", transformBox: "view-box" }}
      animate={still ? {} : { opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }} />
  </svg>
);

/* ════════════════════════════════════════════════════════
   06 · EMBEDDED AI — Roboterkopf + Orbit-Punkt
   ════════════════════════════════════════════════════════ */
const EmbeddedIcon = ({ still }: IconProps) => (
  <motion.svg viewBox="0 0 120 110" width="120" height="110" fill="none" strokeLinecap="round"
    animate={still ? {} : { y: [0, -3, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
    {/* Orbit + Punkt (rotiert gemeinsam) */}
    <motion.g
      style={{ transformOrigin: "60px 55px", transformBox: "view-box" }}
      animate={still ? { rotate: -12 } : { rotate: [-12, 348] }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
      <ellipse cx="60" cy="55" rx="46" ry="26" stroke="rgba(234,179,8,0.35)" strokeWidth="1.5" />
      <circle cx="106" cy="55" r="3.4" fill={YELLOW} />
    </motion.g>
    {/* Antenne */}
    <line x1="60" y1="34" x2="60" y2="22" stroke={YELLOW_DK} strokeWidth="2" />
    <circle cx="60" cy="20" r="2.2" fill={YELLOW} />
    {/* Kopf */}
    <rect x="22" y="34" width="76" height="50" rx="14" stroke={YELLOW_DK} strokeWidth="2" fill="rgba(250,204,21,0.05)" />
    {/* Augen (blinzeln) */}
    <motion.circle cx="46" cy="59" r="5" fill={YELLOW}
      style={{ transformOrigin: "46px 59px", transformBox: "view-box" }}
      animate={still ? {} : { scaleY: [1, 1, 0.1, 1] }}
      transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.9, 0.95, 1], ease: "easeInOut" }} />
    <motion.circle cx="74" cy="59" r="5" fill={YELLOW}
      style={{ transformOrigin: "74px 59px", transformBox: "view-box" }}
      animate={still ? {} : { scaleY: [1, 1, 0.1, 1] }}
      transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.92, 0.97, 1], ease: "easeInOut", delay: 0.1 }} />
  </motion.svg>
);

/* ── Karten-Daten ───────────────────────────────────────── */
/* Layout (Akzentfarbe + Icon-Artwork) bleibt hier; die Text-Labels
   (index/title/sub) kommen aus dem Content-Modul und werden per Index
   gemergt (Reihenfolge = Layout-Reihenfolge). */
type Card = {
  index: string;
  title: string;
  sub: string;
  accent: string;
  Icon: (p: IconProps) => JSX.Element;
};

const cardLayout: { accent: string; Icon: (p: IconProps) => JSX.Element }[] = [
  { accent: YELLOW, Icon: StrategieIcon },
  { accent: GREEN, Icon: AutomationIcon },
  { accent: LIME, Icon: EmbeddedIcon },
];

const NOTCH = "polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%)";

/* ── Chevron-Konnektor ──────────────────────────────────── */
const Chevron = ({ i, still }: { i: number; still: boolean }) => (
  <div className="ne-chevron" aria-hidden>
    <motion.svg width="14" height="20" viewBox="0 0 14 20" fill="none"
      animate={still ? {} : { opacity: [0.25, 1, 0.25] }}
      transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }}>
      <polyline points="3,3 11,10 3,17" stroke={LIME} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  </div>
);

/* ════════════════════════════════════════════════════════
   SECTION
   ════════════════════════════════════════════════════════ */
export const NewEdgeSystemAnimated = () => {
  const reduce = useReducedMotion();
  const still = !!reduce;

  // Inhalt live aus dem CMS (Strapi); Fallback: statischer Content-Layer.
  // Das Layout gibt die Kartenanzahl vor; der Merge (cardLayout.flatMap unten)
  // ignoriert überzählige CMS-Karten robust.
  const newEdgeSystem = useLocalized("new-edge-system", SYSTEM_STATIC, newEdgeSystemEn);
  // Layout gibt die Kartenanzahl vor (genau 3 Phasen). Content-Karten werden per
  // Index gemergt; überzählige CMS-Karten werden ignoriert, fehlende übersprungen.
  const cards: Card[] = cardLayout.flatMap((layout, i) => {
    const c = newEdgeSystem.cards[i];
    if (!c) return [];
    return [{
      index: c.index,
      title: c.title,
      sub: c.sub,
      accent: layout.accent,
      Icon: layout.Icon,
    }];
  });

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#FFFFFF",
        padding: "clamp(64px,8vw,112px) 24px",
      }}
    >
      <style>{`
        .ne-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          align-items: stretch;
        }
        .ne-chevron { display: none; }
        @media (min-width: 640px) {
          .ne-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .ne-grid {
            grid-template-columns: 1fr auto 1fr auto 1fr;
            gap: 0;
          }
          .ne-chevron {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            align-self: center;
          }
        }
      `}</style>

      {/* dezentes Raster */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(23,23,23,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(23,23,23,0.06) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 80%)",
      }} />
      {/* weiche Glows */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 50% 50% at 0% 0%, rgba(204,255,0,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 100% 100%, rgba(34,211,238,0.05) 0%, transparent 60%)",
      }} />

      <div style={{ maxWidth: "1180px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Headline */}
        <h2 style={{ color: INK_DEEP }}>
          {newEdgeSystem.headingLines[0]}<br />{newEdgeSystem.headingLines[1]}
        </h2>

        {/* Subline */}
        <p style={{ fontFamily: MONO.fontFamily, fontWeight: MONO.fontWeight, color: "#3C3C3C", maxWidth: "62ch", marginBottom: "clamp(40px,6vw,64px)" }}>
          {newEdgeSystem.subline}
        </p>

        {/* Kartenreihe */}
        <div className="ne-grid">
          {cards.flatMap((c, i) => {
            const card = (
              <motion.div
                key={c.index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: EASE, delay: i * 0.09 }}
                whileHover={{ y: -4, borderColor: "rgba(23,23,23,0.45)", boxShadow: "0 12px 32px rgba(23,23,23,0.14)" }}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "262px",
                  background: "#FFFFFF",
                  border: "1px solid rgba(23,23,23,0.14)",
                  boxShadow: "0 2px 16px rgba(23,23,23,0.06)",
                  padding: "20px 18px",
                  clipPath: NOTCH,
                }}
              >
                {/* gefaltete Ecke */}
                <div aria-hidden style={{
                  position: "absolute", top: 0, right: 0, width: "18px", height: "18px",
                  background: "rgba(23,23,23,0.14)",
                  clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                }} />

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ ...MONO, fontSize: "11px", letterSpacing: "0.2em", color: "rgba(23,23,23,0.45)" }}>{c.index}</span>
                  <motion.span aria-hidden style={{ width: "7px", height: "7px", borderRadius: "50%", background: c.accent, display: "block" }}
                    animate={still ? {} : { scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }} />
                </div>

                {/* Icon */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "110px" }}>
                  <c.Icon still={still} />
                </div>

                {/* Titel */}
                <p style={{ ...SERIF, fontSize: "14px", color: INK_DEEP, margin: "0 0 4px" }}>{c.title}</p>
                <p style={{ ...MONO, fontSize: "14px", lineHeight: 1.55, color: "rgba(23,23,23,0.68)", margin: 0 }}>{c.sub}</p>
              </motion.div>
            );
            return i < cards.length - 1
              ? [card, <Chevron key={`ch-${i}`} i={i} still={still} />]
              : [card];
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: "clamp(36px,5vw,56px)" }}>
          <div aria-hidden style={{ height: "1px", background: "linear-gradient(to right, rgba(23,23,23,0.22), transparent)" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between", paddingTop: "16px" }}>
            <span style={{ ...MONO, fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(23,23,23,0.45)" }}>
              {newEdgeSystem.footer.left}
            </span>
            <span style={{ ...MONO, fontSize: "10px", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(23,23,23,0.45)" }}>
              {newEdgeSystem.footer.right}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
