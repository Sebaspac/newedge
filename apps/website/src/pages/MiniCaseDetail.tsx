import { lazy, Suspense, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ThreeStepsCTA } from "@/components/ThreeStepsCTA";
import { EdgePillButton, EdgeTextButton } from "@/components/ui/EdgeCta";
import { EdgeRip } from "@/components/ui/EdgeRip";
import { miniCaseDetail as T_STATIC } from "@/content/pages/miniCaseDetail";
import { miniCaseDetail as miniCaseDetailEn } from "@/content/en/pages/miniCaseDetail";
import { painPointPage as PPP_STATIC } from "@/content/pages/painPointAuswahlverfahren";
import { painPointPage as painPointPageEn } from "@/content/en/pages/painPointAuswahlverfahren";
import { img } from "@/content";
import { useLocalized } from "@/hooks/useLocalized";
import { usePainPoints } from "@/hooks/usePainPoints";

const Footer = lazy(() => import("@/components/Footer").then((m) => ({ default: m.Footer })));

/* ── Design tokens — NEWEDGE CI (Rebrush 2026-07) ── */
const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const FLASH       = "#FF1E00";
const INK_DEEP = "#171717";
const INK = "#3C3C3C";
const PAPER = "#F2F2F2";
const HAIRLINE = "rgba(23,23,23,0.14)";
const CARD_SHADOW = "0 1px 2px rgba(23,23,23,0.06)";
const BODY_MUTED = "rgba(23,23,23,0.68)";

const HEAD: React.CSSProperties = { fontFamily: OUTFIT, fontWeight: 700 };
const BODY: React.CSSProperties = { fontFamily: OUTFIT, fontWeight: 400 };

/** Kleiner Eyebrow-Style (Sektions-Label). */
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-block text-[13px] font-semibold uppercase tracking-[0.05em] mb-3"
    style={{ fontFamily: OUTFIT, color: INK_DEEP }}
  >
    {children}
  </span>
);

/** Violette Pille (Referenz „New York"-Badge), leichter Ton auf hellem Grund. */
const Pill = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.05em] px-3.5 py-1.5"
    style={{
      fontFamily: OUTFIT,
      color: INK_DEEP,
      border: `1px solid ${HAIRLINE}`,
      background: "rgba(204,255,0,0.14)",
      borderRadius: "999px",
    }}
  >
    {children}
  </span>
);

/** Kompaktes Branchen-Tag neben dem Case-Pill — schmaler & dezenter, nimmt wenig Platz. */
const Tag = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center text-[11px] font-medium tracking-[0.02em] px-2.5 py-1"
    style={{
      fontFamily: OUTFIT,
      color: BODY_MUTED,
      border: `1px solid ${HAIRLINE}`,
      borderRadius: "999px",
    }}
  >
    {children}
  </span>
);

