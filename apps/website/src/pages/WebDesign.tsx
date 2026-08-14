import { lazy, Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowUpRight } from "lucide-react";
import { MobileNavigation } from "@/components/MobileNavigation";
import SEOHead from "@/components/SEOHead";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { EdgePillButton } from "@/components/ui/EdgeCta";
import { ContactFormModal } from "@/components/ContactFormModal";
import { img } from "@/content";
import { clientLogos } from "@/content/sections/clientLogos";
import { webDesign as WEBDESIGN_STATIC } from "@/content/pages/webDesign";
import { webDesign as webDesignEn } from "@/content/en/pages/webDesign";
import { hero as HERO_STATIC } from "@/content/sections/hero";
import { hero as heroEn } from "@/content/en/sections/hero";
import { useLocalized, useLocalizedStatic } from "@/hooks/useLocalized";

const Footer = lazy(() => import("@/components/Footer").then((m) => ({ default: m.Footer })));

/* ── NEWEDGE CI (Rebrush 2026-07) ── */
const OUTFIT: React.CSSProperties = { fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const LIME = "#CCFF00";
const FLASH       = "#FF1E00";
const INK_DEEP     = "#171717";
const INK_DEEPER   = "#101010";
const PAPER        = "#F2F2F2";
const HAIRLINE     = "rgba(23,23,23,0.14)";
const INK_GRADIENT = "linear-gradient(160deg, #1F1F1F 0%, #171717 45%, #101010 100%)";
const RADIUS       = 16;
const EASE         = [0.22, 1, 0.36, 1] as const;

const SectionHeadline = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ color: INK_DEEP }}>{children}</h2>
);

/** Kleine Chip-Zeile mit Check-Icon (Hero-Trust-Signale). */
const TrustChip = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-2" style={{ ...OUTFIT, fontWeight: 500, fontSize: "14px", color: INK_DEEP }}>
    <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full" style={{ background: HAIRLINE }}>
      <Check className="w-3 h-3" style={{ color: INK_DEEP }} />
    </span>
    {label}
  </span>
);

