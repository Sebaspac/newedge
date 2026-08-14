import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { img } from "@/content";
import { positionedForImpact as PFI_STATIC } from "@/content/sections/positionedForImpact";
import { positionedForImpact as positionedForImpactEn } from "@/content/en/sections/positionedForImpact";
import { useHomeSection } from "@/hooks/useHomeContent";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import { EdgeRip } from "@/components/ui/EdgeRip";

const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const BODY: React.CSSProperties = { fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 400 };

const HEAD: React.CSSProperties = { fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 700 };

interface PositionedForImpactSectionProps {
  /** Trigger-Anker für den schwebenden Founder-Badge (Index.tsx) — hier beginnt er einzublenden. */
  sectionRef?: React.RefObject<HTMLElement>;
}

export const PositionedForImpactSection = ({ sectionRef }: PositionedForImpactSectionProps = {}) => {
  // Inhalte live aus dem CMS (Strapi „Home"); Fallback: statischer Content-Layer
  const positionedForImpact = useHomeSection("positionedForImpact", PFI_STATIC, positionedForImpactEn);
  const partners = positionedForImpact.proof.partners.map((p: { src: string; alt: string }) => ({
    src: img(p.src as Parameters<typeof img>[0]),
    alt: p.alt,
  }));

  const containerRef = useRef<HTMLDivElement>(null);
  const [hiddenLogos, setHiddenLogos] = useState<Record<string, boolean>>({});
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const quoteY = useTransform(scrollYProgress, [0, 1], ["30px", "-30px"]);
  const statsY = useTransform(scrollYProgress, [0, 1], ["20px", "-20px"]);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "transparent",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "clamp(5rem, 10vh, 9rem)",
        paddingBottom: "clamp(0.5rem, 1.5vh, 1.5rem)",
      }}
    >
      <motion.div ref={containerRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Split Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-14 items-center">

          {/* Left: 2-Gründer-Foto-Duo (Event-Fotos, Querformat, versetzt + leicht rotiert) */}
          <div className="relative w-full mx-auto lg:mx-0" style={{ maxWidth: "560px", aspectRatio: "1 / 0.82" }}>
            {/* Bild 1 — groß, oben links */}
            <motion.div
              initial={{ opacity: 0, y: 28, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", left: 0, top: 0, width: "70%" }}
            >
              <div style={{ position: "relative" }}>
                <div aria-hidden style={{ position: "absolute", inset: "12px 10px -10px -10px", border: "1.5px solid rgba(23,23,23,0.22)", borderRadius: "20px 20px 64px 20px", pointerEvents: "none" }} />
                <div style={{ position: "relative", aspectRatio: "3 / 2", borderRadius: "20px 20px 64px 20px", overflow: "hidden" }}>
                  <img src={img("systems-founder-1")} alt={positionedForImpact.portraitDuo?.alt1 ?? positionedForImpact.portrait.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <EdgeRip style={{ bottom: "-1px", right: "46%", width: "34px", height: "72px", zIndex: 1, transform: "scaleY(-1)" }} />
                </div>
              </div>
            </motion.div>
            {/* Bild 2 — kleiner, unten rechts */}
            <motion.div
              initial={{ opacity: 0, y: 36, rotate: 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 2.5 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", right: 0, bottom: 0, width: "64%", zIndex: 2 }}
            >
              <div style={{ position: "relative" }}>
                <div aria-hidden style={{ position: "absolute", inset: "-10px -10px 12px 10px", border: "1.5px solid rgba(23,23,23,0.22)", borderRadius: "20px 20px 20px 64px", pointerEvents: "none" }} />
                <div style={{ position: "relative", aspectRatio: "3 / 2", borderRadius: "20px 20px 20px 64px", overflow: "hidden", boxShadow: "0 24px 60px rgba(23,23,23,0.22)" }}>
                  <img src={img("systems-founder-2")} alt={positionedForImpact.portraitDuo?.alt2 ?? positionedForImpact.portrait.alt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              </div>
            </motion.div>
            {/* Lime-Akzent zwischen den Bildern */}
            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 0.6, rotate: 24 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 12 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", left: "58%", top: "34%", width: "26px", height: "26px", borderRadius: "7px", background: LIME, zIndex: 3 }}
            />
          </div>

          {/* Right: Manifesto + stats */}
          <div className="flex flex-col">
            <motion.blockquote
              style={{ y: quoteY, fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 700, fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)", lineHeight: 1.1, letterSpacing: "-0.01em", color: "#171717" }}
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="m-0 p-0"
            >
              {positionedForImpact.quote.line1}
              <br />
              {positionedForImpact.quote.line2Prefix}{" "}
              <AnimatedTextCycle
                words={positionedForImpact.quote.cycleWords}
                interval={2800}
                renderWord={(word) => (
                  <span
                    className="edge-mark"
                    style={{
                      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {word}
                  </span>
                )}
              />
              <br />
              {positionedForImpact.quote.line3}
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 mb-0"
              style={{
                fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                color: "rgba(23,23,23,0.68)",
                maxWidth: "52ch",
              }}
            >
              {positionedForImpact.body}
            </motion.p>

            {/* Stats row, hairline separators, no cards */}
            <motion.div
              style={{ y: statsY, borderRadius: 0 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="mt-6 md:mt-8 grid grid-cols-3"
            >
              {positionedForImpact.stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="flex flex-col"
                  style={{
                    paddingLeft: idx === 0 ? 0 : "20px",
                    paddingRight: idx === 2 ? 0 : "20px",
                    borderLeft: idx === 0 ? "none" : "1px solid rgba(23,23,23,0.14)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      fontWeight: 700,
                      color: "#171717",
                      fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      marginTop: "10px",
                      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      fontWeight: 500,
                      fontSize: "12.5px",
                      letterSpacing: "0.02em",
                      color: "#3C3C3C",
                      lineHeight: 1.5,
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </motion.div>


      {/* Proof-Badges: Auszeichnungen als benannte Chips statt Logo-Grau-Strip */}
      <div style={{ marginTop: "clamp(2rem, 4vh, 3.5rem)" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 py-2"
          >
            {/* Caption */}
            <p
              className="flex-shrink-0"
              style={{ ...BODY, fontWeight: 600, fontSize: "14px", color: "rgba(23,23,23,0.68)" }}
            >
              {positionedForImpact.proof.label}
            </p>

            {/* Badges */}
            <div className="flex flex-row items-stretch flex-wrap gap-3">
              {partners.map((partner, i) => (
                <motion.div
                  key={partner.alt}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 transition-colors duration-200 hover:border-[rgba(204,255,0,0.45)]"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(23,23,23,0.06)",
                    borderRadius: "12px",
                    padding: "10px 18px",
                    boxShadow: "0 1px 2px rgba(23,23,23,0.06)",
                  }}
                >
                  {!hiddenLogos[partner.alt] && (
                    <img
                      src={partner.src}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      decoding="async"
                      onError={() => setHiddenLogos((prev) => ({ ...prev, [partner.alt]: true }))}
                      style={{ height: "26px", width: "auto", objectFit: "contain", display: "block" }}
                    />
                  )}
                  <span style={{ ...BODY, fontWeight: 600, fontSize: "13.5px", color: INK_DEEP, whiteSpace: "nowrap" }}>
                    {partner.alt}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
