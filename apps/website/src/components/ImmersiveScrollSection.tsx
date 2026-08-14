import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { Target, Layers, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

/* ── Tokens ── */
const LIME = "#CCFF00";
const INK_DEEP = "#17172E";
const DISPLAY: React.CSSProperties = { fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 700 };
const MONO: React.CSSProperties = { fontFamily: "Consolas, ui-monospace, SFMono-Regular, Menlo, monospace" };
const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "Unser Prozess" | "Warum NEWEDGE";
type Item = { phase: Phase; index: string; title: string; desc: string; Icon?: LucideIcon };

const items: Item[] = [
  {
    phase: "Unser Prozess",
    index: "01",
    title: "Analyse & Zieldefinition",
    desc: "Gemeinsame Identifikation geeigneter Use Cases, Datenquellen und wirtschaftlicher Potenziale. Wir stellen die richtigen Fragen, bevor wir eine Zeile Code schreiben.",
  },
  {
    phase: "Unser Prozess",
    index: "02",
    title: "Konzept & Systemarchitektur",
    desc: "Auswahl der passenden Modelle, Tools und Integrationspunkte — abgestimmt auf Ihre IT-Landschaft und Ihre Compliance-Anforderungen.",
  },
  {
    phase: "Unser Prozess",
    index: "03",
    title: "Entwicklung & Integration",
    desc: "Umsetzung der Lösung inkl. Schnittstellen, Workflows und Benutzeroberflächen. Iterativ, transparent, mit wöchentlichem Statusupdate.",
  },
  {
    phase: "Unser Prozess",
    index: "04",
    title: "Go-Live & Optimierung",
    desc: "Produktiver Einsatz, Monitoring und kontinuierliche Verbesserung. Wir bleiben dabei — auch nach dem Launch.",
  },
  {
    phase: "Warum NEWEDGE",
    index: "01",
    title: "Strategie & Klarheit",
    desc: "Von der KI-Strategie bis zur konkreten Umsetzung. Wir analysieren Ihre Prozesse, identifizieren echte Hebel und bauen Systeme, die wirken — nicht bloß beeindrucken.",
    Icon: Target,
  },
  {
    phase: "Warum NEWEDGE",
    index: "02",
    title: "Nahtlose Integration",
    desc: "KI wird direkt in Ihre bestehenden Tools und Systeme eingebaut — ERP, CRM, interne Plattformen. Kein Bruch, kein Parallelbetrieb, keine Reibung.",
    Icon: Layers,
  },
  {
    phase: "Warum NEWEDGE",
    index: "03",
    title: "Datenhoheit & Sicherheit",
    desc: "DSGVO-konforme Architekturen, bei denen Sie die volle Kontrolle behalten. Ihre Daten bleiben Ihre Daten — intern, sicher, auditierbar.",
    Icon: ShieldCheck,
  },
];

const TOTAL = items.length;

/* ── Desktop pinned layout ── */
const DesktopLayout = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const raw = Math.floor(v * TOTAL);
    setActiveIdx(Math.min(TOTAL - 1, Math.max(0, raw)));
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const item = items[activeIdx];

  return (
    <div ref={containerRef} style={{ height: `${TOTAL * 110}vh`, position: "relative" }}>
      {/* ── Sticky panel ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top progress bar */}
        <div
          style={{
            height: "2px",
            backgroundColor: "rgba(23,23,23,0.14)",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              backgroundColor: LIME,
              width: progressWidth,
            }}
          />
        </div>

        {/* Split columns */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            overflow: "hidden",
          }}
        >
          {/* ── LEFT ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "clamp(2.5rem, 4vw, 4.5rem) clamp(2rem, 3vw, 3rem)",
              borderRight: "1px solid rgba(23,23,23,0.14)",
              overflow: "hidden",
            }}
          >
            <div>
              {/* Phase eyebrow */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "3rem" }}>
                <span
                  style={{
                    display: "block",
                    width: "28px",
                    height: "1px",
                    backgroundColor: LIME,
                    flexShrink: 0,
                  }}
                />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={item.phase}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    style={{
                      ...MONO,
                      fontSize: "11px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase" as const,
                      color: LIME,
                    }}
                  >
                    {item.phase}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Ghost numeral */}
              <div style={{ overflow: "hidden", marginBottom: "2rem", lineHeight: 1 }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`num-${activeIdx}`}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.42, ease: EASE }}
                    style={{
                      ...DISPLAY,
                      display: "block",
                      fontSize: "clamp(2.75rem, 6vw, 5.5rem)",
                      lineHeight: 1,
                      letterSpacing: "0.01em",
                      color: "transparent",
                      WebkitTextStroke: "1.5px rgba(23,23,23,0.22)",
                      userSelect: "none",
                    }}
                  >
                    {item.index}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Description */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${activeIdx}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.07 }}
                  style={{
                    ...MONO,
                    fontSize: "13px",
                    lineHeight: 1.8,
                    color: "rgba(23,23,23,0.68)",
                    maxWidth: "34ch",
                  }}
                >
                  {item.desc}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Bottom: counter + dots */}
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <span
                style={{
                  ...MONO,
                  fontSize: "11px",
                  letterSpacing: "0.14em",
                  color: "rgba(23,23,23,0.45)",
                }}
              >
                {String(activeIdx + 1).padStart(2, "0")} — {String(TOTAL).padStart(2, "0")}
              </span>
              <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                {items.map((it, i) => {
                  const isActive = i === activeIdx;
                  const samePhase = it.phase === item.phase;
                  return (
                    <span
                      key={i}
                      style={{
                        display: "block",
                        height: isActive ? "6px" : "4px",
                        width: isActive ? "22px" : "6px",
                        backgroundColor: isActive
                          ? LIME
                          : samePhase
                          ? "rgba(23,23,23,0.22)"
                          : "rgba(23,23,23,0.14)",
                        transition: "all 380ms cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(2.5rem, 4vw, 4.5rem) clamp(2.5rem, 4vw, 4rem)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Phase transition accent line */}
            <AnimatePresence>
              {activeIdx === 4 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{
                    position: "absolute",
                    top: "clamp(2.5rem, 4vw, 4.5rem)",
                    left: "clamp(2.5rem, 4vw, 4rem)",
                    right: "clamp(2.5rem, 4vw, 4rem)",
                    height: "1px",
                    backgroundColor: LIME,
                    transformOrigin: "0 0",
                    opacity: 0.5,
                  }}
                />
              )}
            </AnimatePresence>

            {/* Icon — only for Warum NEWEDGE */}
            <div style={{ height: "64px", marginBottom: "20px", display: "flex", alignItems: "flex-end" }}>
              <AnimatePresence mode="wait">
                {item.Icon ? (
                  <motion.div
                    key={`icon-${activeIdx}`}
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                    transition={{ duration: 0.32, ease: EASE }}
                    style={{
                      width: "52px",
                      height: "52px",
                      border: "1.5px solid rgba(23,23,23,0.22)",
                      backgroundColor: "rgba(23,23,23,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <item.Icon style={{ color: LIME, width: "22px", height: "22px" }} strokeWidth={1.5} />
                  </motion.div>
                ) : (
                  <motion.div key={`no-icon-${activeIdx}`} style={{ height: "52px" }} />
                )}
              </AnimatePresence>
            </div>

            {/* Main heading — big blur-slide */}
            <div style={{ overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`title-${activeIdx}`}
                  initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -40, filter: "blur(6px)" }}
                  transition={{ duration: 0.52, ease: EASE }}
                  style={{
                    ...DISPLAY,
                    fontSize: "clamp(2.75rem, 6vw, 5.5rem)",
                    lineHeight: 1.0,
                    letterSpacing: "-0.03em",
                    color: INK_DEEP,
                    margin: 0,
                  }}
                >
                  {item.title}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Bottom hairline with violet fill */}
            <div
              style={{
                position: "absolute",
                bottom: "clamp(2.5rem, 4vw, 4.5rem)",
                left: "clamp(2.5rem, 4vw, 4rem)",
                right: "clamp(2.5rem, 4vw, 4rem)",
                height: "1px",
                backgroundColor: "rgba(23,23,23,0.14)",
              }}
            >
              <motion.div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  backgroundColor: LIME,
                  width: progressWidth,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div style={{ height: "1px", backgroundColor: "rgba(23,23,23,0.06)", flexShrink: 0 }} />
      </div>
    </div>
  );
};

/* ── Mobile stacked layout ── */
const MobileLayout = () => (
  <section style={{ padding: "4rem 1.5rem" }}>
    {(["Unser Prozess", "Warum NEWEDGE"] as Phase[]).map((phase) => (
      <div key={phase} style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "2rem" }}>
          <span style={{ display: "block", width: "28px", height: "1px", backgroundColor: LIME, flexShrink: 0 }} />
          <span style={{ ...MONO, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: LIME }}>
            {phase}
          </span>
        </div>
        <div style={{ borderTop: "1px solid rgba(23,23,23,0.14)" }}>
          {items
            .filter((it) => it.phase === phase)
            .map((item, i) => (
              <div
                key={item.title}
                style={{
                  padding: "1.5rem 0",
                  borderBottom: "1px solid rgba(23,23,23,0.14)",
                  display: "grid",
                  gridTemplateColumns: "2.5rem 1fr",
                  gap: "1rem",
                  alignItems: "start",
                }}
              >
                <div>
                  {item.Icon ? (
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        border: "1.5px solid rgba(23,23,23,0.22)",
                        backgroundColor: "rgba(23,23,23,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <item.Icon style={{ color: LIME, width: "16px", height: "16px" }} strokeWidth={1.5} />
                    </div>
                  ) : (
                    <span
                      style={{
                        ...MONO,
                        fontSize: "11px",
                        letterSpacing: "0.12em",
                        color: "rgba(23,23,23,0.45)",
                        paddingTop: "4px",
                        display: "block",
                      }}
                    >
                      {item.index}
                    </span>
                  )}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
                      lineHeight: 1.15,
                      color: INK_DEEP,
                      marginBottom: "10px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      ...MONO,
                      fontSize: "12px",
                      lineHeight: 1.75,
                      color: "rgba(23,23,23,0.68)",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    ))}
  </section>
);

/* ── Export ── */
export const ImmersiveScrollSection = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
};
