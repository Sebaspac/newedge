import { motion, useReducedMotion } from "framer-motion";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { EdgePillButton, EdgeTextButton } from "@/components/ui/EdgeCta";
import { EdgeRip } from "@/components/ui/EdgeRip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { hero as HERO_STATIC } from "@/content/sections/hero";
import { hero as heroEn } from "@/content/en/sections/hero";
import { img } from "@/content";
import { useHomeSection } from "@/hooks/useHomeContent";

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const PAPER = "#F2F2F2";
const R = 40; // Eck-Radius der Video-Canvas
/** Radius der einen freien Panel-Ecke (oben rechts) — dort hebt sich das Papier großzügig ins Video. */
const PANEL_R = 88;

/** Feine Papier-Körnung (SVG-Noise) — gibt dem Panel taktile, editoriale Materialität. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Schatten am Papier-Schnitt: crisp Hairline + weicher Cast an Ober-/Rechtskante
    (Video wirkt vertieft) + 1px Kantenlicht oben (Papier-Bevel). */
const PANEL_SHADOW = [
  "inset 0 1.5px 0 rgba(255,255,255,0.68)",
  "0 -12px 44px -22px rgba(23,23,23,0.45)",
  "16px 0 44px -22px rgba(23,23,23,0.45)",
  "0 0 22px -10px rgba(23,23,23,0.22)",
].join(", ");

