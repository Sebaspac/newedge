import { useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { FloatingConsultButton } from "@/components/ui/FloatingConsultButton";
import { threeStepsCTA as TSC_STATIC } from "@/content/sections/threeStepsCTA";
import { threeStepsCTA as threeStepsCTAEn } from "@/content/en/sections/threeStepsCTA";
import { useHomeSection } from "@/hooks/useHomeContent";

/* ── Design tokens ── */
const LIME = "#CCFF00";
const LIME_DARK = "#333A00";
const INK_DEEP = "#171717";

const HEAD: React.CSSProperties = { fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 700 };
const BODY: React.CSSProperties = { fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontWeight: 400 };
const L = { text: "#3C3C3C", textMuted: "#5E5E5A" };

/** OS-Einstellung „Bewegung reduzieren": Karten erscheinen dann ohne Einflug-Animation. */
const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const ThreeStepsCTA = () => {
  const isMobile = useIsMobile();

  // Inhalte live aus dem CMS (Strapi „Home"); Fallback: statischer Content-Layer
  const threeStepsCTA = useHomeSection("threeStepsCTA", TSC_STATIC, threeStepsCTAEn);
  const stepsData = threeStepsCTA.steps;
  // Desktop: Anzahl der bereits eingeflogenen Stack-Karten (0–3)
  const [visibleCards, setVisibleCards] = useState(0);
  const [mobileStep, setMobileStep] = useState(0);
  const [pinMode, setPinMode] = useState<"before" | "fixed" | "after">("before");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Desktop scroll-pin logic — Karten stapeln sich nacheinander von unten
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
    const updateStep = () => {
      const rect = section.getBoundingClientRect();
      const pinDistance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / pinDistance, 0, 1);
      const nextMode = rect.top > 0 ? "before" : rect.bottom <= window.innerHeight ? "after" : "fixed";
      // Einflug-Schwellen: Karte 1 direkt beim Pinnen, 2 und 3 gestaffelt dahinter
      const nextVisible = progress >= 0.62 ? 3 : progress >= 0.32 ? 2 : progress >= 0.02 ? 1 : 0;

      setPinMode((current) => (current === nextMode ? current : nextMode));
      setVisibleCards((current) => (current === nextVisible ? current : nextVisible));
    };
    const requestStepUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateStep);
    };

    window.addEventListener("scroll", requestStepUpdate, { passive: true });
    window.addEventListener("resize", requestStepUpdate);
    requestStepUpdate();
    return () => {
      window.removeEventListener("scroll", requestStepUpdate);
      window.removeEventListener("resize", requestStepUpdate);
      cancelAnimationFrame(frame);
    };
  }, [isMobile]);

  // Mobile scroll-driven logic
  useEffect(() => {
    if (!isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
    const update = () => {
      const rect = section.getBoundingClientRect();
      const pinDist = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / pinDist, 0, 1);
      const nextMode = rect.top > 0 ? "before" : rect.bottom <= window.innerHeight ? "after" : "fixed";
      const nextStep = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;
      setPinMode((c) => (c === nextMode ? c : nextMode));
      setMobileStep((c) => (c === nextStep ? c : nextStep));
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, [isMobile]);

  /* ── MOBILE LAYOUT ── */
  if (isMobile) {
    const mobilePinStyle: React.CSSProperties = {
      position: pinMode === "fixed" ? "fixed" : "absolute",
      top: pinMode === "after" ? "auto" : 0,
      bottom: pinMode === "after" ? 0 : "auto",
      left: 0, right: 0, width: "100%", height: "100dvh", zIndex: 1,
      background: "transparent",
    };

    return (
      <div
        id="cta"
        ref={sectionRef}
        className="relative isolate"
        style={{
          height: "350dvh",
          background: "transparent",
          }}
      >
        <div style={mobilePinStyle} className="overflow-hidden">
          <div className="px-6 pt-24 pb-8 h-full flex flex-col">
            <h2
              style={{ color: INK_DEEP }}
            >
              {threeStepsCTA.heading.line1}<br />{threeStepsCTA.heading.line2}<br />{threeStepsCTA.heading.line3}
            </h2>

            <div className="mb-3">
              <FloatingConsultButton />
            </div>

            <div className="flex items-center mb-5">
              <div>
                <p className="uppercase tracking-wide" style={{ ...BODY, fontWeight: 700, fontSize: "14px", color: INK_DEEP }}>
                  {threeStepsCTA.person.name}
                </p>
                <p style={{ ...BODY, fontSize: "14px", color: "rgba(23,23,23,0.68)" }}>
                  {threeStepsCTA.person.role}
                </p>
                <a
                  href={threeStepsCTA.person.phoneHref}
                  style={{ ...BODY, fontWeight: 600, fontSize: "12px", color: INK_DEEP, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px", marginTop: "6px" }}
                >
                  {threeStepsCTA.person.phoneLabel}
                </a>
              </div>
            </div>

            <div className="relative flex-1" style={{ minHeight: 200 }}>
              {stepsData.map((card, i) => {
                const isActive = mobileStep === i;
                const isPast = mobileStep > i;
                return (
                  <div
                    key={card.title}
                    className="absolute inset-x-0 top-0 p-5 flex flex-col will-change-transform"
                    style={{
                      background: "rgba(255,255,255,0.98)",
                      opacity: isActive ? 1 : 0,
                      transform: isPast
                        ? "translateX(-120%) rotate(-8deg) scale(0.9)"
                        : isActive
                          ? "translateX(0) rotate(0deg) scale(1)"
                          : "translateX(60px) scale(0.92)",
                      transition: "opacity 500ms ease, transform 600ms cubic-bezier(0.4,0,0.2,1)",
                      pointerEvents: isActive ? "auto" : "none",
                      borderRadius: "16px",
                      boxShadow: "0 16px 50px rgba(23,23,23,0.18)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span aria-hidden style={{ ...HEAD, fontSize: "13px", color: INK_DEEP, background: LIME, width: "30px", height: "30px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                      <span
                        className="text-[0.75rem] font-bold uppercase"
                        style={{ ...BODY, fontWeight: 700, letterSpacing: "0.04em", color: INK_DEEP }}
                      >
                        {threeStepsCTA.stepLabelPrefix} {i + 1}
                      </span>
                    </div>
                    <h3
                      style={{ color: L.text }}
                    >
                      {card.title}
                    </h3>
                    <p style={{ color: L.textMuted }}>
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-2 mt-auto pt-4">
              {stepsData.map((_, i) => (
                <span
                  key={i}
                  className="block h-2 transition-all duration-500"
                  style={{
                    background: mobileStep === i ? LIME : "rgba(204,255,0,0.22)",
                    width: mobileStep === i ? "28px" : "10px",
                    borderRadius: "4px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── DESKTOP LAYOUT ── */
  const pinnedStyle: React.CSSProperties = {
    position: pinMode === "fixed" ? "fixed" : "absolute",
    top: pinMode === "after" ? "auto" : 0,
    bottom: pinMode === "after" ? 0 : "auto",
    left: 0,
    right: 0,
    width: "100%",
    height: "100dvh",
    zIndex: 1,
    background: "transparent", // zeigt das durchgehende Magazin-Papier der Seite
  };

  return (
    <div
      id="cta"
      ref={sectionRef}
      className="relative isolate"
      style={{
        height: "280dvh",
        background: "transparent",
      }}
    >
      <div style={pinnedStyle} className="overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 w-full h-full relative">
          <div className="absolute inset-0 grid md:grid-cols-[0.9fr_1.1fr] gap-7 md:gap-12 items-center w-full pt-24 pb-6 md:pt-24 md:pb-8">
            {/* LEFT */}
            <div className="flex flex-col justify-center">
              <h2
                style={{ color: INK_DEEP }}
              >
                {threeStepsCTA.heading.line1}<br />{threeStepsCTA.heading.line2}<br />{threeStepsCTA.heading.line3}
              </h2>

              <FloatingConsultButton />
              <div className="flex gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block h-2 transition-all duration-500"
                    style={{
                      background: visibleCards > i ? LIME : "rgba(204,255,0,0.22)",
                      width: Math.max(0, visibleCards - 1) === i ? "28px" : "10px",
                      borderRadius: "4px",
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center mt-4">
                <div>
                  <p className="uppercase tracking-wide" style={{ ...BODY, fontWeight: 700, fontSize: "14px", color: INK_DEEP }}>
                    {threeStepsCTA.person.name}
                  </p>
                  <p style={{ ...BODY, fontSize: "14px", color: "rgba(23,23,23,0.68)" }}>
                    {threeStepsCTA.person.role}
                  </p>
                  <a
                    href={threeStepsCTA.person.phoneHref}
                    style={{ ...BODY, fontWeight: 600, fontSize: "13px", color: INK_DEEP, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "8px" }}
                  >
                    {threeStepsCTA.person.phoneLabel}
                  </a>
                </div>
              </div>
            </div>

            {/* RIGHT — Scroll-Stack: Karten fliegen nacheinander von unten ein und
                stapeln sich (Schritt 1 oben, 2 und 3 leicht überlappend darunter).
                Nur transform/opacity animiert — kein Layout-Shift, Slots stehen fest. */}
            <div className="flex flex-col justify-center" aria-live="polite">
              {stepsData.map((card, i) => {
                const entered = visibleCards > i;
                return (
                  <div
                    key={card.title}
                    className="relative p-6 md:p-7 will-change-transform"
                    style={{
                      background: "rgba(255,255,255,0.98)",
                      borderRadius: "16px",
                      boxShadow: "0 18px 44px rgba(23,23,23,0.14)",
                      // Leichte Überlappung — spätere Karte legt sich oben auf die Kante
                      marginTop: i === 0 ? 0 : "-14px",
                      zIndex: i + 1,
                      // Edgy-Versatz der Marke: minimal alternierende Rotation im Stapel
                      transform: entered
                        ? `translate3d(0, 0, 0) rotate(${[-1.2, 0.9, -0.7][i]}deg) scale(1)`
                        : "translate3d(0, 56vh, 0) rotate(0deg) scale(0.96)",
                      opacity: entered ? 1 : 0,
                      transition: PREFERS_REDUCED_MOTION
                        ? "none"
                        : "transform 520ms cubic-bezier(0.22,1,0.36,1), opacity 380ms ease-out",
                      pointerEvents: entered ? "auto" : "none",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2.5">
                      <span aria-hidden style={{ ...HEAD, fontSize: "14px", color: INK_DEEP, background: LIME, width: "32px", height: "32px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                      <span
                        className="text-[0.8rem] font-bold uppercase"
                        style={{ ...BODY, fontWeight: 700, letterSpacing: "0.04em", color: INK_DEEP }}
                      >
                        {threeStepsCTA.stepLabelPrefix} {i + 1}
                      </span>
                    </div>
                    <h3
                      style={{ color: L.text }}
                    >
                      {card.title}
                    </h3>
                    <p style={{ color: L.textMuted }}>
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
