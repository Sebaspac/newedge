import { lazy, Suspense, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MobileNavigation } from "@/components/MobileNavigation";
import SEOHead from "@/components/SEOHead";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CursorLine } from "@/components/ui/CursorLine";
import { EdgePillButton } from "@/components/ui/EdgeCta";
import { img } from "@/content";
import { useJobs } from "@/hooks/useJobs";
import { careers as CAREERS_STATIC } from "@/content/pages/careers";
import { careers as careersEn } from "@/content/en/pages/careers";
import { useLocalized } from "@/hooks/useLocalized";

const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const LIME_SOFT = "rgba(204,255,0,0.45)";
const FLASH = "#FF1E00";
const INK_DEEP = "#171717";
const INK = "#3C3C3C";
const INK_DEEPER = "#101010";
const PAPER = "#F2F2F2";
const HAIRLINE = "rgba(23,23,23,0.14)";
/** Dunkler Ink-Verlauf für dunkle Flächen (Referenz: Footer-Karte / EdgeCta). */
const INK_GRADIENT = "linear-gradient(160deg, #1F1F1F 0%, #171717 45%, #101010 100%)";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Kicker/Eyebrow-Grundstil: auf hellem Grund (Paper) immer Ink — Lime ist dort als
    Text nicht lesbar; auf dunklem Grund (Ink-Karten) LIME (Lime). */
