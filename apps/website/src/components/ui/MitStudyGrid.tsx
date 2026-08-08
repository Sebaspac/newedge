import { motion } from "framer-motion";

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const HAIRLINE = "rgba(204,255,0,0.14)";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Beleuchtete Kästchen im 10×10-Raster (0-basiert, row-major) — 5 verstreut. Auf jeder Verwendung identisch (Wiedererkennung als „die MIT-Grafik"). */
const MIT_STUDY_LIT = new Set([6, 34, 49, 63, 91]);

/**
 * „5/100"-Stat-Grafik (MIT-Studie 2025) in NEWEDGE-CI: 5/100, Eyebrow,
 * 10×10-Raster mit 5 violett beleuchteten Kästchen, optional Beschreibung.
 * `compact` lässt Trennlinie + Beschreibung weg (für engere Layout-Slots, z. B.
 * als Bild-Ersatz in Karten/Panels).
 */
export const MitStudyGrid = ({ lang, compact = false }: { lang: "de" | "en"; compact?: boolean }) => {
  const strong = { fontWeight: 700, color: INK_DEEP } as React.CSSProperties;
  const eyebrow = lang === "en" ? "Companies with measurable AI return" : "Unternehmen mit messbarem KI-Return";
  const desc =
    lang === "en" ? (
      <>
        Of 100 companies that adopt AI, only 5 achieve a measurable return according to the{" "}
        <strong style={strong}>MIT Study 2025</strong>.{" "}
        <strong style={strong}>We make sure you&rsquo;re one of them.</strong>
      </>
    ) : (
      <>
        Von 100 Betrieben, die KI einführen, erzielen laut <strong style={strong}>MIT-Studie 2025</strong> nur 5
        einen messbaren Return. <strong style={strong}>Wir sorgen dafür, dass Sie dazugehören.</strong>
      </>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE }}
      style={{
        background: "#FFFFFF",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: compact ? "16px" : "18px",
        boxShadow: "0 14px 44px -22px rgba(23,23,23,0.22)",
        padding: compact ? "clamp(14px, 2vw, 20px)" : "clamp(18px, 2vw, 26px)",
      }}
    >
      {/* Kopf: 5/100 + Eyebrow */}
      <div className="flex items-start justify-between gap-3" style={{ marginBottom: compact ? "clamp(12px,1.8vw,18px)" : "clamp(20px,2.4vw,28px)" }}>
        <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1 }}>
          <span style={{ fontFamily: OUTFIT, fontWeight: 800, fontSize: compact ? "clamp(26px,3vw,34px)" : "clamp(34px,3.6vw,46px)", color: INK_DEEP, letterSpacing: "-0.02em" }}>5</span>
          <span style={{ fontFamily: OUTFIT, fontWeight: 500, fontSize: compact ? "clamp(12px,1.3vw,15px)" : "clamp(14px,1.5vw,19px)", color: "rgba(23,23,23,0.68)" }}>/100</span>
        </div>
        <p style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: compact ? "9.5px" : "clamp(11px,0.95vw,13px)", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(23,23,23,0.68)", textAlign: "right", maxWidth: compact ? "14ch" : "17ch", lineHeight: 1.4 }}>
          {compact ? (lang === "en" ? "MIT Study 2025" : "MIT-Studie 2025") : eyebrow}
        </p>
      </div>

      {/* 10×10-Raster — 5 Kästchen beleuchtet */}
      <div role="img" aria-label={eyebrow} style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: compact ? "2.5px" : "clamp(3px,0.6vw,5px)" }}>
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            aria-hidden
            style={{ aspectRatio: "1 / 1", borderRadius: "2.5px", background: MIT_STUDY_LIT.has(i) ? LIME : "rgba(23,23,23,0.14)" }}
          />
        ))}
      </div>

      {!compact && (
        <>
          {/* Trennlinie */}
          <div style={{ height: "1px", background: "rgba(23,23,23,0.14)", margin: "clamp(20px,2.6vw,30px) 0" }} />

          {/* Beschreibung */}
          <p style={{ fontFamily: OUTFIT, fontWeight: 400, fontSize: "clamp(15px,1.1vw,16.5px)", lineHeight: 1.6, color: "rgba(23,23,23,0.68)" }}>
            {desc}
          </p>
        </>
      )}
    </motion.div>
  );
};