const WebDesign = () => {
  const c = useLocalized("web-design", WEBDESIGN_STATIC, webDesignEn);
  const video = useLocalizedStatic(HERO_STATIC, heroEn).video;
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Marken-Logos (transparente Logos, keine Fotos) für Dark-Grids — auf Ink weiß invertiert.
  const brandLogos = clientLogos.filter((l) =>
    ["logo-albanova-consulting", "logo-elite-aesthetic", "logo-becoming-you", "logo-pure-design", "logo-muse-studio", "logo-seabreeze", "logo-club-cli", "logo-darius-company"].includes(l.src),
  );

  return (
    <>
      <SEOHead title={c.seo.title} description={c.seo.description} canonical={c.seo.canonical} />

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <NoiseOverlay opacity={0.03} fixed zIndex={2} />
        <MobileNavigation onContactClick={() => setIsContactOpen(true)} theme="dark" />

        {/* ═══ 1 — HERO (hell, zentriert) ═══ */}
        <section style={{ background: PAPER }}>
          <div className="max-w-[900px] mx-auto px-6 lg:px-8 text-center" style={{ paddingTop: "clamp(116px,16vh,158px)", paddingBottom: "clamp(44px,6vw,64px)" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
              <h1 style={{ color: INK_DEEP, marginBottom: "22px" }}>
                {c.hero.headlinePrefix}
                <span className="edge-mark">{c.hero.headlineAccent}</span>
                {c.hero.headlineSuffix}
              </h1>
              <p style={{ ...OUTFIT, color: "#3C3C3C", maxWidth: "620px", margin: "0 auto 28px" }}>
                {c.hero.sub}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3" style={{ marginBottom: "32px" }}>
                {c.hero.trustChips.map((chip) => <TrustChip key={chip} label={chip} />)}
              </div>
              <div className="flex justify-center">
                <EdgePillButton onClick={() => setIsContactOpen(true)}>{c.hero.ctaPrimary}</EdgePillButton>
              </div>
              <p style={{ ...OUTFIT, fontWeight: 400, fontSize: "12.5px", color: "#5E5E5A", marginTop: "16px" }}>
                *{c.hero.note}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ═══ 2 — SHOWREEL (dunkle Karte: Video-Facade + Founder) ═══ */}
        <section style={{ background: PAPER }}>
          <div className="max-w-[1120px] mx-auto px-6 lg:px-8" style={{ paddingBottom: "clamp(36px,5vw,56px)" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{ position: "relative", overflow: "hidden", borderRadius: "24px", background: INK_GRADIENT, border: "1px solid rgba(204,255,0,0.22)", boxShadow: "0 30px 80px -32px rgba(23,23,23,0.45)" }}
            >
              <div style={{ position: "relative", aspectRatio: "16 / 9", width: "100%" }}>
                {/* Native YouTube-Vorschau (kein Custom-Facade) */}
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ 3 — LOGO-STRIP ═══ */}
        <section style={{ background: PAPER }}>
          <div className="max-w-[1100px] mx-auto px-6 lg:px-8" style={{ paddingBottom: "clamp(48px,7vw,88px)" }}>
            <p className="text-center" style={{ ...OUTFIT, fontWeight: 600, fontSize: "13px", letterSpacing: "0.04em", textTransform: "uppercase", color: "#5E5E5A", marginBottom: "24px" }}>
              {c.showreel.logosHeading}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {clientLogos.slice(0, 9).map((l) => (
                <img
                  key={l.src}
                  src={img(l.src)}
                  alt={l.alt}
                  loading="lazy"
                  style={{ height: `${l.height ?? 30}px`, width: "auto", objectFit: "contain", opacity: 0.55, filter: "grayscale(1)" }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 4 — PROJEKTABLAUF ═══ */}
        <section style={{ background: "#fff", borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}>
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8" style={{ paddingTop: "clamp(64px,8vw,100px)", paddingBottom: "clamp(64px,8vw,100px)" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: EASE }} className="text-center" style={{ marginBottom: "clamp(40px,5vw,56px)" }}>
              <p style={{ ...OUTFIT, fontWeight: 700, fontSize: "13px", letterSpacing: "0.06em", textTransform: "uppercase", color: INK_DEEP, marginBottom: "12px" }}>
                {c.prozess.eyebrow}
              </p>
              <SectionHeadline>{c.prozess.heading}</SectionHeadline>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {c.prozess.steps.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                  className="flex flex-col overflow-hidden"
                  style={{ background: "#fff", borderRadius: RADIUS, border: `1px solid ${HAIRLINE}`, boxShadow: "0 1px 2px rgba(23,23,23,0.06)" }}
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 3", background: PAPER }}>
                    <img src={img(s.image)} alt={s.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div style={{ padding: "24px 24px 28px" }}>
                    <div className="flex items-center gap-3" style={{ marginBottom: "10px" }}>
                      <span style={{ ...OUTFIT, fontWeight: 700, fontSize: "13px", color: INK_DEEP, background: LIME, width: "28px", height: "28px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                      <h3 style={{ color: INK_DEEP, margin: 0 }}>{s.title}</h3>
                    </div>
                    <p style={{ ...OUTFIT, fontWeight: 400, fontSize: "14.5px", lineHeight: 1.65, color: "#5E5E5A", margin: 0 }}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col items-center" style={{ marginTop: "clamp(40px,5vw,56px)" }}>
              <EdgePillButton onClick={() => setIsContactOpen(true)}>{c.prozess.ctaPrimary}</EdgePillButton>
              <p style={{ ...OUTFIT, fontWeight: 400, fontSize: "12.5px", color: "#5E5E5A", marginTop: "14px" }}>*{c.prozess.note}</p>
            </div>
          </div>
        </section>

        {/* ═══ 5 — PROJEKTEINBLICKE ═══ */}
        <section style={{ background: PAPER }}>
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8" style={{ paddingTop: "clamp(64px,8vw,100px)", paddingBottom: "clamp(64px,8vw,100px)" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: EASE }} style={{ marginBottom: "clamp(40px,5vw,56px)" }}>
              <p style={{ ...OUTFIT, fontWeight: 700, fontSize: "13px", letterSpacing: "0.06em", textTransform: "uppercase", color: INK_DEEP, marginBottom: "12px" }}>
                {c.cases.eyebrow}
              </p>
              <SectionHeadline>{c.cases.heading}</SectionHeadline>
            </motion.div>

            <div className="flex flex-col" style={{ gap: "clamp(40px,5.5vw,72px)" }}>
              {c.cases.items.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="grid md:grid-cols-[0.72fr_1.5fr_1.1fr] gap-6 lg:gap-8 items-stretch"
                >
                  {/* Text links (schmal) */}
                  <div className="flex flex-col justify-center">
                    <img src={img(item.logo)} alt={item.name} loading="lazy" style={{ height: "26px", width: "auto", objectFit: "contain", marginBottom: "18px", filter: "grayscale(1)", opacity: 0.85 }} />
                    <p style={{ ...OUTFIT, fontWeight: 400, fontSize: "14.5px", lineHeight: 1.7, color: INK_DEEP }}>{item.desc}</p>
                  </div>

                  {/* Bild 1 (breiter) — Mockup-Slot */}
                  <div className="overflow-hidden" style={{ borderRadius: "16px", height: "clamp(240px,30vw,380px)", background: PAPER, boxShadow: "0 24px 56px -24px rgba(23,23,23,0.22)" }}>
                    <img src={img(item.imageDesktop)} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>

                  {/* Bild 2 — Mockup-Slot */}
                  <div className="overflow-hidden" style={{ borderRadius: "16px", height: "clamp(240px,30vw,380px)", background: INK_DEEP, boxShadow: "0 24px 56px -24px rgba(23,23,23,0.22)" }}>
                    <img src={img(item.imagePhone)} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 6 — ERSTGESPRÄCH (dunkle Abschluss-Sektion, Referenz-Layout) ═══ */}
        <section id="kontakt" style={{ background: INK_DEEPER }}>
          <div className="max-w-[820px] mx-auto px-6 lg:px-8 text-center" style={{ paddingTop: "clamp(72px,9vw,112px)", paddingBottom: "clamp(72px,9vw,112px)" }}>
            <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: EASE }}>
              <img src={img(c.showreel.founder.image)} alt={c.showreel.founder.name} loading="lazy" className="rounded-full object-cover mx-auto" style={{ width: "72px", height: "72px", border: "1px solid rgba(204,255,0,0.45)", marginBottom: "22px" }} />
              <p style={{ ...OUTFIT, fontWeight: 700, fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", color: LIME, marginBottom: "14px" }}>{c.finalCta.eyebrow}</p>
              <h2 style={{ color: "#fff", marginBottom: "18px" }}>{c.finalCta.heading}</h2>
              <p style={{ ...OUTFIT, color: "rgba(255,255,255,0.68)", maxWidth: "52ch", margin: "0 auto 32px" }}>{c.finalCta.sub}</p>
              <div className="flex justify-center">
                <EdgePillButton onClick={() => setIsContactOpen(true)}>{c.finalCta.ctaPrimary}</EdgePillButton>
              </div>
              <p style={{ ...OUTFIT, fontWeight: 400, fontSize: "12.5px", color: "rgba(255,255,255,0.68)", marginTop: "16px" }}>*{c.finalCta.note}</p>

              {/* Logo-Cloud (weiß invertiert) */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-8 gap-y-6 items-center justify-items-center" style={{ marginTop: "clamp(48px,6vw,72px)" }}>
                {brandLogos.map((l) => (
                  <img key={l.src} src={img(l.src)} alt="" loading="lazy" style={{ maxHeight: "24px", maxWidth: "100px", width: "auto", objectFit: "contain", opacity: 0.4, filter: "brightness(0) invert(1)" }} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <Suspense fallback={<div style={{ minHeight: 200 }} />}>
          <Footer />
        </Suspense>
      </div>

      <ContactFormModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        accentColor={LIME}
        gradientFrom={INK_DEEP}
        gradientTo="#101010"
        theme="studio"
      />
    </>
  );
};

export default WebDesign;