const KICKER: React.CSSProperties = {
  fontFamily: OUTFIT,
  fontWeight: 700,
  fontSize: "13px",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const CARD_SHADOW = "0 1px 2px rgba(23,23,23,0.06)";

const Careers = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const ctaBtnRef = useRef<HTMLDivElement>(null);

  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const careers = useLocalized("careers", CAREERS_STATIC, careersEn);
  const jobs = useJobs();


  // Der Pfeil kommt jetzt aus der EdgePillButton-Komponente —
  // die dekorative ↗-Glyphe am Label-Ende entfällt (Copy bleibt unverändert).
  const applyLabel = careers.positions.applyLabel.replace(/\s*↗\s*$/u, "");

  return (
    <>
      <SEOHead
        title={careers.seo.title}
        description={careers.seo.description}
        canonical={careers.seo.canonical}
      />

      <div className="min-h-screen overflow-x-hidden" style={{ background: PAPER, color: INK_DEEP }}>
        <NoiseOverlay opacity={0.03} fixed zIndex={2} />
        <MobileNavigation onContactClick={() => {}} theme="dark" />

        {/* ── HERO ── */}
        <div className="relative" style={{ background: PAPER, minHeight: "clamp(460px, 66vh, 680px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(23,23,23,0.06) 0%, transparent 62%)",
          }} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "clamp(100px,16vh,140px) 24px clamp(60px,8vh,100px)" }}
          >
            {/* Headline */}
            <h1 style={{
              color: INK_DEEP,
            }}>
              {careers.hero.headline}
            </h1>

            {/* Subline */}
            <p style={{
              fontFamily: OUTFIT,
              color: INK,
              maxWidth: "600px",
              margin: "0 auto",
            }}>
              {careers.hero.subline}
            </p>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "2px",
              height: "clamp(80px, 10vh, 130px)",
              background: "linear-gradient(to bottom, rgba(204,255,0,0), rgba(204,255,0,0.68) 50%, rgba(204,255,0,0.22))",
              boxShadow: "0 0 10px rgba(204,255,0,0.45)",
              zIndex: 3,
            }}
          />
        </div>

        {/* ── ÜBER UNS + WARUM ── */}
        <div style={{ background: PAPER, padding: "clamp(56px,7vw,96px) 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

            {/* Über uns — Statement-Callout mit violetter Akzentkante (Layout wie Definition) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative max-w-[800px]"
              style={{ marginBottom: "clamp(56px, 7vw, 96px)", paddingLeft: "clamp(20px, 3vw, 28px)" }}
            >
              <span
                aria-hidden
                className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full"
                style={{ background: `linear-gradient(180deg, ${LIME_SOFT}, ${LIME})` }}
              />
              <h2 style={{ color: INK_DEEP, marginBottom: "20px" }}>
                {careers.about.eyebrow}
              </h2>
              <p style={{ fontFamily: OUTFIT, fontWeight: 400, color: "rgba(23,23,23,0.68)" }}>
                {careers.about.body}
              </p>
            </motion.div>

            {/* Warum NEW EDGE */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ marginBottom: "clamp(32px, 4vw, 48px)" }}
              >
                {careers.why.eyebrow && (
                  <p style={{ ...KICKER, color: INK_DEEP, marginBottom: "14px" }}>
                    {careers.why.eyebrow}
                  </p>
                )}
                <h2 style={{ color: INK_DEEP }}>
                  {careers.why.heading}
                </h2>
              </motion.div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                {careers.why.values.map((v, i) => (
                  <motion.div
                    key={v.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
                    style={{
                      background: "#FFFFFF",
                      border: `1px solid ${HAIRLINE}`,
                      borderRadius: "16px",
                      boxShadow: CARD_SHADOW,
                      padding: "clamp(28px, 4vw, 40px)",
                    }}
                  >
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "999px",
                      background: "rgba(23,23,23,0.06)",
                      border: "1px solid rgba(23,23,23,0.14)",
                      padding: "4px 12px",
                      fontFamily: OUTFIT,
                      fontWeight: 700,
                      fontSize: "12px",
                      letterSpacing: "0.04em",
                      color: LIME,
                      marginBottom: "18px",
                    }}>
                      {v.label}
                    </span>
                    <h3 style={{ color: INK_DEEP }}>
                      {v.title}
                    </h3>
                    <p style={{ fontFamily: OUTFIT, color: "rgba(23,23,23,0.68)" }}>
                      {v.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── OFFENE POSITIONEN ── */}
        <div style={{ background: PAPER, padding: "clamp(56px,7vw,96px) 24px" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ marginBottom: "clamp(40px, 5vw, 64px)", textAlign: "center" }}
            >
              {careers.positions.eyebrow && (
                <p style={{ ...KICKER, color: INK_DEEP, marginBottom: "14px" }}>
                  {careers.positions.eyebrow}
                </p>
              )}
              <h2 style={{ color: INK_DEEP }}>
                {careers.positions.heading}
              </h2>
              <p style={{ fontFamily: OUTFIT, color: "rgba(23,23,23,0.68)", maxWidth: "520px", margin: "0 auto" }}>
                {careers.positions.intro}
              </p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-3">
              {jobs.map((pos, pi) => (
                <motion.div
                  key={pos.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, ease: EASE, delay: pi * 0.07 }}
                >
                  <AccordionItem
                    value={pos.id}
                    style={{
                      border: `1px solid ${HAIRLINE}`,
                      borderRadius: "16px",
                      background: "#FFFFFF",
                      boxShadow: CARD_SHADOW,
                    }}
                    className="overflow-hidden"
                  >
                    <AccordionTrigger
                      className="hover:no-underline hover:bg-[#F4F2FF] transition-colors duration-200"
                      style={{ padding: "clamp(20px, 3vw, 28px) clamp(20px, 3vw, 32px)" }}
                    >
                      <div style={{ textAlign: "left", flex: 1, paddingRight: "16px" }}>
                        <span style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "clamp(16px, 1.5vw, 18px)", letterSpacing: "-0.01em", color: INK_DEEP, display: "block", marginBottom: "8px", lineHeight: 1.25 }}>
                          {pos.title}
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          {pos.tags.map((tag, ti) => (
                            <span key={ti} style={{ fontFamily: OUTFIT, fontWeight: 500, fontSize: "12.5px", letterSpacing: "0.02em", color: "rgba(23,23,23,0.68)" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent style={{ padding: "0 clamp(20px, 3vw, 32px) clamp(24px, 3vw, 36px)" }}>
                      <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "24px" }}>
                        {pos.sections.map((sec, si) => (
                          <div key={si} style={{ marginBottom: si < pos.sections.length - 1 ? "24px" : "28px" }}>
                            <p style={{ ...KICKER, fontSize: "12px", letterSpacing: "0.05em", color: LIME, marginBottom: "10px" }}>
                              {sec.label}
                            </p>
                            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                              {sec.items.map((item, ii) => (
                                <li key={ii} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                                  <span aria-hidden style={{ color: LIME, fontSize: "9px", marginTop: "6px", flexShrink: 0 }}>▸</span>
                                  <span style={{ fontFamily: OUTFIT, fontWeight: 400, fontSize: "14px", color: "rgba(23,23,23,0.68)", lineHeight: 1.6 }}>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <EdgePillButton href={pos.mailto}>{applyLabel}</EdgePillButton>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>

        {/* ── INITIATIVBEWERBUNG CTA ── */}
        <CursorLine buttonRef={ctaBtnRef} buttonRadius={76}>
        <div style={{
          background: INK_GRADIENT,
          padding: "clamp(56px,7vw,96px) 24px",
          position: "relative",
        }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 70% 60% at 0% 100%, rgba(204,255,0,0.14) 0%, transparent 65%)",
          }} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, ease: EASE }}
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
            {/* LEFT — text */}
            <div>
              {careers.cta.eyebrow && (
                <p style={{ ...KICKER, color: LIME, marginBottom: "14px" }}>
                  {careers.cta.eyebrow}
                </p>
              )}
              <h2 style={{
                color: "#fff",
              }}>
                {careers.cta.heading}
              </h2>
              <p style={{
                fontFamily: OUTFIT,
                color: "rgba(255,255,255,0.68)",
                maxWidth: "380px",
              }}>
                {careers.cta.body}
              </p>
            </div>

            {/* RIGHT — Wenjamin circle */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <motion.div
                ref={ctaBtnRef}
                style={{ position: "relative", width: "152px", height: "152px", cursor: "pointer" }}
                variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
                initial="rest"
                whileHover="hover"
                transition={{ duration: 0.28 }}
                onClick={() => window.open(careers.cta.person.mailto, "_blank")}
              >
                {/* Revolving text ring */}
                <div style={{ position: "absolute", inset: 0, animation: "careers-spin 12s linear infinite" }}>
                  <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
                    <defs>
                      <path id="careers-circle" d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0" />
                    </defs>
                    <text style={{ fontSize: "16px", fill: "#ffffff", fontFamily: OUTFIT, fontWeight: 600, letterSpacing: "0.08em" }}>
                      <textPath href="#careers-circle" startOffset="0%">{careers.cta.ringText}</textPath>
                    </text>
                  </svg>
                  <style>{`@keyframes careers-spin { to { transform: rotate(360deg); } }`}</style>
                </div>
                {/* Center image */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ position: "relative", width: "96px", height: "96px", borderRadius: "50%", overflow: "hidden", border: "2.5px solid #CCFF00", boxShadow: "0 4px 20px rgba(204,255,0,0.22)" }}>
                    <img
                      src={img(careers.cta.person.src)}
                      alt={careers.cta.person.alt}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }}
                    />
                    {/* Arrow overlay on hover */}
                    <motion.div
                      variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                      initial="rest"
                      transition={{ duration: 0.2 }}
                      style={{
                        position: "absolute", inset: 0,
                        background: "rgba(23,23,23,0.68)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff",
                        borderRadius: "50%",
                      }}
                    >
                      <ArrowUpRight style={{ width: "26px", height: "26px" }} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        </CursorLine>

        <Suspense fallback={<div style={{ minHeight: 200 }} />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Careers;
