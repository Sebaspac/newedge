import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import {
  IconBriefcase,
  IconBulb,
  IconChartBar,
  IconClockDown,
  IconLayoutDashboard,
  IconListNumbers,
  IconMap,
  IconRefresh,
  IconRobot,
  IconSettings,
  IconShieldLock,
  IconStack2,
  IconTrendingUp,
  IconUserOff,
  IconUsers,
  IconUsersGroup,
  type Icon as TablerIcon,
} from "@tabler/icons-react";
import { EdgeIconBadge } from "@/components/ui/EdgeIconBadge";

/* Icons pro Listen-Item (Board-Stil) — index-aligned zu den Content-Arrays
   in src/content/pages/methodik.ts (stufen[i].ergebnis bzw. ziel.punkte).
   Ändert sich dort die Reihenfolge, hier nachziehen. */
const ERGEBNIS_ICONS: TablerIcon[][] = [
  [IconChartBar, IconListNumbers, IconBriefcase, IconMap],
  [IconLayoutDashboard, IconStack2, IconClockDown, IconTrendingUp],
  [IconUsers, IconUserOff, IconShieldLock, IconRefresh],
];
const ZIEL_ICONS: TablerIcon[] = [IconBulb, IconSettings, IconTrendingUp, IconRobot, IconUsersGroup];
import { MobileNavigation } from "@/components/MobileNavigation";
// import { NewEdgeSystemAnimated } from "@/components/NewEdgeSystemAnimated"; // Sektion vorerst ausgeblendet
import SEOHead from "@/components/SEOHead";
import { SpeakWithUsCta } from "@/components/SpeakWithUsCta";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { EdgePillButton, EdgeTextButton } from "@/components/ui/EdgeCta";
import { MitStudyGrid } from "@/components/ui/MitStudyGrid";
import { methodik as METHODIK_STATIC } from "@/content/pages/methodik";
import { methodik as methodikEn } from "@/content/en/pages/methodik";
import { useLocalized } from "@/hooks/useLocalized";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

/* ── NEWEDGE CI (Rebrush 2026-07) ── */
const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const FLASH       = "#FF1E00";
const INK_DEEP     = "#171717";
const INK_DEEPER   = "#101010";
const INK          = "#3C3C3C";
const PAPER        = "#F2F2F2";
const HAIRLINE     = "rgba(23,23,23,0.14)";
const EASE         = [0.22, 1, 0.36, 1] as const;

/** Kicker-Zeile: Outfit 700, 13px, uppercase, Violett. */
const KICKER: React.CSSProperties = {
  fontFamily: OUTFIT,
  fontWeight: 700,
  fontSize: "13px",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: INK_DEEP,
};

/** Fließtext: erbt Größe/Zeilenhöhe vom globalen Typo-System. */
const BODY: React.CSSProperties = {
  fontFamily: OUTFIT,
  color: INK,
};

/** Section-Headline: erbt Größe/Gewicht/Zeilenhöhe vom globalen Typo-System. */
const HEADLINE: React.CSSProperties = {
  color: INK_DEEP,
};

