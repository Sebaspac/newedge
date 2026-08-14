import { lazy, Suspense, useState, useEffect, useRef, useMemo } from "react";

import { AiVoicesSection } from "@/components/AiVoicesSection";
import { VideoShowcaseSection } from "@/components/VideoShowcaseSection";
import { useParams } from "react-router-dom";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { Helmet } from "react-helmet-async";
import { Plus, Check, ArrowRight, X } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { MobileNavigation } from "@/components/MobileNavigation";
import { img } from "@/content";
import { painPointPage as PPP_STATIC } from "@/content/pages/painPointAuswahlverfahren";
import { painPointPage as painPointPageEn } from "@/content/en/pages/painPointAuswahlverfahren";
import { useLocalized, useLocalizedStatic } from "@/hooks/useLocalized";
import { usePainPoints } from "@/hooks/usePainPoints";
import { Logos3 } from "@/components/ui/logos3";
import { EdgePillButton, EdgeTextButton } from "@/components/ui/EdgeCta";
import { SpeakWithUsCta } from "@/components/SpeakWithUsCta";
import { EdgeRip } from "@/components/ui/EdgeRip";
import { resultJourneys as RJ_STATIC } from "@/content/resultJourney";
import { resultJourneys as resultJourneysEn } from "@/content/en/resultJourney";
import { featureBulletIcons } from "@/content/featureBulletIcons";
import { featureCardIcons } from "@/content/featureCardIcons";
import { EdgeIconBadge } from "@/components/ui/EdgeIconBadge";
import { IconCheck, type Icon as TablerIcon } from "@tabler/icons-react";
import NotFound from "./NotFound";

const Footer = lazy(() => import("@/components/Footer").then((m) => ({ default: m.Footer })));

/* ──────────────────────────────────────────────
   Design tokens — NEWEDGE CI (Rebrush 2026-07)
────────────────────────────────────────────── */
const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const FLASH = "#FF1E00";
const INK_DEEP = "#171717";
const INK = "#3C3C3C";
const PAPER = "#F2F2F2";
const INK_GRADIENT = "linear-gradient(160deg, #1F1F1F 0%, #171717 45%, #101010 100%)";
const HAIRLINE = "rgba(23,23,23,0.14)";
const CARD_SHADOW = "0 1px 2px rgba(23,23,23,0.06)";
const BODY_MUTED = "rgba(23,23,23,0.68)";

const HEAD: React.CSSProperties = { fontFamily: OUTFIT, fontWeight: 700 };
const BODY: React.CSSProperties = { fontFamily: OUTFIT, fontWeight: 400 };

/** OS-Einstellung „Bewegung reduzieren": Sektionen erscheinen dann ohne Einblend-Animation. */
const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Temporärer Schalter: Mini-Cases-Sektion + Hero-Sprung-CTA global aus-/einblenden,
    ohne Code oder Inhalte (miniCases.ts) zu löschen. */
const SHOW_MINI_CASES = false;

/* ────────────── Reusable atoms (Light theme) ────────────── */

/** Erste Headline jeder Section — provokant/catchy */
const SectionHeadline = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2
    className={className}
    style={{ color: INK_DEEP }}
  >
    {children}
  </h2>
);

const SectionSub = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-8 max-w-[540px]" style={{ ...BODY, color: BODY_MUTED }}>
    {children}
  </p>
);

/** Bullet-Liste im Board-Icon-Stil: pro Eintrag ein inhaltlich passendes
    Tabler-Icon (aus src/content/featureBulletIcons.ts), Fallback Check. */
const BulletList = ({ items, icons }: { items: string[]; icons?: TablerIcon[] }) => (
  <ul className="flex flex-col gap-3.5 mb-7 list-none">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3.5 text-[15px] leading-[1.6]" style={{ ...BODY, color: INK }}>
        <EdgeIconBadge icon={icons?.[i] ?? IconCheck} size="sm" className="mt-[-2px]" />
        {item}
      </li>
    ))}
  </ul>
);

/* ────────────── FAQ accordion ────────────── */