/** Ambient laufendes YouTube-Video als Canvas-Hintergrund (stumm, geloopt, ohne Controls). */
const AmbientVideo = ({ youtubeId, title }: { youtubeId: string; title: string }) => (
  <iframe
    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3`}
    title={title}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      // 16:9-Fläche, die die Canvas garantiert abdeckt (Canvas ist breiter als 16:9)
      width: "max(100%, 178vh)",
      aspectRatio: "16 / 9",
      transform: "translate(-50%, -50%)",
      border: "none",
      pointerEvents: "none",
    }}
  />
);

/**
 * Hero: das Video IST die Bühne — großes abgerundetes Video-Canvas mit gerader
 * Oberkante (Motiv voll sichtbar). Unten links ist EIN Papier-Panel in die Canvas
 * geschnitten (gleiche Paper-Farbe, bündig an linker + unterer Kante — keine
 * schwebende Card). Greeting + Headline + CTA sitzen darin; die eine freie Ecke
 * oben rechts hebt sich mit großzügiger Rundung ins Video.
 */
export const HeroSection = () => {
  useLanguage();
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  // Inhalte live aus dem CMS (Strapi „Home"); Fallback: statischer Content-Layer
  const hero = useHomeSection("hero", HERO_STATIC, heroEn);

  const greeting = (
    <p
      className="flex items-center gap-2"
      style={{ fontFamily: OUTFIT, fontWeight: 500, fontSize: "14px", color: INK_DEEP, marginBottom: "14px" }}
    >
      {/* „Live"-Dot: violetter Kern + sanfter Puls-Ring (passt zum Video-Charakter der Marke) */}
      <span aria-hidden style={{ position: "relative", width: "8px", height: "8px", flexShrink: 0 }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: LIME }} />
        {!reduced && (
          <motion.span
            style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${LIME}` }}
            animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </span>
      {hero.greeting} <span aria-hidden>👋</span>
    </p>
  );

  // Kompositum-Bindestriche nicht umbrechen (aus „KI-Abteilung" nie „KI-" / „Abteilung").
  const nbHyphen = (s: string) => s.replace(/-/g, "‑");
  const headline = (
    <h1
      style={{
        color: INK_DEEP,
        textWrap: "balance",
      }}
    >
      {nbHyphen(hero.headline.line1)} <span className="edge-mark">{nbHyphen(hero.headline.line2)}</span>
    </h1>
  );

  const ctas = (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
      <EdgePillButton href="/ki-audit">{hero.primaryCta.label}</EdgePillButton>
      <EdgeTextButton to="/kontakt">{hero.secondaryCta.label}</EdgeTextButton>
    </div>
  );

  /* ── Mobile: gestapelt, ohne Cutout-Geometrie ── */
  if (isMobile) {
    return (
      <section
        id="hero"
        className="relative w-full"
        style={{ background: PAPER, paddingTop: "clamp(96px, 14vh, 130px)", paddingBottom: "32px" }}
      >
        <div className="px-5">
          {greeting}
          {headline}
          <div style={{ marginTop: "24px", marginBottom: "28px" }}>{ctas}</div>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 10",
              borderRadius: "24px",
              overflow: "hidden",
              background: "#101010",
            }}
          >
            <AmbientVideo youtubeId={hero.video.youtubeId} title={hero.video.title} />
          </div>
        </div>
      </section>
    );
  }

  /* ── Desktop: Video-Canvas mit EINEM Papier-Panel unten links ──
     Video oben mit gerader Kante (voll sichtbar, Gesichter nicht verdeckt);
     das Panel (Greeting + Headline + CTA) ist bündig in die untere linke Ecke
     geschnitten, seine freie Ecke oben rechts hebt sich großzügig ins Video. */
  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
      >
        {hero.skipLink}
      </a>

      <section
        id="hero"
        className="relative w-full"
        style={{ background: PAPER, paddingTop: "clamp(100px, 13vh, 132px)", paddingBottom: "24px" }}
      >
        {/* Wellen-Schnittkante des Papier-Panels (responsiv via objectBoundingBox) */}
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden focusable="false">
          <defs>
            <clipPath id="heroPanelWave" clipPathUnits="objectBoundingBox">
              <path d="M0,0 L0.80,0 C0.86,0 0.865,0.07 0.865,0.16 L0.865,0.84 C0.865,0.93 0.845,0.975 0.80,1 L0,1 Z" />
            </clipPath>
          </defs>
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto"
          style={{ maxWidth: "1720px", padding: "0 clamp(16px, 2vw, 40px)" }}
        >
          {/* Video-Canvas */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "min(80vh, 860px)",
              minHeight: "540px",
              borderRadius: `${R}px`,
              overflow: "hidden",
              background: "#101010",
            }}
          >
            <AmbientVideo youtubeId={hero.video.youtubeId} title={hero.video.title} />

            {/* Founder-Badge unten rechts — balanciert das Papier-Panel unten links.
                Beim Hover gleitet das Bild von links ans rechte Pill-Ende (Text rückt nach
                links), dazu blendet Violett als Sweep ein, Text wird weiß.
                Maße für die Slide-Distanzen: PadL 8 + Avatar 48 + Gap 14 | Text | PadR 26
                → Avatar-Ziel left = 100% − 56px, Text-Shift = −(70 − 26) = −44px. */}
            <Link
              to={hero.founderBadge.to}
              className="group absolute overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
              style={{
                bottom: "20px",
                right: "20px",
                zIndex: 3,
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                background: "#fff",
                borderRadius: "999px",
                padding: "8px 26px 8px 8px",
                boxShadow: "0 10px 34px rgba(23,23,23,0.35)",
              }}
            >
              {/* Violett-Sweep — blendet beim Hover von links nach rechts über die ganze Pill ein */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                style={{ background: LIME }}
              />
              {/* Platzhalter hält die Pill-Breite — der Avatar gleitet als Overlay darüber */}
              <span aria-hidden style={{ width: "48px", height: "48px", flexShrink: 0 }} />
              {/* Avatar — gleitet beim Hover von links ans rechte Pill-Ende */}
              <span
                className="absolute left-2 transition-[left] duration-300 ease-out group-hover:left-[calc(100%-56px)]"
                style={{
                  top: "8px",
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `2px solid ${LIME}`,
                  zIndex: 2,
                }}
              >
                <img
                  src={img(hero.founderBadge.image)}
                  alt={hero.founderBadge.imageAlt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "25% 20%", display: "block" }}
                  loading="lazy"
                />
              </span>
              {/* Text — rückt beim Hover nach links in die frei werdende Fläche */}
              <span className="relative transition-transform duration-300 ease-out group-hover:translate-x-[-44px]">
                {/* Ink im Ruhezustand, auf dem Violett-Sweep wird der Text weiß */}
                <span
                  className="block text-[#171717] transition-colors duration-300"
                  style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "14.5px", lineHeight: 1.25 }}
                >
                  {hero.founderBadge.title}
                </span>
                <span
                  className="block text-[#5E5E5A] transition-colors duration-300 group-hover:text-[#3C3C3C]"
                  style={{ fontFamily: OUTFIT, fontWeight: 400, fontSize: "12.5px", lineHeight: 1.3 }}
                >
                  {hero.founderBadge.subtitle}
                </span>
              </span>
            </Link>

            {/* ── EIN Papier-Panel: unten links in die Canvas geschnitten ──
                Bündig an linker + unterer Kante (bottom-left wird durch die
                Canvas-Rundung geklippt). Trifft das Video an Ober- + rechter
                Kante; die freie Ecke oben rechts hebt sich mit PANEL_R ins Video.
                Materialtiefe über Schatten + Grain, Inhalt tritt gestaffelt auf. */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                zIndex: 3,
                maxWidth: "min(64%, 900px)",
                background: PAPER,
                clipPath: "url(#heroPanelWave)",
                WebkitClipPath: "url(#heroPanelWave)",
                filter: "drop-shadow(14px 0 34px rgba(23,23,23,0.22)) drop-shadow(0 -10px 30px rgba(23,23,23,0.22))",
                willChange: "transform, opacity",
                padding:
                  "clamp(36px, 4.4vh, 52px) clamp(72px, 6.5vw, 108px) clamp(34px, 4vh, 48px) clamp(40px, 3.6vw, 60px)",
              }}
            >
              {/* Papier-Körnung */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: GRAIN,
                  backgroundSize: "120px 120px",
                  opacity: 0.05,
                  mixBlendMode: "multiply",
                  pointerEvents: "none",
                }}
              />
              {/* Gestaffelter Inhalt: Greeting → Headline → CTA */}
              <motion.div
                style={{ position: "relative" }}
                initial={reduced ? false : "hidden"}
                animate={reduced ? {} : "show"}
                variants={{ show: { transition: { staggerChildren: 0.11, delayChildren: 0.22 } } }}
              >
                {[greeting, headline, <div style={{ marginTop: "clamp(26px, 3vh, 36px)" }}>{ctas}</div>].map(
                  (child, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 18 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                      }}
                    >
                      {child}
                    </motion.div>
                  )
                )}
              </motion.div>
            </motion.div>

            {/* NEWEDGE-Edge: kleiner Marken-Riss an der geraden Panel-Schnittkante */}
            <EdgeRip style={{ left: "calc(min(64%, 900px) * 0.862 - 8px)", bottom: "16%", width: "18px", height: "72px", zIndex: 4 }} />
          </div>
        </motion.div>
      </section>
    </>
  );
};
