import { motion } from "framer-motion";
import { IconMapPin, IconQuote } from "@tabler/icons-react";
import { EdgePillButton } from "@/components/ui/EdgeCta";
import { caseSpotlight as caseSpotlightStatic, img } from "@/content";
import { caseSpotlight as caseSpotlightEn } from "@/content/en/sections/caseSpotlight";
import { miniCasesBySlug as miniCasesBySlugStatic } from "@/content/collections/miniCases";
import { miniCasesBySlug as miniCasesBySlugEn } from "@/content/en/collections/miniCases";
import { useLocalized, useLocalizedStatic } from "@/hooks/useLocalized";

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME_LIGHT = "#CCFF00";
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Kunden-Case-Feature im Referenz-Layout (dapta.ai): große dunkle
 * abgerundete Karte, Standort-Pin + „Reales Projekt", Headline mit
 * akzentfarbenem Kundennamen, Testimonial-Zitat, unten links der Autor
 * (Monogramm + Name + Rolle) und unten rechts der CTA, Bild rechts.
 * Nur Homepage-Spotlight — die Case-Detailseite behält result/metrics.
 */
export const CaseSpotlightSection = () => {
  const miniCasesBySlug = useLocalizedStatic(miniCasesBySlugStatic, miniCasesBySlugEn);
  // Inhalt live aus dem CMS (Strapi Single-Type „case-spotlight"); Fallback: statisch
  const caseSpotlight = useLocalized("case-spotlight", caseSpotlightStatic, caseSpotlightEn);
  const c = miniCasesBySlug[caseSpotlight.painPointSlug]?.find((m) => m.id === caseSpotlight.caseId);
  if (!c) return null;

  return (
    <section aria-label={caseSpotlight.headlineClient}>
      <div
        className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "clamp(32px,6vw,80px)", paddingBottom: "clamp(32px,6vw,80px)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="grid lg:grid-cols-[1.6fr_1fr] items-stretch"
          style={{
            borderRadius: "24px",
            overflow: "hidden",
            background: "radial-gradient(150% 150% at 100% 100%, #CCFF00 0%, #6B7A00 26%, #2E3300 48%, #171717 70%)",
            border: "1px solid rgba(204,255,0,0.22)",
          }}
        >
          {/* ── Text links ── */}
          <div
            style={{
              padding: "clamp(14px,1.8vw,24px) clamp(24px,4.5vw,60px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Standort + „Reales Projekt"-Eyebrow */}
            <div className="flex items-center gap-3" style={{ marginBottom: "12px" }}>
              <span className="flex items-center gap-2">
                <IconMapPin size={16} color={LIME_LIGHT} aria-hidden />
                <span style={{ fontFamily: OUTFIT, fontWeight: 500, fontSize: "14.5px", color: "rgba(255,255,255,0.68)" }}>
                  {caseSpotlight.location}
                </span>
              </span>
              <span aria-hidden style={{ width: "1px", height: "13px", background: "rgba(255,255,255,0.22)" }} />
              <span
                className="uppercase"
                style={{
                  fontFamily: OUTFIT,
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  color: LIME_LIGHT,
                }}
              >
                {c.badge.split("·")[0].trim()}
              </span>
            </div>

            {/* Headline mit Akzent-Kundenname */}
            <h2 style={{ color: "#fff", maxWidth: "26ch", fontSize: "clamp(19px, 2.3vw, 30px)", lineHeight: 1.1 }}>
              {caseSpotlight.headlinePrefix}
              <span style={{ color: LIME_LIGHT }}>{caseSpotlight.headlineClient}</span>
              {caseSpotlight.headlineSuffix}
            </h2>

            {/* Testimonial-Zitat */}
            <figure style={{ margin: 0, marginTop: "clamp(12px,1.4vw,18px)" }}>
              <IconQuote
                aria-hidden
                size={22}
                stroke={1.5}
                color={LIME_LIGHT}
                style={{ opacity: 0.55, marginBottom: "6px" }}
              />
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: OUTFIT,
                  fontWeight: 400,
                  fontSize: "clamp(15px,1.4vw,19px)",
                  lineHeight: 1.35,
                  color: "#F2F2F2",
                  maxWidth: "46ch",
                }}
              >
                {caseSpotlight.quote}
              </blockquote>
            </figure>

            {/* Autor unten links + CTA unten rechts — auf Bildhöhe gezogen */}
            <div
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-5 max-md:flex-col max-md:items-start"
              style={{ marginTop: "auto", paddingTop: "clamp(14px,1.6vw,20px)" }}
            >
              {/* Autor — Monogramm-Avatar + Name + Rolle */}
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(204,255,0,0.14)",
                    border: "1px solid rgba(204,255,0,0.45)",
                    fontFamily: OUTFIT,
                    fontWeight: 700,
                    fontSize: "12.5px",
                    letterSpacing: "0.02em",
                    color: LIME_LIGHT,
                  }}
                >
                  {caseSpotlight.authorInitials}
                </span>
                <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
                  <span style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "15.5px", color: "#F2F2F2" }}>
                    {caseSpotlight.authorName}
                  </span>
                  <span style={{ fontFamily: OUTFIT, fontWeight: 400, fontSize: "14px", color: "rgba(255,255,255,0.68)" }}>
                    {caseSpotlight.authorRole}
                  </span>
                </span>
              </div>

              {/* CTA — mobil einzeln zentriert; Autor (Avatar + Name) bleibt links */}
              <div className="max-md:self-center">
                <EdgePillButton to={caseSpotlight.href}>{caseSpotlight.ctaLabel}</EdgePillButton>
              </div>
            </div>
          </div>

          {/* ── Bild (Querformat, als Figur mit Bildunterschrift) — Desktop rechts, Mobile unten unter Titel+Text ── */}
          <figure
            className="flex flex-col justify-center"
            style={{ margin: 0, padding: "clamp(14px,2vw,34px)", gap: "14px" }}
          >
            <div
              className="relative w-full aspect-[16/9] md:aspect-[4/3]"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(204,255,0,0.22)",
                boxShadow: "0 26px 64px -26px rgba(23,23,23,0.55)",
              }}
            >
              <img
                src={img(caseSpotlight.image.src)}
                alt={caseSpotlight.image.alt}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
            </div>
            <figcaption
              className="flex items-center gap-2 max-md:hidden"
              style={{
                fontFamily: OUTFIT,
                fontWeight: 500,
                fontSize: "13px",
                letterSpacing: "0.01em",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              <span
                aria-hidden
                style={{ width: "18px", height: "1px", background: "rgba(255,255,255,0.68)", flexShrink: 0 }}
              />
              {caseSpotlight.image.alt}
            </figcaption>
          </figure>
        </motion.div>
      </div>
    </section>
  );
};