const FAQItem = ({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) => {
  return (
    <div
      className="overflow-hidden"
      style={{ background: "#FFFFFF", borderRadius: "16px", border: `1px solid ${HAIRLINE}`, boxShadow: CARD_SHADOW }}
    >
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-4 px-5 md:py-5 md:px-6 text-left hover:opacity-80 transition-opacity gap-4 text-[14px] md:text-[15px]"
        style={{ fontFamily: OUTFIT, fontWeight: 600, color: INK_DEEP }}
      >
        <span>{q}</span>
        <span
          className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          style={{
            border: `1px solid ${open ? LIME : "rgba(23,23,23,0.22)"}`,
            background: open ? "rgba(204,255,0,0.14)" : "transparent",
            color: open ? INK_DEEP : "rgba(23,23,23,0.45)",
          }}
        >
          <Plus className="w-3.5 h-3.5" />
        </span>
      </button>
      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? "400px" : "0px",
          transition: PREFERS_REDUCED_MOTION ? "none" : "max-height 0.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="px-5 pb-4 md:px-6 md:pb-5 text-[13.5px] md:text-[14.5px] leading-[1.7]" style={{ ...BODY, color: BODY_MUTED }}>
          {a}
        </div>
      </div>
    </div>
  );
};

/* ────────────── Compare accordion (nur Mobile) ────────────── */

/** Eine Vergleichs-Kategorie als aufklappbares Panel: Kategorie antippen,
    NEWEDGE-Vorteil (grün) + manueller Nachteil (rot) klappen auf. */
const CompareAccordionItem = ({
  k,
  ne,
  ma,
  headNewEdge,
  altLabel,
  open,
  onToggle,
}: {
  k: string;
  ne: string;
  ma: string;
  headNewEdge: string;
  altLabel: string;
  open: boolean;
  onToggle: () => void;
}) => (
  <div
    className="overflow-hidden"
    style={{ background: "#FFFFFF", borderRadius: "16px", border: `1px solid ${HAIRLINE}`, boxShadow: CARD_SHADOW }}
  >
    <button
      onClick={onToggle}
      aria-expanded={open}
      className="w-full flex justify-between items-center py-4 px-5 text-left hover:opacity-80 transition-opacity gap-4"
      style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "14.5px", color: INK_DEEP }}
    >
      <span>{k}</span>
      <span
        className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        style={{
          border: `1px solid ${open ? LIME : "rgba(23,23,23,0.22)"}`,
          background: open ? "rgba(204,255,0,0.14)" : "transparent",
          color: open ? INK_DEEP : "rgba(23,23,23,0.45)",
        }}
      >
        <Plus className="w-3.5 h-3.5" />
      </span>
    </button>

    <div
      className="overflow-hidden"
      style={{
        maxHeight: open ? "320px" : "0px",
        transition: PREFERS_REDUCED_MOTION ? "none" : "max-height 0.32s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* NEWEDGE — Vorteil */}
      <div style={{ padding: "13px 20px", background: "rgba(21,128,61,0.06)", borderTop: `1px solid ${HAIRLINE}` }}>
        <span
          className="block"
          style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: INK_DEEP, marginBottom: "6px" }}
        >
          {headNewEdge}
        </span>
        <span className="flex items-start gap-2.5 text-[14px]" style={{ ...BODY, color: INK_DEEP }}>
          <span aria-hidden className="shrink-0 w-[18px] h-[18px] flex items-center justify-center mt-0.5 rounded-full" style={{ background: "rgba(21,128,61,0.14)" }}>
            <Check className="w-2.5 h-2.5" style={{ color: "#15803D" }} />
          </span>
          {ne}
        </span>
      </div>
      {/* Manuell — Nachteil */}
      <div style={{ padding: "13px 20px", background: "rgba(185,28,28,0.04)", borderTop: `1px solid ${HAIRLINE}` }}>
        <span
          className="block"
          style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(23,23,23,0.68)", marginBottom: "6px" }}
        >
          {altLabel}
        </span>
        <span className="flex items-start gap-2.5 text-[14px]" style={{ ...BODY, color: BODY_MUTED }}>
          <span aria-hidden className="shrink-0 w-[18px] h-[18px] flex items-center justify-center mt-0.5 rounded-full" style={{ background: "rgba(185,28,28,0.1)" }}>
            <X className="w-2.5 h-2.5" style={{ color: "#B91C1C" }} />
          </span>
          {ma}
        </span>
      </div>
    </div>
  </div>
);

/** Mobile-Vergleich als Akkordeon (self-contained Open-State, erste Kategorie offen). */
const CompareAccordionMobile = ({
  rows,
  headNewEdge,
  altLabel,
}: {
  rows: readonly (readonly [string, string, string])[];
  headNewEdge: string;
  altLabel: string;
}) => {
  const [open, setOpen] = useState(0);
  return (
    <div className="md:hidden flex flex-col gap-3">
      {rows.map(([k, ne, ma], i) => (
        <CompareAccordionItem
          key={i}
          k={k}
          ne={ne}
          ma={ma}
          headNewEdge={headNewEdge}
          altLabel={altLabel}
          open={open === i}
          onToggle={() => setOpen(open === i ? -1 : i)}
        />
      ))}
    </div>
  );
};

