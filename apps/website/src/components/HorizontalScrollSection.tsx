import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import AnimatedTextCycle from "@/components/ui/animated-text-cycle";
import { EdgeTextButton } from "@/components/ui/EdgeCta";
import { useIsMobile } from "@/hooks/use-mobile";
import { img } from "@/content";
import { IconShieldCheck, IconStack2, IconTarget, type Icon as TablerIcon } from "@tabler/icons-react";
import { EdgeIconBadge } from "@/components/ui/EdgeIconBadge";

/* Pillar-Icons im Board-Badge-Stil — Content-Layer liefert weiterhin
   CMS-agnostische Namen ("Target", "Layers", "ShieldCheck"). */
const PILLAR_ICONS: Record<string, TablerIcon> = {
  Target: IconTarget,
  Layers: IconStack2,
  ShieldCheck: IconShieldCheck,
};
import { EdgeRip } from "@/components/ui/EdgeRip";
import { MitStudyGrid } from "@/components/ui/MitStudyGrid";
import { useLanguage } from "@/contexts/LanguageContext";
import { horizontalScroll as HS_STATIC } from "@/content/sections/horizontalScroll";
import { horizontalScroll as horizontalScrollEn } from "@/content/en/sections/horizontalScroll";
import { useHomeSection } from "@/hooks/useHomeContent";

gsap.registerPlugin(ScrollTrigger);

const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const INK      = "#3C3C3C";

const HEAD: React.CSSProperties = {
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontWeight: 700,
};
const BODY: React.CSSProperties = {
  fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontWeight: 400,
};

/* Gemeinsamer Papier-Hintergrund für BEIDE Panels — clean, ohne Spaltenraster */
const PANEL_BG = [
  "radial-gradient(ellipse 120% 80% at 60% 40%, rgba(204,255,0,0.06) 0%, transparent 60%)",
  "#F2F2F2",
].join(", ");

/* Weiße Feature-Karte — gleiche Optik wie die Ablauf-Cards des Rebrush */
const cardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: "16px",
  boxShadow: "0 1px 2px rgba(23,23,23,0.06)",
  padding: "18px 22px",
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
};

