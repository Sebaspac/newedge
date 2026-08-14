import { lazy, Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Plus } from "lucide-react";
import { MobileNavigation } from "@/components/MobileNavigation";
import SEOHead from "@/components/SEOHead";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { EdgePillButton, EdgeTextButton } from "@/components/ui/EdgeCta";
import { ContactFormModal } from "@/components/ContactFormModal";
import { SpeakWithUsCta } from "@/components/SpeakWithUsCta";
import { VideoShowcaseSection } from "@/components/VideoShowcaseSection";
import { CaseSpotlightSection } from "@/components/CaseSpotlightSection";
import { MitStudyGrid } from "@/components/ui/MitStudyGrid";
import { img } from "@/content";
import { cortexPage as CORTEX_STATIC } from "@/content/pages/cortex";
import { cortexPage as cortexPageEn } from "@/content/en/pages/cortex";
import { useLocalized } from "@/hooks/useLocalized";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = lazy(() => import("@/components/Footer").then((m) => ({ default: m.Footer })));

const OUTFIT: React.CSSProperties = { fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const LIME = "#CCFF00";
const LIME_SOFT = "rgba(204,255,0,0.14)";
const INK_DEEP    = "#171717";
const INK         = "#3C3C3C";
const FLASH       = "#FF1E00";
const INK_DEEPER  = "#101010";
const PAPER       = "#F2F2F2";
const RADIUS      = 16;
const EASE        = [0.22, 1, 0.36, 1] as const;

/** Torn-paper jagged divider — signature transition between full-bleed blocks. */
const JaggedDivider = ({ color, flip = false }: { color: string; flip?: boolean }) => (
  <div
    aria-hidden
    style={{
      height: "44px",
      background: color,
      clipPath: flip
        ? "polygon(0% 100%, 100% 100%, 100% 45%, 96% 65%, 92% 35%, 88% 70%, 84% 40%, 80% 75%, 76% 45%, 72% 80%, 68% 40%, 64% 70%, 60% 100%, 56% 60%, 52% 80%, 48% 45%, 44% 70%, 40% 100%, 36% 60%, 32% 80%, 28% 50%, 24% 75%, 20% 100%, 16% 60%, 12% 80%, 8% 45%, 4% 70%, 0% 40%)"
        : "polygon(0% 0%, 100% 0%, 100% 55%, 96% 35%, 92% 65%, 88% 30%, 84% 60%, 80% 25%, 76% 55%, 72% 20%, 68% 60%, 64% 30%, 60% 0%, 56% 40%, 52% 20%, 48% 55%, 44% 30%, 40% 0%, 36% 40%, 32% 20%, 28% 50%, 24% 25%, 20% 0%, 16% 40%, 12% 20%, 8% 55%, 4% 30%, 0% 60%)",
    }}
  />
);

const NumberBadge = ({ n }: { n: string }) => (
  <span
    style={{
      ...OUTFIT,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: LIME,
      color: INK_DEEP,
      fontWeight: 700,
      fontSize: "15px",
      flexShrink: 0,
    }}
  >
    {n}
  </span>
);

const SectionHeadline = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <h2
    style={{
      color: dark ? "#fff" : INK_DEEP,
    }}
  >
    {children}
  </h2>
);

/** Splits `text` on `phrase` and wraps it in the violet accent color. Falls back to plain text if not found. */
const withAccent = (text: string, phrase: string) => {
  const idx = text.indexOf(phrase);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="edge-mark">{phrase}</span>
      {text.slice(idx + phrase.length)}
    </>
  );
};