/* ────────────── Reveal ────────────── */

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(PREFERS_REDUCED_MOTION);
  useEffect(() => {
    if (PREFERS_REDUCED_MOTION) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: PREFERS_REDUCED_MOTION
          ? "none"
          : `opacity 0.4s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.4s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};


/* ────────────── PAGE ────────────── */

const PainPointAuswahlverfahren = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const painPointPage = useLocalized("pain-point-page", PPP_STATIC, painPointPageEn);
  const { map: painPoints, defaultPainPoint } = usePainPoints();

  // Slug-basiertes Content-Lookup. Routen:
  //   /loesungen/:slug
  //   /leistungen/pain-points/:slug
  //   /leistungen/industrien/:slug
  const { slug } = useParams<{ slug: string }>();
  // Ohne Slug (feste Route /loesungen/entscheidungen-fallpruefung) gilt der
  // Default. MIT unbekanntem Slug gilt er ausdrücklich NICHT: Früher lieferte
  // /industrien/irgendwas stillschweigend die Default-Seite aus — falscher
  // Inhalt unter richtiger URL, für Besucher wie für Crawler nicht erkennbar.
  // Das ist schlimmer als ein 404, deshalb unten `notFound`.
  const gefunden = useMemo(
    () => (slug ? painPoints[slug] : defaultPainPoint),
    [slug, painPoints, defaultPainPoint]
  );
  const notFound = Boolean(slug) && !gefunden;
  // Bleibt definiert, damit die Hooks darunter unverändert laufen (Hooks dürfen
  // nicht bedingt aufgerufen werden). Gerendert wird der Default in diesem Fall
  // nicht — der frühe Ausstieg unten greift vorher.
  const content = gefunden ?? defaultPainPoint;

  const compareRows = useMemo(
    () => content.compare.rows.map((r) => [r.k, r.ne, r.alt] as const),
    [content]
  );

  // Ergebnis-Modul (Bild + Stationen) — statischer Lookup über den kanonischen Slug,
  // bewusst NICHT Teil von PainPointContent (CMS-Rows würden die Felder verdrängen).
  // Sprachwahl über `useLocalizedStatic` (nicht `useLocalized`): `resultJourneys`
  // ist eine Map slug→Journey, kein Single-Type — hinter `/api/result-journey`
  // liegt nichts, was ein CMS-Lookup laden könnte. `useLocalizedStatic` wählt
  // genau das, was hier gebraucht wird: die sprachrichtige Map, dann Slug-Lookup.
  const resultJourneys = useLocalizedStatic(RJ_STATIC, resultJourneysEn);
  const journey = resultJourneys[content.slug];
  // Icons pro Feature-Bullet, gleiche Lookup-Logik
  const bulletIcons = featureBulletIcons[content.slug];

  // Karten-Icons: neues Board-Icon-Set (Tabler) statt der früheren Bild-Icons,
  // index-aligned über den Slug (featureCardIcons.ts), Fallback IconCheck.
  const cardIcons = featureCardIcons[content.slug];
  const featureCards = content.featureCards.cards.map((c, i) => ({
    icon: cardIcons?.[i] ?? IconCheck,
    title: c.title,
    desc: c.desc,
  }));

  // Bilder für die Mini-Case-Übersicht — 1:1 zu den 3 Phasen (seiteneigen, sonst Chrome-Fallback)
  const caseImages = [
    img(content.feature1.image ?? painPointPage.images.feature1),
    img(content.feature2.image ?? painPointPage.images.feature2),
    img(content.feature3.image ?? painPointPage.images.feature3),
  ];

  const faqs = content.faq;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howToJsonLd = content.howTo
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: content.howTo.name,
        description: content.howTo.description,
        totalTime: content.howTo.totalTime,
        step: content.howTo.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
        })),
      }
    : null;

  // Unbekannter Slug → echte 404-Seite statt stillschweigend falschem Inhalt.
  // Steht bewusst NACH allen Hooks: React verlangt eine konstante Hook-Reihenfolge.
  if (notFound) return <NotFound />;

  return (
    <>
      <SEOHead
        title={content.seo.title}
        description={content.seo.description}
        canonical={content.seo.canonical}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        {howToJsonLd && (
          <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
        )}
      </Helmet>


      <div className="min-h-screen" style={{ fontFamily: OUTFIT, overflowX: "clip", background: PAPER }}>


        {/* ═══════════════════════════════════════════
            HERO — Silicon-Valley-Look in der Canvas-Sprache
            der Homepage: große abgerundete Ink-Bühne auf
            Papier, zentrierter Pitch, Produkt-Screenshot als
            schwebendes App-Fenster mit Overhang auf's Papier.
        ═══════════════════════════════════════════ */}
        <section className="relative" style={{ background: PAPER }}>
          <MobileNavigation onContactClick={() => {}} theme="dark" />

          <div className="mx-auto" style={{ maxWidth: "1720px", padding: "clamp(72px, 9vh, 96px) clamp(12px, 1.5vw, 24px) 0" }}>
            {/* Helle Papier-Bühne — Radius wie die Hero-Bühne der Homepage, sanfter Violett-Glow */}
            <div
              className="relative"
              style={{
                borderRadius: "40px",
                background: PAPER,
                paddingBottom: "clamp(72px, 10vh, 120px)",
              }}
            >
              {/* Sanfter Violett-Glow, im Canvas geclippt */}
              <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: "40px" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 75% 55% at 50% 0%, rgba(204,255,0,0.14) 0%, transparent 60%)" }} />
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 45% at 50% 110%, rgba(204,255,0,0.06) 0%, transparent 65%)" }} />
              </div>

              <div className="relative z-10 max-w-[880px] mx-auto px-6 lg:px-8 text-center" style={{ paddingTop: "clamp(72px, 10vh, 120px)" }}>
                <Reveal delay={0.06}>
                  <h1
                    style={{ color: INK_DEEP }}
                  >
                    {content.hero.h1Line1}<br />
                    <span className="edge-mark">{content.hero.h1Line2Highlighted}</span>
                  </h1>
                </Reveal>

                <Reveal delay={0.12}>
                  <p className="mb-9 max-w-[560px] mx-auto" style={{ ...BODY, color: "#3C3C3C" }}>
                    {content.hero.sub}
                  </p>
                </Reveal>

                <Reveal delay={0.18}>
                  <div className="flex items-center justify-center gap-x-7 gap-y-4 flex-wrap">
                    <EdgePillButton to="/kontakt">{content.hero.ctaPrimary}</EdgePillButton>
                    {SHOW_MINI_CASES && (
                      <EdgeTextButton href="#cases">{content.hero.ctaSecondary}</EdgeTextButton>
                    )}
                  </div>
                </Reveal>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════
            CONTENT — Light theme (Papier-Grundton)
        ═══════════════════════════════════════════ */}
        <div style={{ background: PAPER, color: INK_DEEP }}>

          {/* ERGEBNIS-STATIONEN — direkt nach Hero/Logo-Leiste, ohne Bild.
              Was sich im Geschäftsalltag des Kunden ändert. Desktop: horizontaler
              Zeitstrahl; Mobile: vertikale Liste. Badges im neuen Board-Stil:
              schwarzes Badge, Lime-Icon (Tabler), Nummer als kleiner Lime-Punkt. */}
          {journey && (
            <Reveal>
              <section id="ergebnis" className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-16 md:pt-20">
                <SectionHeadline className="md:max-w-[75%] !mb-10">
                  {journey.title}
                </SectionHeadline>
                <ol className="relative list-none p-0 m-0 flex flex-col md:flex-row gap-8 md:gap-6">
                  {/* Verbindungslinie — Mobile: vertikal links, Desktop: horizontal auf Badge-Höhe */}
                  <span
                    aria-hidden
                    className="md:hidden absolute w-px"
                    style={{ left: "25px", top: "26px", bottom: "48px", background: "rgba(23,23,23,0.14)" }}
                  />
                  <span
                    aria-hidden
                    className="hidden md:block absolute h-px"
                    style={{ top: "25px", left: "52px", right: "52px", background: "rgba(23,23,23,0.14)" }}
                  />
                  {journey.steps.map((step, i) => (
                    <li key={i} className="relative flex md:flex-col items-start gap-5 md:gap-4 md:flex-1">
                      <EdgeIconBadge icon={step.icon} size="lg" number={i + 1} className="z-10" style={{ fontFamily: OUTFIT }} />
                      <p
                        className="m-0 text-[15px] leading-[1.55] md:pr-2"
                        style={{ fontFamily: OUTFIT, fontWeight: 600, color: INK_DEEP }}
                      >
                        {step.text}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>
          )}

          {/* DEFINITION — Statement-Callout mit violetter Akzentkante, danach.
              Desktop: Text links (2/3), rechtes Drittel zeigt das Ergebnis-Motiv
              (journey.showcase) bzw. bis dahin den NEWEDGE-Charakter. */}
          <section id="definition" className="pt-16 md:pt-20 pb-0">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-x-12 lg:gap-x-16 gap-y-8 items-center">
                <div
                  className="relative order-2 md:order-1 md:col-span-2"
                  style={{ paddingLeft: "clamp(20px, 3vw, 28px)" }}
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full"
                    style={{ background: `linear-gradient(180deg, ${LIME}, ${LIME})` }}
                  />
                  <h2 style={{ color: INK_DEEP }}>
                    {content.definition.title}
                  </h2>
                  <p style={{ ...BODY, color: BODY_MUTED }}>
                    {content.definition.body}
                  </p>
                </div>
                {/* Bild-Slot rechts — Mobile-Reihenfolge: Bild → Überschrift → Text.
                    Zeigt das seitenspezifische Ergebnis-Motiv (journey.showcase);
                    solange keins registriert ist, den NEWEDGE-Charakter
                    (transparentes Freisteller-Motiv, daher ohne Karten-Rahmen). */}
                <div className="order-1 md:order-2">
                  {journey?.showcase.image ? (
                    <div
                      className="overflow-hidden"
                      style={{ borderRadius: "20px", border: `1px solid ${HAIRLINE}`, boxShadow: "0 24px 56px -18px rgba(23,23,23,0.22)" }}
                    >
                      <img
                        src={img(journey.showcase.image)}
                        alt={journey.showcase.imageAlt}
                        loading="lazy"
                        className="w-full h-auto block"
                      />
                    </div>
                  ) : (
                    <img
                      src={img("newedge-character-presenting")}
                      alt={painPointPage.characterAlt ?? PPP_STATIC.characterAlt}
                      loading="lazy"
                      className="block w-full h-auto max-w-[260px] md:max-w-[340px] mx-auto"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* FEATURE 01 — Bild links → H2 oben über Bild */}
          <Reveal>
            <div id="feature-01" className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-[clamp(56px,7vw,96px)] pb-[clamp(56px,7vw,96px)]">
              {/* Mobile-Reihenfolge: Bild → Überschrift → Text; Desktop: H2 volle Breite oben, Bild links | Text rechts */}
              <div className="grid md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-8 items-start">
                {/* Headline auf Modulbreite — bricht erst bei 3/4 um, nicht an der Spaltengrenze */}
                <SectionHeadline className="md:max-w-[75%] !mb-0 order-2 md:order-1 md:col-span-2">
                  {content.feature1.h2}
                </SectionHeadline>
                <div className="flex flex-col order-1 md:order-2">
                  <div className="relative w-full max-w-[440px] mx-auto mt-4">
                    {/* Versetzter Outline-Rahmen + Edge-Riss — Marken-Detail, bewusst nur an diesem Bild */}
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: "-12px -12px 12px 12px",
                        border: "1.5px solid rgba(204,255,0,0.45)",
                        borderRadius: "64px 16px 64px 16px",
                        transform: "rotate(-2deg)",
                        pointerEvents: "none",
                      }}
                    />
                    <div style={{ position: "relative", overflow: "hidden", borderRadius: "64px 16px 64px 16px" }}>
                      <img
                        src={img(content.feature1.image ?? painPointPage.images.feature1)}
                        alt={content.feature1.imageAlt}
                        loading="lazy"
                        className="w-full h-auto block"
                      />
                      <EdgeRip style={{ top: "-1px", right: "22%", width: "30px", height: "72px", zIndex: 2 }} />
                    </div>
                  </div>
                </div>
                <div className="order-3">
                  <SectionSub>{content.feature1.sub}</SectionSub>
                  <BulletList items={[...content.feature1.bullets]} icons={bulletIcons?.feature1} />
                </div>
              </div>
            </div>
          </Reveal>

          {/* FEATURE 02 (flipped) — Bild rechts → H2 oben links über Text */}
           <div id="feature-02" style={{ background: PAPER, borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}>
            <Reveal>
              <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-[clamp(56px,7vw,96px)]">
                {/* Mobile: Bild → Überschrift → Text; Desktop: H2 volle Breite oben, Text links | Bild rechts */}
                <div className="grid md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-8 items-start">
                  {/* Headline auf Modulbreite — bricht erst bei 3/4 um */}
                  <SectionHeadline className="md:max-w-[75%] !mb-0 order-2 md:order-1 md:col-span-2">
                    {content.feature2.h2}
                  </SectionHeadline>
                  <div className="order-3 md:order-2">
                    <SectionSub>{content.feature2.sub}</SectionSub>
                    <BulletList items={[...content.feature2.bullets]} icons={bulletIcons?.feature2} />
                    {/* Farbloser CTA → Kontaktseite (Muster wie die übrigen Text-CTAs der Seite) */}
                    <div style={{ marginTop: "28px" }}>
                      <EdgeTextButton to="/kontakt">{content.hero.ctaPrimary}</EdgeTextButton>
                    </div>
                  </div>
                  <div className="order-1 md:order-3 flex flex-col">
                    <div
                      className="w-full max-w-[500px] mx-auto md:mt-[5.5rem] overflow-hidden"
                      style={{ borderRadius: "20px", background: "#FFFFFF", border: `1px solid ${HAIRLINE}`, boxShadow: "0 24px 56px -18px rgba(23,23,23,0.22)", padding: "10px" }}
                    >
                      <img
                        src={img(content.feature2.image ?? painPointPage.images.feature2)}
                        alt={content.feature2.imageAlt}
                        loading="lazy"
                        className="w-full h-auto block"
                        style={{ borderRadius: "12px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* FEATURE 03 — Bild links → H2 oben über Bild */}
          <Reveal>
            <div id="feature-03" className="max-w-[1200px] mx-auto px-6 lg:px-8 py-[clamp(56px,7vw,96px)]">
              {/* Mobile: Bild → Überschrift → Text; Desktop: H2 volle Breite oben, Bild links | Text rechts */}
              <div className="grid md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-8 items-start">
                {/* Headline auf Modulbreite — bricht erst bei 3/4 um */}
                <SectionHeadline className="md:max-w-[75%] !mb-0 order-2 md:order-1 md:col-span-2">
                  {content.feature3.h2}
                </SectionHeadline>
                <div className="flex flex-col order-1 md:order-2">
                  <div
                    className="w-full max-w-[500px] mx-auto mt-4 overflow-hidden"
                    style={{ borderRadius: "20px", background: "#FFFFFF", border: `1px solid ${HAIRLINE}`, boxShadow: "0 24px 56px -18px rgba(23,23,23,0.22)", padding: "10px" }}
                  >
                    <img
                      src={img(content.feature3.image ?? painPointPage.images.feature3)}
                      alt={content.feature3.imageAlt}
                      loading="lazy"
                      className="w-full h-auto block"
                      style={{ borderRadius: "12px" }}
                    />
                  </div>
                </div>
                <div className="order-3">
                  <SectionSub>{content.feature3.sub}</SectionSub>
                  <BulletList items={[...content.feature3.bullets]} icons={bulletIcons?.feature3} />
                </div>
              </div>
            </div>
          </Reveal>

          {/* INTEGRATIONS */}
          <div id="integrations" style={{ background: PAPER, borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}>
            <Reveal>
              <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-[clamp(56px,7vw,96px)]">
                {/* Headline in Modul-Größe — kongruent zu den übrigen Sektionen */}
                {content.integrations.h3 && (
                  <SectionHeadline className="md:max-w-[75%] !mb-5">
                    {content.integrations.h3}
                  </SectionHeadline>
                )}
                <SectionSub>{content.integrations.sub}</SectionSub>
                <div className="mt-10" style={{ '--fade-color': PAPER } as React.CSSProperties}>
                  <Logos3
                    heading=""
                    className="mb-8"
                    logos={(content.integrations.logos ?? []).map((logo) => ({
                      id: logo.id,
                      description: logo.label,
                      image: logo.src,
                      className: logo.className ?? "h-7 w-auto",
                    }))}
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* COMPARISON TABLE */}
          <Reveal>
            <div id="comparison" className="max-w-[1200px] mx-auto px-6 lg:px-8 py-[clamp(56px,7vw,96px)]">
              <SectionHeadline className="!mb-10">
                {content.compare.h2}
              </SectionHeadline>

              {/* Desktop table */}
              <div
                className="hidden md:block overflow-hidden"
                style={{ borderRadius: "16px", border: `1px solid ${HAIRLINE}`, background: "#FFFFFF", boxShadow: CARD_SHADOW }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th
                          className="text-left p-5 text-[12px] font-semibold uppercase tracking-[0.05em] w-[26%]"
                          style={{ fontFamily: OUTFIT, background: "#FFFFFF", color: "rgba(23,23,23,0.68)", borderBottom: `1px solid ${HAIRLINE}` }}
                        >
                          {painPointPage.compare.headCriterion}
                        </th>
                        <th
                          className="text-left p-5 text-[14px] w-[37%]"
                          style={{
                            ...HEAD,
                            background: "rgba(204,255,0,0.14)",
                            color: INK_DEEP,
                            borderBottom: `1px solid ${HAIRLINE}`,
                            borderLeft: `1px solid ${HAIRLINE}`,
                          }}
                        >
                          {painPointPage.compare.headNewEdge}
                        </th>
                        <th
                          className="text-left p-5 text-[14px] w-[37%]"
                          style={{
                            ...HEAD,
                            background: "rgba(185,28,28,0.06)",
                            color: "#B91C1C",
                            borderBottom: `1px solid ${HAIRLINE}`,
                            borderLeft: `1px solid ${HAIRLINE}`,
                          }}
                        >
                          {content.compare.altLabel}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {compareRows.map(([k, ne, ma], i) => (
                        <tr key={i} style={{ background: i % 2 ? "#FFFFFF" : "rgba(23,23,23,0.06)" }}>
                          <td
                            className="p-4 text-[14px] font-medium"
                            style={{
                              fontFamily: OUTFIT,
                              color: INK,
                              borderBottom: i === compareRows.length - 1 ? "none" : "1px solid rgba(23,23,23,0.06)",
                            }}
                          >
                            {k}
                          </td>
                          <td
                            className="p-4 text-[14px]"
                            style={{
                              ...BODY,
                              color: INK_DEEP,
                              borderLeft: "1px solid rgba(23,23,23,0.06)",
                              borderBottom: i === compareRows.length - 1 ? "none" : "1px solid rgba(23,23,23,0.06)",
                            }}
                          >
                            <span className="flex items-start gap-2.5">
                              <span aria-hidden className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5 rounded-full" style={{ background: "rgba(21,128,61,0.14)" }}>
                                <Check className="w-3 h-3" style={{ color: "#15803D" }} />
                              </span>
                              {ne}
                            </span>
                          </td>
                          <td
                            className="p-4 text-[14px]"
                            style={{
                              ...BODY,
                              color: BODY_MUTED,
                              borderLeft: "1px solid rgba(23,23,23,0.06)",
                              borderBottom: i === compareRows.length - 1 ? "none" : "1px solid rgba(23,23,23,0.06)",
                            }}
                          >
                            <span className="flex items-start gap-2.5">
                              <span aria-hidden className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5 rounded-full" style={{ background: "rgba(185,28,28,0.1)" }}>
                                <X className="w-3 h-3" style={{ color: "#B91C1C" }} />
                              </span>
                              {ma}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile: Akkordeon — Kategorie antippen, Vor-/Nachteil klappen auf */}
              <CompareAccordionMobile
                rows={compareRows}
                headNewEdge={painPointPage.compare.headNewEdge}
                altLabel={content.compare.altLabel}
              />

              {/* Peak-Intent-CTA direkt nach dem direkten Vergleich — bewusst farblos (Text-Stil) */}
              <div className="flex justify-center mt-[clamp(40px,5vw,60px)]">
                <EdgeTextButton to="/kontakt">{content.hero.ctaPrimary}</EdgeTextButton>
              </div>
            </div>
          </Reveal>

          {/* FEATURE CARDS */}
          <div id="features" style={{ background: PAPER, borderTop: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}>
            <Reveal>
              <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-[clamp(56px,7vw,96px)]">
                <div className="text-center max-w-[700px] mx-auto mb-12">
                  <SectionHeadline className="!mb-0">
                    {content.featureCards.h2}
                  </SectionHeadline>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {featureCards.map((c) => (
                    <div
                      key={c.title}
                      className="group relative overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(23,23,23,0.06)]"
                      style={{
                        background: "#FFFFFF",
                        borderRadius: "16px",
                        border: `1px solid ${HAIRLINE}`,
                        boxShadow: CARD_SHADOW,
                      }}
                    >
                      {/* Icon-Badge im Board-Stil (Ink-Badge, Lime-Icon), größer & zentriert */}
                      <div className="flex justify-center mb-5">
                        <EdgeIconBadge icon={c.icon} size="lg" />
                      </div>
                      <h3 style={{ color: INK_DEEP }}>
                        {c.title}
                      </h3>
                      <p style={{ ...BODY, color: BODY_MUTED }}>
                        {c.desc}
                      </p>
                      {/* Bottom accent line on hover */}
                      <span
                        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-300"
                        style={{ background: LIME }}
                        aria-hidden
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* DATENSOUVERÄNITÄT — dunkler „Security"-Moment auf einer Ink-Karte */}
          <Reveal>
            <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-[clamp(56px,7vw,96px)]">
              <div
                className="relative overflow-hidden grid md:grid-cols-[1fr_1.1fr] gap-x-14 gap-y-10"
                style={{
                  borderRadius: "24px",
                  background: INK_GRADIENT,
                  border: "1px solid rgba(204,255,0,0.22)",
                  padding: "clamp(32px, 5vw, 64px)",
                }}
              >
                <div aria-hidden style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: "radial-gradient(ellipse 60% 55% at 100% 0%, rgba(204,255,0,0.22) 0%, transparent 60%)",
                }} />
                {/* Statement */}
                <div className="relative z-10">
                  <h2 style={{ color: "#fff" }}>
                    {painPointPage.datensouveraenitaet.heading}
                  </h2>
                  <p style={{ ...BODY, color: "rgba(255,255,255,0.68)", maxWidth: "48ch" }}>
                    {painPointPage.datensouveraenitaet.body}
                  </p>
                </div>
                {/* Fakten + Schema */}
                <div className="relative z-10">
                  <ul className="m-0 p-0 mb-8" style={{ listStyle: "none" }}>
                    {painPointPage.datensouveraenitaet.facts.map((f) => (
                      <li key={f} className="flex items-start gap-3 py-2" style={{ ...BODY, fontSize: "14.5px", lineHeight: 1.6, color: "rgba(255,255,255,0.92)" }}>
                        <span
                          aria-hidden
                          className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5 rounded-full"
                          style={{ background: "rgba(204,255,0,0.22)" }}
                        >
                          <Check className="w-3 h-3" style={{ color: LIME }} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {/* Schema: Daten bleiben im Haus — Dark-Variante */}
                  <svg viewBox="0 0 420 120" aria-label={painPointPage.datensouveraenitaet.schema.ariaLabel} style={{ width: "100%", maxWidth: "420px", height: "auto", display: "block" }}>
                    <rect x="8" y="8" width="244" height="104" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                    <text x="22" y="30" style={{ fontFamily: OUTFIT, fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", fill: "rgba(255,255,255,0.45)" }}>{painPointPage.datensouveraenitaet.schema.infrastruktur}</text>
                    <rect x="22" y="44" width="100" height="32" rx="8" fill="rgba(204,255,0,0.14)" stroke={LIME} strokeWidth="1" />
                    <text x="72" y="64" textAnchor="middle" style={{ fontFamily: OUTFIT, fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", fill: LIME }}>{painPointPage.datensouveraenitaet.schema.ihreDaten}</text>
                    <rect x="138" y="44" width="100" height="32" rx="8" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
                    <text x="188" y="64" textAnchor="middle" style={{ fontFamily: OUTFIT, fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", fill: "rgba(255,255,255,0.92)" }}>{painPointPage.datensouveraenitaet.schema.kiAgent}</text>
                    <line x1="122" y1="60" x2="138" y2="60" stroke={LIME} strokeWidth="1" />
                    <line x1="252" y1="60" x2="330" y2="60" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="334" y="64" style={{ fontFamily: OUTFIT, fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", fill: "rgba(255,255,255,0.45)" }}>{painPointPage.datensouveraenitaet.schema.extern}</text>
                  </svg>
                </div>
              </div>
              {/* CTA unter der Datensouveränität-Karte (nicht in der Karte) — bewusst farblos (Text-Stil) */}
              <div className="flex justify-center mt-[clamp(32px,4vw,48px)]">
                <EdgeTextButton to="/kontakt">{content.hero.ctaPrimary}</EdgeTextButton>
              </div>
            </div>
          </Reveal>

          {/* TESTIMONIAL HERO */}
          <div id="testimonial" className="py-[clamp(56px,7vw,96px)]">
            <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-center">
              <div className="text-[4.5rem] leading-[0.6] mb-6" style={{ fontFamily: OUTFIT, fontWeight: 800, color: "rgba(23,23,23,0.22)" }}>
                „
              </div>
              <p
                className="mb-8"
                style={{ fontFamily: OUTFIT, fontWeight: 600, letterSpacing: "-0.01em", color: INK_DEEP }}
              >
                {content.testimonialHero.quote}
              </p>
              <div className="flex items-center justify-center gap-2.5 text-[0.85rem]" style={{ ...BODY, color: "rgba(23,23,23,0.68)" }}>
                <span className="block h-px w-10" style={{ background: "rgba(23,23,23,0.14)" }} />
                {content.testimonialHero.author}
                <span className="block h-px w-10" style={{ background: "rgba(23,23,23,0.14)" }} />
              </div>
            </div>
          </div>

          {/* „Was die KI über uns sagt" — globaler Ersatz für das Testimonial-Grid (Homepage-Modul) */}
          <AiVoicesSection />

          {/* „NEWEDGE in Aktion" — Video-Showcase (Homepage-Modul), direkt danach */}
          <VideoShowcaseSection />

          {/* MINI-CASES — eine Detailseite pro Phase (illustrativ). Vor den FAQs. */}
          {SHOW_MINI_CASES && content.miniCases && content.miniCases.length > 0 && (
            <Reveal>
              <div id="cases" style={{ background: PAPER, borderTop: `1px solid ${HAIRLINE}` }}>
                <div className="py-[clamp(56px,7vw,96px)]">
                  <div className="text-center max-w-[700px] mx-auto mb-12 px-6 lg:px-8">
                    <SectionHeadline>{painPointPage.miniCases.headline}</SectionHeadline>
                    <p style={{ fontFamily: OUTFIT, fontWeight: 500, color: INK }}>
                      {painPointPage.miniCases.sub}
                    </p>
                  </div>

                  {/* Case-Karten — Inhalt immer sichtbar (kein Hover-only), Hover = Lift + Bild-Zoom */}
                  <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {content.miniCases.map((c, i) => (
                      <Link
                        key={c.id}
                        to={`case/${c.id}`}
                        className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_44px_-12px_rgba(23,23,23,0.14)]"
                        style={{
                          borderRadius: "20px",
                          background: "#FFFFFF",
                          border: `1px solid ${HAIRLINE}`,
                          boxShadow: CARD_SHADOW,
                        }}
                      >
                        <div className="relative overflow-hidden aspect-[16/10]">
                          <img
                            src={c.image ? img(c.image.src) : caseImages[i % caseImages.length]}
                            alt={c.image?.alt ?? c.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.04]"
                          />
                          {(c.industries?.length || c.badge) && (
                            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[85%]">
                              {(c.industries?.length ? c.industries.slice(0, 3) : [c.badge]).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-block text-[10.5px] font-semibold uppercase tracking-[0.04em] px-2.5 py-1"
                                  style={{
                                    fontFamily: OUTFIT,
                                    color: "#fff",
                                    background: "rgba(23,23,23,0.68)",
                                    backdropFilter: "blur(6px)",
                                    border: "1px solid rgba(204,255,0,0.45)",
                                    borderRadius: "999px",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 p-5">
                          <span
                            className="text-[11px] font-semibold uppercase tracking-[0.05em] mb-2"
                            style={{ fontFamily: OUTFIT, color: INK_DEEP }}
                          >
                            {c.phaseLabel}
                          </span>
                          <h3
                            className="text-[18px] md:text-[19px]"
                            style={{ color: INK_DEEP, lineHeight: 1.25 }}
                          >
                            {c.title}
                          </h3>
                          <p className="mb-4 flex-1 text-[14px]" style={{ ...BODY, color: BODY_MUTED, lineHeight: 1.55 }}>
                            {c.teaser}
                          </p>
                          <span
                            className="inline-flex items-center gap-2 text-[13px] font-semibold group-hover:gap-3 transition-all"
                            style={{ fontFamily: OUTFIT, color: INK_DEEP }}
                          >
                            {painPointPage.miniCases.cta}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* FAQ */}
          <Reveal>
            <div id="faq" className="max-w-[1200px] mx-auto px-6 lg:px-8 py-[clamp(56px,7vw,96px)]">
              <div className="grid md:grid-cols-[1fr,1.5fr] gap-8 md:gap-16 items-start">
                <div>
                  <h3
                    className="mb-5 md:mb-6 max-md:text-[19px]"
                    style={{ color: INK_DEEP }}
                  >
                    {painPointPage.faq.headingLine1}<br />
                    <span className="edge-mark">{painPointPage.faq.headingLine2}</span>
                  </h3>
                  {/* CTA → Kontaktseite (kein Calendly mehr) */}
                  <EdgePillButton to="/kontakt">{painPointPage.faq.cta}</EdgePillButton>
                </div>
                <div className="flex flex-col gap-3">
                  {faqs.map((f, i) => (
                    <FAQItem key={i} q={f.q} a={f.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── CTA — geteilte Komponente (auch auf Über uns + Methodik im Einsatz) ── */}
          <SpeakWithUsCta
            eyebrow={painPointPage.cta.eyebrow}
            headingLine1={painPointPage.cta.headingLine1}
            headingLine2={painPointPage.cta.headingLine2}
            phoneHref={painPointPage.cta.phone.href}
            phoneLabel={painPointPage.cta.phone.label}
          />

        </div>
        {/* ── /LIGHT THEME ── */}

        <Suspense fallback={<div className="min-h-[200px]" />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default PainPointAuswahlverfahren;