const MiniCaseDetail = () => {
  const { slug, caseId } = useParams<{ slug: string; caseId: string }>();
  const { pathname } = useLocation();
  const basePath = pathname.startsWith("/industrien") ? "/industrien" : "/loesungen";

  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const t = useLocalized("mini-case-detail", T_STATIC, miniCaseDetailEn);
  const painPointPage = useLocalized("pain-point-page", PPP_STATIC, painPointPageEn);
  const { map: painPoints, defaultPainPoint } = usePainPoints();

  const content = useMemo(() => (slug && painPoints[slug]) || defaultPainPoint, [slug, painPoints, defaultPainPoint]);
  const cases = content.miniCases ?? [];
  const index = cases.findIndex((c) => c.id === caseId);
  const miniCase = index >= 0 ? cases[index] : undefined;

  const overviewHref = `${basePath}/${slug}#cases`;

  // Fallback wenn Case nicht existiert — hell, CI-konform
  if (!miniCase) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center" style={{ background: PAPER, color: INK_DEEP, fontFamily: OUTFIT }}>
        <p style={{ ...BODY, color: INK }}>{t.notFound.message}</p>
        <Link to={overviewHref} className="underline" style={{ color: INK_DEEP, fontFamily: OUTFIT, fontWeight: 600 }}>
          {t.notFound.backLabel}
        </Link>
      </div>
    );
  }

  const prev = index > 0 ? cases[index - 1] : undefined;
  const next = index < cases.length - 1 ? cases[index + 1] : undefined;

  // Hero-Bild: eigenes Case-Bild hat Vorrang (z. B. echtes Event-/Projektfoto).
  // Sonst Feature-Bild des Anwendungsfelds passend zur Case-Position (wie die
  // Übersicht), sonst dessen Hero-Bild, sonst die geteilte Chrome-Grafik.
  const featureImgs = [
    content.feature1?.image ?? content.hero?.image,
    content.feature2?.image ?? content.hero?.image,
    content.feature3?.image ?? content.hero?.image,
  ];
  const heroImgKey =
    miniCase.image?.src ?? featureImgs[index % featureImgs.length] ?? content.hero?.image ?? painPointPage.images.hero;
  const heroImgAlt = miniCase.image?.alt ?? miniCase.title;

  return (
    <>
      <SEOHead
        title={`${miniCase.title}${t.seo.titleSuffix}`}
        description={miniCase.teaser}
        canonical={`${basePath}/${slug}/case/${miniCase.id}`}
      />

      <div className="min-h-screen" style={{ fontFamily: OUTFIT, overflowX: "clip", background: PAPER, color: INK_DEEP }}>
        <MobileNavigation onContactClick={() => {}} theme="dark" />

        {/* ═══ HERO — hell, zweispaltig: Text links, Bild rechts (Referenz-Layout) ═══ */}
        <section className="relative">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8" style={{ paddingTop: "clamp(104px, 14vh, 148px)", paddingBottom: "clamp(40px, 6vw, 64px)" }}>
            <Link
              to={overviewHref}
              className="inline-flex items-center gap-2 text-[14px] font-medium mb-7 transition-opacity hover:opacity-70"
              style={{ fontFamily: OUTFIT, color: INK_DEEP }}
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backLink.prefix}{content.hero?.overlabel ? t.backLink.toPhases : t.backLink.toOverview}
            </Link>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              {/* LEFT — Badges + Headline + Teaser + CTAs */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <Pill>{miniCase.phaseLabel}</Pill>
                  {miniCase.industries?.length ? (
                    miniCase.industries.slice(0, 4).map((tag) => <Tag key={tag}>{tag}</Tag>)
                  ) : (
                    <Tag>{miniCase.badge ?? t.exampleBadge}</Tag>
                  )}
                </div>

                <h1 className="mb-4" style={{ color: INK_DEEP }}>
                  {miniCase.title}
                </h1>
                <p className="max-w-[560px] mb-8" style={{ ...BODY, color: BODY_MUTED }}>
                  {miniCase.teaser}
                </p>

                <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
                  <EdgePillButton to="/kontakt">{painPointPage.faq?.cta ?? "Kontakt aufnehmen"}</EdgePillButton>
                  <EdgeTextButton to={overviewHref}>{t.notFound.backLabel}</EdgeTextButton>
                </div>
              </div>

              {/* RIGHT — Bild mit versetztem Outline-Rahmen + Edge-Riss (Marken-Detail) */}
              <div className="relative w-full max-w-[560px] mx-auto lg:mx-0 lg:ml-auto">
                <div
                  aria-hidden
                  className="hidden sm:block"
                  style={{
                    position: "absolute",
                    inset: "-12px 12px 12px -12px",
                    border: "1.5px solid rgba(204,255,0,0.45)",
                    borderRadius: "16px 64px 16px 64px",
                    transform: "rotate(2deg)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative", overflow: "hidden", borderRadius: "16px 64px 16px 64px" }}>
                  <img src={img(heroImgKey)} alt={heroImgAlt} className="w-full h-auto block" style={{ aspectRatio: "4 / 3", objectFit: "cover" }} loading="eager" />
                  <EdgeRip style={{ top: "-1px", right: "20%", width: "28px", height: "66px", zIndex: 2 }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ STATS-BAND — breite Karte, große violette Kennzahlen (Referenz) ═══ */}
        <section className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div
            className="grid grid-cols-1 sm:grid-cols-3"
            style={{ background: "rgba(23,23,23,0.06)", border: `1px solid ${HAIRLINE}`, borderRadius: "24px", overflow: "hidden" }}
          >
            {miniCase.metrics.map((m, i) => (
              <div
                key={i}
                className="text-center px-6 py-9"
                style={{ borderLeft: i === 0 ? "none" : `1px solid ${HAIRLINE}` }}
              >
                <div className="text-[clamp(2.2rem,4vw,3rem)] leading-[1.05] mb-2" style={{ ...HEAD, fontWeight: 800, letterSpacing: "-0.02em", color: INK_DEEP }}>
                  {m.value}
                </div>
                <div className="text-[14px] leading-[1.5]" style={{ ...BODY, color: BODY_MUTED }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ BODY — 2-spaltig: sticky Kontext-Karte links, Prosa rechts (Referenz) ═══ */}
        <section className="max-w-[1200px] mx-auto px-6 lg:px-8" style={{ paddingTop: "clamp(48px, 7vw, 80px)", paddingBottom: "clamp(48px, 7vw, 80px)" }}>
          <div className="grid lg:grid-cols-[340px_1fr] gap-10 lg:gap-16 items-start">
            {/* LEFT — Kontext-/Szenario-Karte (sticky) */}
            <aside className="lg:sticky lg:top-28">
              <div
                className="p-7"
                style={{ background: "#FFFFFF", borderRadius: "20px", border: `1px solid ${HAIRLINE}`, boxShadow: CARD_SHADOW }}
              >
                <span
                  className="block"
                  style={{ fontFamily: OUTFIT, fontWeight: 800, fontSize: "3.25rem", lineHeight: 1, marginBottom: "0.25rem", color: "rgba(23,23,23,0.22)" }}
                  aria-hidden
                >&ldquo;</span>
                <p className="text-[1.05rem] leading-[1.5] mb-6" style={{ fontFamily: OUTFIT, fontWeight: 500, letterSpacing: "-0.01em", color: INK_DEEP }}>
                  {miniCase.scenario ?? miniCase.teaser}
                </p>
                <div className="h-px w-full mb-4" style={{ background: HAIRLINE }} />
                <p className="text-[12.5px] leading-[1.6]" style={{ ...BODY, color: "rgba(23,23,23,0.68)" }}>
                  {miniCase.disclaimer ?? t.exampleBadge}
                </p>
              </div>
            </aside>

            {/* RIGHT — Herausforderung / Lösung / Ergebnis */}
            <div>
              {/* Die Herausforderung */}
              <Eyebrow>{t.labels.situation}</Eyebrow>
              <p className="mb-3" style={{ ...BODY, color: INK }}>
                {miniCase.situation}
              </p>

              <div className="h-px w-full my-9" style={{ background: HAIRLINE }} />

              {/* Die Lösung */}
              <Eyebrow>{t.labels.approach}</Eyebrow>
              <ul className="flex flex-col gap-4 list-none mt-1">
                {miniCase.approach.map((step, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ ...BODY, color: INK }}>
                    <span className="shrink-0 w-6 h-6 flex items-center justify-center mt-0.5 rounded-full" style={{ background: "rgba(23,23,23,0.14)" }}>
                      <Check className="w-3.5 h-3.5" style={{ color: INK_DEEP }} />
                    </span>
                    <span className="leading-[1.6]">{step}</span>
                  </li>
                ))}
              </ul>

              <div className="h-px w-full my-9" style={{ background: HAIRLINE }} />

              {/* Das Ergebnis */}
              <Eyebrow>{t.labels.result}</Eyebrow>
              <p className="mb-6" style={{ ...BODY, color: INK }}>
                {miniCase.result}
              </p>
              <ul className="flex flex-col gap-2.5 list-none">
                {miniCase.metrics.map((m, i) => (
                  <li key={i} className="flex items-baseline gap-2.5" style={{ ...BODY, color: INK }}>
                    <span className="shrink-0 text-[15px]" style={{ ...HEAD, fontWeight: 700, color: INK_DEEP }}>{m.value}</span>
                    <span className="text-[15px] leading-[1.6]">{m.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ═══ Prev / Next ═══ */}
        <section className="max-w-[1200px] mx-auto px-6 lg:px-8 pb-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                to={`${basePath}/${slug}/case/${prev.id}`}
                className="group p-6 flex flex-col gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-14px_rgba(23,23,23,0.14)]"
                style={{ background: "#FFFFFF", borderRadius: "16px", border: `1px solid ${HAIRLINE}`, boxShadow: CARD_SHADOW }}
              >
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ fontFamily: OUTFIT, color: "rgba(23,23,23,0.68)" }}>
                  <ArrowLeft className="w-3.5 h-3.5" /> {prev.phaseLabel}
                </span>
                <span className="text-[15px]" style={{ fontFamily: OUTFIT, fontWeight: 600, color: INK_DEEP }}>{prev.title}</span>
              </Link>
            ) : <div aria-hidden />}
            {next ? (
              <Link
                to={`${basePath}/${slug}/case/${next.id}`}
                className="group p-6 flex flex-col gap-1.5 items-end text-right transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-14px_rgba(23,23,23,0.14)]"
                style={{ background: "#FFFFFF", borderRadius: "16px", border: `1px solid ${HAIRLINE}`, boxShadow: CARD_SHADOW }}
              >
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ fontFamily: OUTFIT, color: "rgba(23,23,23,0.68)" }}>
                  {next.phaseLabel} <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[15px]" style={{ fontFamily: OUTFIT, fontWeight: 600, color: INK_DEEP }}>{next.title}</span>
              </Link>
            ) : <div aria-hidden />}
          </div>
        </section>

        {/* CTA — identisch zur Homepage (mit Sebastian) */}
        <ThreeStepsCTA />

        <Suspense fallback={<div className="min-h-[300px]" />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default MiniCaseDetail;
