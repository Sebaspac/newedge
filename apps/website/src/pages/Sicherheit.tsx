/**
 * Seite: Sicherheit, Datenschutz & Betrieb  (`/sicherheit`, EN: `/en/sicherheit`)
 * --------------------------------------------------------------
 * Reine Darstellungs-Komponente: der gesamte Text liegt im
 * Content-Layer (`content/pages/sicherheit.ts` bzw. dessen EN-Spiegel)
 * und kommt über `useLocalized` sprachrichtig — mit CMS-Vorrang und
 * statischem Fallback, wie bei `KiGlossar`.
 *
 * Aufbau: Hero → Kurzfassung → Sprungmarken → Abschnitte →
 * Abgrenzungs-Kasten („Was wir nicht behaupten") → CTA → Footer.
 *
 * Gescrollt wird per `window.scrollTo`, nicht per `scrollIntoView`:
 * Der `overflow-x-hidden`-Wrapper wird vom Browser zum (nicht
 * scrollenden) Scroll-Container — `scrollIntoView` zielte ins Leere.
 * Dieselbe Eigenheit ist in `KiGlossar.tsx` dokumentiert.
 * --------------------------------------------------------------
 */
import { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { MobileNavigation } from "@/components/MobileNavigation";
import SEOHead from "@/components/SEOHead";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { EdgePillButton } from "@/components/ui/EdgeCta";
import { EdgeRip } from "@/components/ui/EdgeRip";
import { sicherheit as SICHERHEIT_STATIC } from "@/content/pages/sicherheit";
import { sicherheit as sicherheitEn } from "@/content/en/pages/sicherheit";
import { useLocalized } from "@/hooks/useLocalized";

const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

/* ── NEWEDGE CI (Rebrush 2026-07) ── */
const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
/** Lime — reine Akzent-/Flächenfarbe; nie als Text auf hellem Grund. */
const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const PAPER = "#F2F2F2";
const HAIRLINE = "rgba(23,23,23,0.14)";
const INK_GRADIENT = "linear-gradient(160deg, #1F1F1F 0%, #171717 45%, #101010 100%)";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Abstand der Sprungmarken-Leiste zum Ziel (sticky-Höhe + Luft). */
const ANCHOR_OFFSET = 108;

const Sicherheit = () => {
  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const c = useLocalized("sicherheit", SICHERHEIT_STATIC, sicherheitEn);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - ANCHOR_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: OUTFIT,
    color: "rgba(23,23,23,0.72)",
    marginBottom: "14px",
  };

  return (
    <>
      <SEOHead
        title={c.seo.title}
        description={c.seo.description}
        canonical={c.seo.canonical}
      />

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <NoiseOverlay opacity={0.03} fixed zIndex={2} />
        <MobileNavigation onContactClick={() => {}} theme="dark" />

        {/* ── HERO ── */}
        <div className="relative" style={{ background: PAPER, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(23,23,23,0.06) 0%, transparent 62%)",
          }} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              position: "relative", zIndex: 2,
              maxWidth: "820px", margin: "0 auto",
              padding: "clamp(100px,16vh,140px) 24px clamp(40px,6vh,64px)",
            }}
          >
            <p style={{
              fontFamily: OUTFIT, fontWeight: 600, fontSize: "12px",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: "rgba(23,23,23,0.60)", marginBottom: "18px",
            }}>
              {c.hero.eyebrow}
            </p>

            <h1 style={{ color: INK_DEEP }}>{c.hero.headline}</h1>

            <p style={{ fontFamily: OUTFIT, color: "rgba(23,23,23,0.72)", maxWidth: "640px" }}>
              {c.hero.subline}
            </p>
          </motion.div>
        </div>

        {/* ── INHALT ── */}
        <div style={{ background: PAPER, position: "relative" }}>
          <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px clamp(56px,7vw,96px)" }}>

            {/* Kurzfassung */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE }}
              aria-label={c.summary.label}
              style={{
                background: "#FFFFFF",
                borderRadius: "20px",
                border: `1px solid ${HAIRLINE}`,
                boxShadow: "0 1px 2px rgba(23,23,23,0.06)",
                padding: "clamp(24px,4vw,36px)",
              }}
            >
              <p style={{
                fontFamily: OUTFIT, fontWeight: 600, fontSize: "11px",
                letterSpacing: "0.10em", textTransform: "uppercase",
                color: "rgba(23,23,23,0.60)", marginBottom: "18px",
              }}>
                {c.summary.label}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "12px" }}>
                {c.summary.items.map((item) => (
                  <li key={item} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <span aria-hidden style={{
                      flex: "none", width: "7px", height: "7px", borderRadius: "999px",
                      background: LIME, border: `1px solid ${HAIRLINE}`, marginTop: "9px",
                    }} />
                    <span style={{ fontFamily: OUTFIT, color: "rgba(23,23,23,0.78)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Sprungmarken */}
            <nav aria-label={c.tocLabel} style={{ marginTop: "clamp(32px,4vw,48px)" }}>
              <p style={{
                fontFamily: OUTFIT, fontWeight: 600, fontSize: "11px",
                letterSpacing: "0.10em", textTransform: "uppercase",
                color: "rgba(23,23,23,0.60)", marginBottom: "12px",
              }}>
                {c.tocLabel}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {c.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => { e.preventDefault(); scrollToSection(s.id); }}
                    style={{
                      fontFamily: OUTFIT, fontWeight: 500, fontSize: "13.5px",
                      color: INK_DEEP, textDecoration: "none",
                      padding: "7px 14px", borderRadius: "999px",
                      border: `1px solid ${HAIRLINE}`, background: "#FFFFFF",
                    }}
                  >
                    {s.navLabel}
                  </a>
                ))}
              </div>
            </nav>

            {/* Abschnitte */}
            {c.sections.map((s) => (
              <motion.section
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{
                  scrollMarginTop: `${ANCHOR_OFFSET}px`,
                  marginTop: "clamp(44px,6vw,72px)",
                  paddingTop: "clamp(28px,4vw,40px)",
                  borderTop: `1px solid ${HAIRLINE}`,
                }}
              >
                <h2 style={{ color: INK_DEEP }}>{s.heading}</h2>

                {s.body.map((p) => (
                  <p key={p} style={bodyStyle}>{p}</p>
                ))}

                {s.items && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "grid", gap: "10px" }}>
                    {s.items.map((item) => (
                      <li key={item} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span aria-hidden style={{
                          flex: "none", width: "5px", height: "5px", borderRadius: "999px",
                          background: INK_DEEP, marginTop: "10px", opacity: 0.55,
                        }} />
                        <span style={{ fontFamily: OUTFIT, color: "rgba(23,23,23,0.72)" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {s.after && <p style={{ ...bodyStyle, marginTop: "18px", marginBottom: 0 }}>{s.after}</p>}
              </motion.section>
            ))}

            {/* Abgrenzung — dunkle Ink-Karte */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{
                position: "relative",
                marginTop: "clamp(48px,6vw,80px)",
                background: INK_GRADIENT,
                borderRadius: "24px",
                border: "1px solid rgba(204,255,0,0.14)",
                padding: "clamp(32px,5vw,56px) clamp(24px,4vw,48px)",
                overflow: "hidden",
              }}
            >
              <div aria-hidden style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 70% 60% at 0% 100%, rgba(204,255,0,0.12) 0%, transparent 65%)",
              }} />
              <EdgeRip style={{ top: "-1px", right: "16%", width: "28px", height: "66px", zIndex: 1 }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <h2 style={{ color: "#fff" }}>{c.grenzen.heading}</h2>
                <p style={{ fontFamily: OUTFIT, color: "rgba(255,255,255,0.68)", marginBottom: "22px" }}>
                  {c.grenzen.intro}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "16px" }}>
                  {c.grenzen.items.map((item) => (
                    <li key={item} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <span aria-hidden style={{
                        flex: "none", width: "7px", height: "7px", borderRadius: "999px",
                        background: LIME, marginTop: "9px",
                      }} />
                      <span style={{ fontFamily: OUTFIT, color: "rgba(255,255,255,0.78)" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* Verweis auf die vollständigen Rechtstexte */}
            <p style={{ marginTop: "clamp(28px,4vw,40px)", textAlign: "center" }}>
              <Link
                to={c.legal.to}
                style={{
                  fontFamily: OUTFIT, fontWeight: 500, fontSize: "15px",
                  color: INK_DEEP, textUnderlineOffset: "4px",
                }}
              >
                {c.legal.label} →
              </Link>
            </p>

            {/* Abschluss-CTA */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{
                marginTop: "clamp(32px,4vw,48px)",
                background: "#FFFFFF",
                borderRadius: "24px",
                border: `1px solid ${HAIRLINE}`,
                boxShadow: "0 1px 2px rgba(23,23,23,0.06)",
                padding: "clamp(32px,5vw,56px) clamp(24px,4vw,48px)",
                textAlign: "center",
              }}
            >
              <h2 style={{ color: INK_DEEP }}>{c.cta.heading}</h2>
              <p style={{
                fontFamily: OUTFIT, color: "rgba(23,23,23,0.72)",
                maxWidth: "540px", margin: "0 auto 28px",
              }}>
                {c.cta.body}
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <EdgePillButton to={c.cta.to}>{c.cta.button}</EdgePillButton>
              </div>
            </motion.section>
          </div>
        </div>

        <Suspense fallback={<div style={{ minHeight: 200 }} />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Sicherheit;