const Methodik = () => {
  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const methodik = useLocalized("methodik", METHODIK_STATIC, methodikEn);
  const { language } = useLanguage();

  return (
    <>
      <SEOHead
        title={methodik.seo.title}
        description={methodik.seo.description}
        canonical={methodik.seo.canonical}
      />

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <NoiseOverlay opacity={0.03} fixed zIndex={2} />
        <MobileNavigation onContactClick={() => {}} theme="dark" />

        {/* ── HERO ──────────────────────────────────────────────── */}
        <div className="relative" style={{ background: PAPER, minHeight: "clamp(460px, 66vh, 680px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(204,255,0,0.14) 0%, transparent 62%)",
          }} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "clamp(100px,16vh,140px) 24px clamp(60px,8vh,100px)" }}
          >
            {/* Headline */}
            <h1 style={{
              color: INK_DEEP,
            }}>
              {methodik.hero.headlineLine1}
              <br />
              <span className="edge-mark">{methodik.hero.headlineLine2}</span>
            </h1>

            {/* Subline */}
            <p style={{
              fontFamily: OUTFIT,
              color: INK,
              maxWidth: "560px",
              margin: "0 auto",
            }}>
              {methodik.hero.subline}
            </p>

            {/* CTA → Kontaktseite (kein Calendly mehr) */}
            <div style={{ marginTop: "36px", display: "flex", justifyContent: "center" }}>
              <EdgePillButton to="/kontakt">{methodik.hero.ctaLabel}</EdgePillButton>
            </div>
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
              background: "linear-gradient(to bottom, rgba(204,255,0,0), rgba(204,255,0,0.45) 50%, rgba(204,255,0,0.22))",
              boxShadow: "0 0 10px rgba(204,255,0,0.22)",
              zIndex: 3,
            }}
          />
        </div>

        {/* ── INTRO — Kernaussage (Akzentkante) links + „5/100"-Stat rechts ── */}
        <div style={{ background: PAPER, padding: "clamp(56px,7vw,96px) 24px" }}>
          <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-12 items-center">
            {/* LINKS — Kernaussage mit violetter Akzentkante */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="relative order-2 lg:order-1"
              style={{ paddingLeft: "clamp(20px, 3vw, 28px)" }}
            >
              <span
                aria-hidden
                className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full"
                style={{ background: `linear-gradient(180deg, ${LIME}, ${LIME})` }}
              />
              <h2 style={{ color: INK_DEEP, marginBottom: "24px" }}>
                {methodik.manifest.lead}
              </h2>
              <p style={{ ...BODY, marginBottom: "16px" }}>
                {methodik.manifest.body[0]}
              </p>
              <p style={{ ...BODY }}>
                {methodik.manifest.body[1]}
              </p>
            </motion.div>

            {/* Desktop rechts / Mobile oben — „5/100"-Stat (MIT-Studie 2025) */}
            <div className="order-1 lg:order-2 w-full max-w-[330px] lg:max-w-[400px] mx-auto">
              <MitStudyGrid lang={language} />
            </div>
          </div>
        </div>

        {/* ── ENTWICKLUNGSSTUFEN ────────────────────────────────── */}
        <div style={{ background: PAPER, padding: "clamp(56px,7vw,96px) 24px" }}>
          <div className="max-w-[1100px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{ marginBottom: "clamp(40px, 5vw, 64px)" }}
            >
              {methodik.stufenSection.eyebrow && (
                <p style={{ ...KICKER, marginBottom: "14px" }}>{methodik.stufenSection.eyebrow}</p>
              )}
              <h2 style={HEADLINE}>
                {methodik.stufenSection.headingLine1}
                <br />
                <span className="edge-mark">{methodik.stufenSection.headingLine2}</span>
              </h2>
            </motion.div>

            <div className="flex flex-col" style={{ gap: "20px" }}>
              {methodik.stufen.map((s, si) => (
                <motion.section
                  key={s.index}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="grid lg:grid-cols-[300px_1fr] gap-x-12 gap-y-7"
                  style={{
                    background: "#FFFFFF",
                    borderRadius: "16px",
                    border: `1px solid ${HAIRLINE}`,
                    boxShadow: "0 1px 2px rgba(23,23,23,0.06)",
                    padding: "clamp(28px, 4vw, 44px)",
                  }}
                >
                  {/* Left: Kreis-Badge + Titel + Leitfrage */}
                  <div>
                    <span
                      style={{
                        fontFamily: OUTFIT,
                        fontWeight: 700,
                        fontSize: "15px",
                        color: INK_DEEP,
                        background: LIME,
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "18px",
                      }}
                    >
                      {s.index}
                    </span>
                    <h3 style={{
                      color: INK_DEEP,
                    }}>
                      {s.title}
                    </h3>
                    <p style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "14px", lineHeight: 1.45, color: INK_DEEP, margin: 0 }}>
                      {s.frage}
                    </p>
                  </div>

                  {/* Right: Intro + Listen-Pills + Ergebnis */}
                  <div>
                    {s.intro.map((p, pi) => (
                      <p key={pi} style={{ ...BODY, marginBottom: "14px" }}>
                        {p}
                      </p>
                    ))}

                    {s.list && (
                      <div style={{ margin: "22px 0" }}>
                        <p style={{ ...KICKER, fontSize: "11px", letterSpacing: "0.08em", marginBottom: "12px" }}>
                          {s.listLabel}
                        </p>
                        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {s.list.map((item) => (
                            <li
                              key={item}
                              style={{
                                fontFamily: OUTFIT,
                                fontWeight: 500,
                                fontSize: "13px",
                                color: INK_DEEP,
                                background: "rgba(23,23,23,0.06)",
                                border: "1px solid rgba(23,23,23,0.14)",
                                borderRadius: "999px",
                                padding: "7px 15px",
                              }}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {s.outro && (
                      <p style={{ ...BODY, marginBottom: "22px" }}>
                        {s.outro}
                      </p>
                    )}

                    {/* Ergebnis */}
                    <div style={{ background: "rgba(204,255,0,0.14)", borderRadius: "12px", padding: "20px 24px" }}>
                      <p style={{ ...KICKER, fontSize: "11px", letterSpacing: "0.08em", marginBottom: "12px" }}>
                        {methodik.stufenSection.ergebnisLabel}
                      </p>
                      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {s.ergebnis.map((e, ei) => (
                          <li key={e} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "6px 0" }}>
                            <EdgeIconBadge icon={ERGEBNIS_ICONS[si]?.[ei] ?? IconChartBar} size="sm" style={{ marginTop: "-2px" }} />
                            <span style={{ fontFamily: OUTFIT, fontWeight: 400, fontSize: "14px", color: "rgba(23,23,23,0.68)", lineHeight: 1.6 }}>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </div>

        {/* ── DAS NEWEDGE SYSTEM (animiert) — vorerst ausgeblendet.
               Komponente + Content (sections/newEdgeSystem.ts) bleiben bestehen. */}

        {/* ── DAS ZIEL ──────────────────────────────────────────── */}
        <div style={{ background: PAPER, padding: "clamp(56px,7vw,96px) 24px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {methodik.ziel.eyebrow && (
                <p style={{ ...KICKER, marginBottom: "14px" }}>{methodik.ziel.eyebrow}</p>
              )}
              <h2 style={{ ...HEADLINE, marginBottom: "20px" }}>
                {methodik.ziel.headingLine1}
                <br />
                <span className="edge-mark">{methodik.ziel.headingLine2}</span>
              </h2>
              <p style={{ ...BODY, marginBottom: "28px" }}>
                {methodik.ziel.intro}
              </p>
              <ul style={{ listStyle: "none", margin: "0 0 28px", padding: 0 }}>
                {methodik.ziel.punkte.map((z, zi) => (
                  <li key={z} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 0",
                    borderBottom: zi < methodik.ziel.punkte.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  }}>
                    <EdgeIconBadge icon={ZIEL_ICONS[zi] ?? IconBulb} size="sm" style={{ marginTop: "-1px" }} />
                    <span style={{ fontFamily: OUTFIT, fontWeight: 500, fontSize: "15.5px", color: INK_DEEP, lineHeight: 1.6 }}>{z}</span>
                  </li>
                ))}
              </ul>
              <p style={{
                fontFamily: OUTFIT,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: INK_DEEP,
                margin: 0,
              }}>
                {methodik.ziel.closing}
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── CTA — geteilte Komponente, 1:1 wie auf der Anwendungsfelder-Seite ── */}
        <SpeakWithUsCta
          eyebrow={methodik.cta.eyebrow}
          headingLine1={methodik.cta.headingLine1}
          headingLine2={methodik.cta.headingLine2}
          phoneHref={methodik.cta.phoneHref}
          phoneLabel={methodik.cta.phoneLabel}
        />

        {/* Footer */}
        <Suspense fallback={<div style={{ minHeight: 200 }} />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Methodik;