// ── Panel 1 — Process Roadmap ─────────────────────────────────────────────────
const ProcessPanel = () => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  // Inhalte live aus dem CMS (Strapi „Home"); Fallback: statischer Content-Layer
  const horizontalScroll = useHomeSection("horizontalScroll", HS_STATIC, horizontalScrollEn);
  return (
    <div
      style={{
        width: isMobile ? "100%" : "100vw",
        height: isMobile ? "auto" : "100dvh",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
        paddingTop: isMobile ? "clamp(56px, 9vw, 80px)" : "clamp(96px, 12vh, 124px)",
        paddingBottom: isMobile ? "clamp(40px, 8vw, 64px)" : "clamp(28px, 5vh, 52px)",
        background: PANEL_BG,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl"
        style={{ position: "relative", zIndex: 1, width: "100%" }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-10 items-center"
          style={{ width: "100%" }}
        >
          {/* LEFT (60%): MIT-Studie-Grafik (100 Kästchen, 5 beleuchtet, kompakt — gleiche Grafik wie auf /methodik) + heading + Grafik-Beschreibung */}
          <div>
            <div className="mx-auto" style={{ width: "min(100%, 300px)", marginBottom: "clamp(20px, 3.4vh, 34px)" }}>
              <MitStudyGrid lang={language} compact />
            </div>

            <h2
              style={{
                color: INK_DEEP,
              }}
            >
              {horizontalScroll.process.headingLead}{" "}
              <AnimatedTextCycle
                words={horizontalScroll.process.headingWords}
                interval={2800}
                renderWord={(word) => (
                  <span className="edge-mark">{word}</span>
                )}
              />
            </h2>

            <p
              style={{
                ...BODY,
                color: INK,
                maxWidth: "42ch",
                marginBottom: "20px",
              }}
            >
              {language === "en" ? (
                <>
                  Of 100 companies that adopt AI, only 5 achieve a measurable return according to the{" "}
                  <strong style={{ fontWeight: 700, color: INK_DEEP }}>MIT Study 2025</strong>.{" "}
                  <strong style={{ fontWeight: 700, color: INK_DEEP }}>We make sure you&rsquo;re one of them.</strong>
                </>
              ) : (
                <>
                  Von 100 Betrieben, die KI einführen, erzielen laut{" "}
                  <strong style={{ fontWeight: 700, color: INK_DEEP }}>MIT-Studie 2025</strong> nur 5 einen messbaren
                  Return. <strong style={{ fontWeight: 700, color: INK_DEEP }}>Wir sorgen dafür, dass Sie dazugehören.</strong>
                </>
              )}
            </p>

            <EdgeTextButton to="/methodik">Unsere Methodik</EdgeTextButton>
          </div>

          {/* RIGHT (40%): Schritte als weiße Karten mit Kreis-Badges + ↓-Verbinder */}
          <div className="flex flex-col">
            {horizontalScroll.process.steps.map(({ index, title, desc }, i, arr) => (
              <div key={title}>
                <div style={{ ...cardStyle, padding: "20px 22px" }}>
                  <span
                    style={{
                      ...HEAD,
                      fontSize: "13px",
                      color: INK_DEEP,
                      background: LIME,
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    {index}
                  </span>
                  <div>
                    <h3
                      style={{
                        color: INK_DEEP,
                        fontSize: "clamp(19px, 1.8vw, 22px)",
                        lineHeight: 1.3,
                        marginBottom: "6px",
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        ...BODY,
                        color: "rgba(23,23,23,0.68)",
                        fontSize: "16px",
                        lineHeight: 1.55,
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div aria-hidden style={{ display: "flex", justifyContent: "center", padding: "14px 0" }}>
                    <ArrowDown style={{ width: "20px", height: "20px", color: INK_DEEP, opacity: 0.45 }} strokeWidth={2.2} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Panel 2 — Value Pillars (title LEFT, pillars RIGHT) ───────────────────────
const PillarsPanel = () => {
  const isMobile = useIsMobile();
  // Inhalte live aus dem CMS (Strapi „Home"); Fallback: statischer Content-Layer
  const horizontalScroll = useHomeSection("horizontalScroll", HS_STATIC, horizontalScrollEn);
  return (
  <div
    style={{
      width: isMobile ? "100%" : "100vw",
      height: isMobile ? "auto" : "100dvh",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
      paddingTop: isMobile ? "clamp(56px, 9vw, 80px)" : "clamp(96px, 12vh, 124px)",
      paddingBottom: isMobile ? "clamp(40px, 8vw, 64px)" : "clamp(28px, 5vh, 52px)",
      background: PANEL_BG,
      overflow: "hidden",
      position: "relative",
    }}
  >
    <div
      className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl"
      style={{ width: "100%" }}
    >
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center"
        style={{ width: "100%" }}
      >
        {/* LEFT: Bild (edgy geschnittener Rahmen, gespiegelt) + heading + text */}
        <div className="lg:col-span-6 order-1">
          <div style={{ position: "relative", width: "min(100%, 400px)", marginBottom: "clamp(24px, 4vh, 40px)" }}>
            {/* Versetzter Outline-Rahmen hinter dem Bild (gespiegelte Rotation) */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: "-12px 12px 12px -12px",
                border: "1.5px solid rgba(204,255,0,0.45)",
                borderRadius: "16px 64px 16px 64px",
                transform: "rotate(2deg)",
                pointerEvents: "none",
              }}
            />
            <img
              src={img(horizontalScroll.pillarsPanel.image.src)}
              alt={horizontalScroll.pillarsPanel.image.alt}
              loading="lazy"
              style={{
                position: "relative",
                width: "100%",
                height: "clamp(180px, 24vh, 240px)",
                objectFit: "cover",
                borderRadius: "16px 64px 16px 64px",
                display: "block",
              }}
            />
            {/* Kleiner Riss von der Oberkante — die „Edge" der Marke */}
            <EdgeRip style={{ top: "-1px", left: "24%", width: "30px", height: "72px", zIndex: 2 }} />
          </div>

          <h2
            style={{
              color: INK_DEEP,
            }}
          >
            {horizontalScroll.pillarsPanel.headingLead}{" "}
            <AnimatedTextCycle
              words={horizontalScroll.pillarsPanel.headingWords}
              interval={2800}
              renderWord={(word) => (
                <span className="edge-mark">{word}</span>
              )}
            />
            <br />
            {horizontalScroll.pillarsPanel.headingTail}
          </h2>

          <p
            style={{
              ...BODY,
              color: INK,
              maxWidth: "40ch",
              marginBottom: "20px",
            }}
          >
            {horizontalScroll.pillarsPanel.body}
          </p>

          {/* „Über uns" vorerst ausgeblendet — Seite bleibt, nur der Link ist raus */}
        </div>

        {/* RIGHT: Pillars als weiße Karten mit Icon-Badges */}
        <div className="lg:col-span-6 order-2 flex flex-col" style={{ gap: "12px" }}>
          {horizontalScroll.pillarsPanel.pillars.map(({ icon, title, desc }) => (
            <div key={title} style={cardStyle}>
              <EdgeIconBadge icon={PILLAR_ICONS[icon] ?? IconTarget} size="md" style={{ marginTop: "2px" }} />
              <div>
                <h3
                  style={{
                    color: INK_DEEP,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    ...BODY,
                    color: "rgba(23,23,23,0.68)",
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────
export const HorizontalScrollSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const ctxRef     = useRef<gsap.Context | null>(null);
  const isMobile   = useIsMobile();

  useLayoutEffect(() => {
    // Mobile: kein horizontales Scroll-Jacking — die beiden Panels stapeln vertikal.
    if (isMobile) return;
    const raf = requestAnimationFrame(() => {
      const tid = setTimeout(() => {
        const section = sectionRef.current;
        const track   = trackRef.current;
        if (!section || !track) return;

        ctxRef.current = gsap.context(() => {
          const distance = () => -(track.scrollWidth - window.innerWidth);
          // Timeline mit Verweilzeit (Dwell) auf jedem Panel: erst Panel 1 halten
          // (Lesezeit), dann sanft zu Panel 2 gleiten, dann Panel 2 halten.
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              // Mehr Scroll-Distanz = mehr Zeit. Der Slide selbst + 1.9 Viewport-
              // Höhen an Dwell verteilt auf beide Panels.
              end: () =>
                `+=${(track.scrollWidth - window.innerWidth) + window.innerHeight * 1.9}`,
              scrub: 1.2,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          tl.to(track, { x: 0, duration: 0.55 })      // Dwell Panel 1 (Lesezeit)
            .to(track, { x: distance, duration: 1 })  // Übergang zu Panel 2
            .to(track, { x: distance, duration: 0.6 }); // Dwell Panel 2 (Lesezeit)
        }, section);
      }, 50);

      return () => clearTimeout(tid);
    });

    return () => {
      cancelAnimationFrame(raf);
      ctxRef.current?.revert();
    };
  }, [isMobile]);

  return (
    <div id="prozess" ref={sectionRef} style={{ overflow: "hidden" }}>
      <div
        ref={trackRef}
        style={{ display: "flex", flexDirection: isMobile ? "column" : "row", willChange: "transform" }}
      >
        <ProcessPanel />
        <PillarsPanel />
      </div>
    </div>
  );
};