/** FAQ-Accordion (Landing-Page-CI): Single-Open, Plus-Toggle, weiche maxHeight-Transition. */
const FaqAccordion = ({ items }: { items: { q: string; a: string }[] }) => {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="overflow-hidden"
            style={{ background: "#fff", borderRadius: RADIUS, border: "1px solid rgba(23,23,23,0.14)", boxShadow: "0 1px 2px rgba(23,23,23,0.06)" }}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="w-full flex justify-between items-center gap-4 text-left hover:opacity-80 transition-opacity"
              style={{ ...OUTFIT, fontWeight: 600, fontSize: "16px", color: INK_DEEP, padding: "20px 24px" }}
            >
              <span>{f.q}</span>
              <span
                aria-hidden
                className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                style={{ border: `1px solid ${isOpen ? LIME : "rgba(23,23,23,0.22)"}`, background: isOpen ? LIME_SOFT : "transparent", color: isOpen ? INK_DEEP : "rgba(23,23,23,0.45)" }}
              >
                <Plus className="w-4 h-4" />
              </span>
            </button>
            <div className="overflow-hidden" style={{ maxHeight: isOpen ? "340px" : "0px", transition: "max-height 0.32s cubic-bezier(0.22,1,0.36,1)" }}>
              <p style={{ ...OUTFIT, fontWeight: 400, fontSize: "15px", lineHeight: 1.7, color: "#5E5E5A", padding: "0 24px 22px" }}>
                {f.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Cortex = () => {
  const cortex = useLocalized("cortex-page", CORTEX_STATIC, cortexPageEn);
  const faqs = cortex.faq ?? CORTEX_STATIC.faq;
  const { language } = useLanguage();
  const isEn = language === "en";
  const [isContactOpen, setIsContactOpen] = useState(false);

  /* Seiten-Chrome, das (noch) nicht im Content-Layer liegt. Muss sprach-
     abhängig sein — diese Strings rendern auch auf /en/cortex. Die Werte
     (1, 100%) bleiben in beiden Sprachen identisch. */
  const t = {
    ctaBook: isEn ? "Book a free intro call" : "Kostenloses Erstgespräch buchen",
    ctaUnsure: isEn ? "Not sure it's a fit? Talk to us" : "Unsicher, ob es passt? Sprecht mit uns",
    promise: isEn ? "Our promise" : "Unser Versprechen",
    ctaEyebrow: isEn ? "Ready to start?" : "Bereit loszulegen?",
    ctaHead1: isEn ? "Talk to us" : "Sprechen Sie",
    ctaHead2: isEn ? "directly." : "direkt mit uns.",
  };

  const stats = [
    { value: "1", label: isEn ? "Place for all AI use" : "Ort für alle KI-Nutzung" },
    { value: isEn ? "GDPR" : "DSGVO", label: isEn ? "compliant & auditable" : "konform & auditierbar" },
    { value: "100%", label: isEn ? "Transparency over AI use" : "Transparenz über KI-Nutzung" },
  ];

  return (
    <>
      <SEOHead
        title={cortex.seo.title}
        description={cortex.seo.description}
        canonical={cortex.seo.canonical}
      />

      <div className="min-h-screen" style={{ overflowX: "clip", ...OUTFIT }}>
        <NoiseOverlay opacity={0.03} fixed zIndex={2} />
        <MobileNavigation onContactClick={() => setIsContactOpen(true)} theme="dark" />

        {/* ═══ 1 — HERO ═══ */}
        <div className="relative" style={{ background: PAPER, minHeight: "94dvh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
              background: "radial-gradient(ellipse 90% 70% at 50% -8%, rgba(204,255,0,0.14) 0%, transparent 60%)",
            }}
          />

          <div className="relative" style={{ zIndex: 2, padding: "clamp(120px,16vh,160px) 24px clamp(56px,7vh,88px)" }}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center" style={{ maxWidth: "1180px", margin: "0 auto" }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <h1
                  style={{
                    color: INK_DEEP,
                  }}
                >
                  {withAccent(cortex.hero.headline, language === "en" ? "Cortex makes it controllable." : "Cortex macht sie steuerbar.")}
                </h1>
                <p style={{ ...OUTFIT, color: "#3C3C3C", maxWidth: "48ch", marginBottom: "36px" }}>
                  {cortex.hero.sub}
                </p>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4" style={{ marginBottom: "48px" }}>
                  <EdgePillButton href="#kontakt">{cortex.hero.ctaPrimary}</EdgePillButton>
                  <EdgeTextButton href="#fuer-wen">
                    {cortex.hero.ctaSecondary}
                  </EdgeTextButton>
                </div>

                {/* Stat row */}
                <div className="grid grid-cols-3 gap-3" style={{ maxWidth: "520px" }}>
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid rgba(23,23,23,0.14)",
                        borderRadius: RADIUS,
                        padding: "14px 14px",
                        boxShadow: "0 1px 2px rgba(23,23,23,0.06)",
                      }}
                    >
                      <div style={{ ...OUTFIT, fontWeight: 700, fontSize: "1.35rem", color: INK_DEEP }}>{s.value}</div>
                      <div style={{ ...OUTFIT, fontWeight: 400, fontSize: "11.5px", color: "#5E5E5A", marginTop: "2px", lineHeight: 1.3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                style={{ position: "relative" }}
              >
                <div aria-hidden style={{
                  position: "absolute", inset: "-16px", zIndex: 0, pointerEvents: "none",
                  background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(204,255,0,0.14) 0%, transparent 70%)",
                }} />
                <div style={{ position: "relative", zIndex: 1, borderRadius: RADIUS, overflow: "hidden", boxShadow: "0 0 0 1px rgba(23,23,23,0.14), 0 30px 70px -22px rgba(23,23,23,0.22)" }}>
                  <img
                    src={img(cortex.hero.image.src)}
                    alt={cortex.hero.image.alt}
                    className="w-full h-[280px] sm:h-[380px] lg:h-[460px] object-cover object-center"
                    loading="eager"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <JaggedDivider color={PAPER} />

        {/* ═══ 2 — PROBLEM (Intro) — Text links, MIT-Studie-Grafik rechts ═══ */}
        <section style={{ background: PAPER }}>
          <div className="max-w-[1100px] mx-auto px-6 lg:px-8" style={{ paddingTop: "clamp(24px,4vw,40px)", paddingBottom: "clamp(64px,8vw,100px)" }}>
            <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-14 items-start">
              {/* TEXT — links (Desktop), unten (Mobile) */}
              <div className="order-2 lg:order-1">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: EASE }} style={{ marginBottom: "clamp(28px,3.4vw,40px)" }}>
                  <SectionHeadline>{cortex.problem.heading}</SectionHeadline>
                </motion.div>
                <div className="flex flex-col gap-4">
                  {cortex.problem.situations.map((q, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                      style={{ background: INK_DEEP, borderRadius: RADIUS, padding: "clamp(24px,2.8vw,30px)" }}
                    >
                      <span style={{ ...OUTFIT, fontWeight: 800, fontSize: "1.8rem", color: LIME, lineHeight: 1 }}>„</span>
                      <p style={{ ...OUTFIT, fontWeight: 500, color: "#F2F2F2", marginTop: "8px" }}>
                        {q}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* GRAFIK — rechts (Desktop), oben (Mobile) — MIT-Studie, hochwertige Variante */}
              <div className="order-1 lg:order-2 w-full max-w-[420px] mx-auto lg:mx-0">
                <MitStudyGrid lang={language} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 3 — LÖSUNG / MECHANISMUS — full-bleed violet ═══ */}
        <section style={{ background: INK_DEEP }}>
          <div className="max-w-[1100px] mx-auto px-6 lg:px-8 grid md:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start" style={{ paddingTop: "clamp(64px,8vw,100px)", paddingBottom: "clamp(64px,8vw,100px)" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: EASE }}>
              <SectionHeadline dark>{cortex.solution.heading}</SectionHeadline>
              <p style={{ ...OUTFIT, fontWeight: 400, color: "rgba(255,255,255,0.92)", marginTop: "20px", maxWidth: "50ch" }}>
                {cortex.solution.intro}
              </p>
            </motion.div>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="flex flex-col gap-4 list-none"
            >
              {cortex.solution.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4"
                  style={{ background: "rgba(255,255,255,0.06)", borderRadius: RADIUS, padding: "16px 18px" }}
                >
                  <span
                    className="shrink-0 w-6 h-6 flex items-center justify-center mt-0.5"
                    style={{ background: "#fff", borderRadius: "50%" }}
                  >
                    <Check className="w-3.5 h-3.5" style={{ color: LIME }} />
                  </span>
                  <span style={{ ...OUTFIT, fontWeight: 400, fontSize: "14.5px", lineHeight: 1.6, color: "#fff" }}>{b}</span>
                </li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* ═══ 4 — ABLAUF ═══ */}
        <section style={{ background: PAPER }}>
          <div className="max-w-[1100px] mx-auto px-6 lg:px-8" style={{ paddingTop: "clamp(64px,8vw,100px)", paddingBottom: "clamp(64px,8vw,100px)" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: EASE }} style={{ marginBottom: "clamp(40px,5vw,56px)" }}>
              <SectionHeadline>{cortex.ablauf.heading}</SectionHeadline>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cortex.ablauf.steps.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  style={{ background: "#fff", borderRadius: RADIUS, padding: "clamp(24px,3vw,28px)", border: "1px solid rgba(23,23,23,0.14)", boxShadow: "0 1px 2px rgba(23,23,23,0.06)" }}
                >
                  <NumberBadge n={s.step} />
                  <h3 style={{ color: INK_DEEP, marginTop: "16px" }}>{s.title}</h3>
                  <p style={{ ...OUTFIT, color: "#5E5E5A" }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Farbloser CTA unter den Schritten (Ghost-Text, öffnet Kontakt-Modal) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex justify-center"
              style={{ marginTop: "clamp(36px,4.5vw,52px)" }}
            >
              <EdgeTextButton onClick={() => setIsContactOpen(true)}>
                {t.ctaBook}
              </EdgeTextButton>
            </motion.div>
          </div>
        </section>

        {/* ═══ Video-Showcase (Homepage-Modul „NEWEDGE in Aktion") — ca. Seitenmitte ═══ */}
        <div style={{ background: PAPER }}>
          <VideoShowcaseSection />
        </div>

        {/* ═══ 5 — WARUM NEWEDGE ═══ */}
        <section style={{ background: "#fff" }}>
          <div className="max-w-[900px] mx-auto px-6 lg:px-8" style={{ paddingTop: "clamp(64px,8vw,100px)", paddingBottom: "clamp(64px,8vw,100px)" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: EASE }} style={{ marginBottom: "clamp(40px,5vw,56px)" }}>
              <SectionHeadline>{cortex.warum.heading}</SectionHeadline>
            </motion.div>
            <div className="flex flex-col gap-4">
              {cortex.warum.points.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                  className="flex items-start gap-5"
                  style={{ background: PAPER, borderRadius: RADIUS, padding: "22px 24px" }}
                >
                  <NumberBadge n={String(i + 1)} />
                  <p style={{ ...OUTFIT, color: INK_DEEP, maxWidth: "60ch", marginTop: "8px" }}>{p}</p>
                </motion.div>
              ))}
            </div>

            {/* Farbiger Primär-CTA unten (violetter Pill, öffnet Kontakt-Modal) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex justify-center"
              style={{ marginTop: "clamp(40px,5vw,60px)" }}
            >
              <EdgePillButton onClick={() => setIsContactOpen(true)}>
                {t.ctaBook}
              </EdgePillButton>
            </motion.div>
          </div>
        </section>

        {/* ═══ 6 — GARANTIE — Trust-Karte (auffälliger Violett-Gradient, Text | Founder-Bild) ═══ */}
        <section style={{ background: PAPER }}>
          <div className="max-w-[1100px] mx-auto px-6 lg:px-8" style={{ paddingTop: "clamp(56px,7vw,88px)", paddingBottom: "clamp(56px,7vw,88px)" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "24px",
                background: "linear-gradient(150deg, #1F1F1F 0%, #171717 50%, #101010 100%)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 30px 80px -32px rgba(23,23,23,0.22)",
                padding: "clamp(32px,4.2vw,52px) clamp(28px,4.5vw,52px)",
              }}
            >
              {/* Helles Glanzlicht (oben mittig) — Shine statt dunklem Glow */}
              <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 62% 55% at 50% 0%, rgba(255,255,255,0.22) 0%, transparent 62%)" }} />

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center" style={{ position: "relative", zIndex: 1 }}>
                {/* TEXT — links (Desktop), oben (Mobile) */}
                <div className="order-1">
                  <p style={{ ...OUTFIT, fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.92)", marginBottom: "12px" }}>
                    {t.promise}
                  </p>

                  <h2 style={{ color: "#fff", marginBottom: "14px" }}>
                    {cortex.garantie.heading}
                  </h2>

                  <p style={{ ...OUTFIT, fontWeight: 500, fontSize: "clamp(16px,1.3vw,18px)", lineHeight: 1.5, color: "rgba(255,255,255,0.68)", marginBottom: "12px" }}>
                    {withAccent(cortex.garantie.text, language === "en" ? "GDPR-compliant and auditable at any time." : "DSGVO-konform und jederzeit auditierbar.")}
                  </p>

                  <p style={{ ...OUTFIT, fontWeight: 400, fontSize: "13.5px", color: "rgba(255,255,255,0.68)", marginBottom: "24px" }}>
                    {cortex.garantie.sub}
                  </p>

                  <EdgePillButton variant="frost" onClick={() => setIsContactOpen(true)}>
                    {t.ctaBook}
                  </EdgePillButton>
                </div>

                {/* BILD — rechts (Desktop), unten (Mobile) — Founder bei der Arbeit (erstmal) */}
                <div
                  className="order-2"
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4 / 3",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 24px 64px rgba(23,23,23,0.22)",
                  }}
                >
                  <img
                    src={img(cortex.garantie.image.src)}
                    alt={cortex.garantie.image.alt}
                    loading="lazy"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ 7 — FÜR WEN / NICHT ═══ */}
        <section id="fuer-wen" style={{ background: PAPER }}>
          <div className="max-w-[1000px] mx-auto px-6 lg:px-8" style={{ paddingTop: "clamp(64px,8vw,100px)", paddingBottom: "clamp(64px,8vw,100px)" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: EASE }} style={{ marginBottom: "clamp(40px,5vw,56px)" }}>
              <SectionHeadline>{cortex.fit.heading}</SectionHeadline>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-5">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: EASE }} style={{ background: "#fff", borderRadius: RADIUS, padding: "clamp(28px,3vw,34px)", border: "1px solid rgba(23,23,23,0.14)", boxShadow: "0 1px 2px rgba(23,23,23,0.06)" }}>
                <h3 style={{ fontWeight: 700, fontSize: "14px", letterSpacing: "0.02em", textTransform: "uppercase", color: INK_DEEP, marginBottom: "20px" }}>
                  {cortex.fit.passtLabel}
                </h3>
                <ul className="flex flex-col gap-4 list-none">
                  {cortex.fit.passt.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5" style={{ background: LIME_SOFT, borderRadius: "50%" }}>
                        <Check className="w-3 h-3" style={{ color: INK_DEEP }} />
                      </span>
                      <span style={{ ...OUTFIT, fontWeight: 400, fontSize: "14px", lineHeight: 1.6, color: INK_DEEP }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: 0.08, ease: EASE }} style={{ background: "#E5E5E5", borderRadius: RADIUS, padding: "clamp(28px,3vw,34px)" }}>
                <h3 style={{ fontWeight: 700, fontSize: "14px", letterSpacing: "0.02em", textTransform: "uppercase", color: "#5E5E5A", marginBottom: "20px" }}>
                  {cortex.fit.passtNichtLabel}
                </h3>
                <ul className="flex flex-col gap-4 list-none">
                  {cortex.fit.passtNicht.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5" style={{ background: "rgba(23,23,23,0.06)", borderRadius: "50%" }}>
                        <X className="w-3 h-3" style={{ color: "#5E5E5A" }} />
                      </span>
                      <span style={{ ...OUTFIT, fontWeight: 400, fontSize: "14px", lineHeight: 1.6, color: "#5E5E5A" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Farbloser CTA unter den beiden Karten (Ghost-Text, öffnet Kontakt-Modal) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex justify-center"
              style={{ marginTop: "clamp(36px,4.5vw,52px)" }}
            >
              <EdgeTextButton onClick={() => setIsContactOpen(true)}>
                {t.ctaUnsure}
              </EdgeTextButton>
            </motion.div>
          </div>
        </section>

        {/* ═══ BMP-Case (Homepage-Case-Spotlight „Bayerischer Mittelstandspreis") ═══ */}
        <div style={{ background: PAPER }}>
          <CaseSpotlightSection />
        </div>

        {/* ═══ FAQ — Landing-Page (richtige CI) ═══ */}
        <section style={{ background: "#fff" }}>
          <div className="max-w-[820px] mx-auto px-6 lg:px-8" style={{ paddingTop: "clamp(56px,7vw,88px)", paddingBottom: "clamp(56px,7vw,88px)" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ marginBottom: "clamp(32px,4vw,48px)", textAlign: "center" }}
            >
              <SectionHeadline>{faqs.heading}</SectionHeadline>
            </motion.div>
            <FaqAccordion items={[...faqs.items]} />
          </div>
        </section>

        {/* ═══ 8 — CTA: geteilte „Sprechen Sie direkt mit uns"-Karte (wie Anwendungsfelder/Methodik/Über uns) ═══ */}
        <div id="kontakt">
          <SpeakWithUsCta
            eyebrow={t.ctaEyebrow}
            headingLine1={t.ctaHead1}
            headingLine2={t.ctaHead2}
            phoneHref="tel:+4917660431467"
            phoneLabel="+49 176 60 431 467"
          />
        </div>

        <Suspense fallback={<div style={{ minHeight: 200 }} />}>
          <Footer />
        </Suspense>
      </div>

      <ContactFormModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        accentColor={LIME}
        gradientFrom={INK_DEEP}
        gradientTo={INK_DEEPER}
        theme="studio"
        sla
      />
    </>
  );
};

export default Cortex;
