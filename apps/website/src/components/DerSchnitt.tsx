import { motion } from "framer-motion";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { derSchnitt as DS_STATIC } from "@/content/sections/derSchnitt";
import { derSchnitt as derSchnittEn } from "@/content/en/sections/derSchnitt";
import { useHomeSection } from "@/hooks/useHomeContent";

/* ── Design tokens ── */
const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const HEAD: React.CSSProperties = { fontFamily: OUTFIT, fontWeight: 700 };
const BODY: React.CSSProperties = { fontFamily: OUTFIT, fontWeight: 400 };
const EASE = [0.22, 1, 0.36, 1] as const;

/** Ausgefüllter Verlaufs-Balken (rechte Spalte) bzw. kurzer grauer Stub (links). */
const CompareBar = ({ filled, delay }: { filled: boolean; delay: number }) => (
  <div
    aria-hidden
    style={{
      height: "13px",
      borderRadius: "999px",
      background: "rgba(23,23,23,0.06)",
      border: "1px solid rgba(23,23,23,0.06)",
      overflow: "hidden",
    }}
  >
    <motion.div
      initial={{ transform: "scaleX(0)" }}
      animate={{ transform: "scaleX(1)" }}
      transition={{ duration: filled ? 0.6 : 0.35, delay, ease: EASE }}
      style={{
        height: "100%",
        width: filled ? "100%" : "13%",
        transformOrigin: "left",
        borderRadius: "999px",
        background: filled
          ? "linear-gradient(90deg, #CCFF00 0%, #CCFF00 55%, rgba(204,255,0,0.45) 100%)"
          : "linear-gradient(90deg, rgba(23,23,23,0.22) 0%, rgba(23,23,23,0.45) 100%)",
      }}
    />
  </div>
);

/** Eine Vergleichs-Zeile: Label + animierter Balken. */
const CompareRow = ({ label, filled, index }: { label: string; filled: boolean; index: number }) => (
  <div style={{ marginBottom: "12px" }}>
    <p style={{ ...BODY, fontWeight: 500, fontSize: "13px", color: "#171717", marginBottom: "5px" }}>
      {label}
    </p>
    <CompareBar filled={filled} delay={0.1 + index * 0.07} />
  </div>
);

export const DerSchnitt = () => {
  // Inhalte live aus dem CMS (Strapi „Home"); Fallback: statischer Content-Layer
  const derSchnitt = useHomeSection("derSchnitt", DS_STATIC, derSchnittEn);

  const pillStyle: React.CSSProperties = {
    ...BODY,
    fontWeight: 600,
    fontSize: "13px",
    color: "#171717",
    background: "#FFFFFF",
    border: "1px solid rgba(23,23,23,0.14)",
    borderRadius: "8px",
    padding: "8px 16px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  };

  return (
    <section aria-label={derSchnitt.a11y.sectionLabel} className="relative">
      <div
        className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "clamp(28px,3.5vw,48px)", paddingBottom: "clamp(28px,3.5vw,48px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ padding: "clamp(8px,1vw,16px) 0" }}
        >
          {/* Header — zentriert wie in der Referenz */}
          <div className="text-center" style={{ marginBottom: "clamp(18px,2.5vh,28px)" }}>
            <h2 style={{ color: "#171717" }}>
              {derSchnitt.heading.lead}
              <span className="edge-mark">{derSchnitt.heading.brand}</span>
            </h2>
            <p style={{ color: "#3C3C3C", maxWidth: "58ch", margin: "0 auto" }}>
              {derSchnitt.intro}
            </p>
          </div>

          {/* Zwei Spalten: ohne / mit NEWEDGE */}
          <div className="grid md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-6">
            <div>
              <span style={pillStyle}>
                <IconTrendingDown size={18} color="#5E5E5A" aria-hidden />
                {derSchnitt.before.label}
              </span>
              {derSchnitt.before.rows.map((row, i) => (
                <CompareRow key={row} label={row} filled={false} index={i} />
              ))}
            </div>

            <div>
              <span style={pillStyle}>
                <IconTrendingUp size={18} color="#171717" aria-hidden />
                {derSchnitt.after.label}
              </span>
              {derSchnitt.after.rows.map((row, i) => (
                <CompareRow key={row} label={row} filled index={i} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
