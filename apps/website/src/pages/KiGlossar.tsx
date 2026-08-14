import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MobileNavigation } from "@/components/MobileNavigation";
import SEOHead from "@/components/SEOHead";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { EdgePillButton } from "@/components/ui/EdgeCta";
import { EdgeRip } from "@/components/ui/EdgeRip";
import { kiGlossar as GLOSSAR_STATIC, type GlossaryTerm } from "@/content/pages/kiGlossar";
import { kiGlossar as kiGlossarEn } from "@/content/en/pages/kiGlossar";
import { useLocalized } from "@/hooks/useLocalized";

const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

/* ── NEWEDGE CI (Rebrush 2026-07) ── */
const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
/** Lime — reine Akzent-/Flächenfarbe (Button, Badge, Fortschrittspunkt); nie als Text/Icon auf hellem Grund. */
const LIME = "#CCFF00";
const INK_DEEP     = "#171717";
const INK_DEEPER   = "#101010";
const PAPER        = "#F2F2F2";
const HAIRLINE     = "rgba(23,23,23,0.14)";
/** Dunkler Ink-Verlauf der Footer-Karte — für dunkle Flächen. */
const INK_GRADIENT = "linear-gradient(160deg, #1F1F1F 0%, #171717 45%, #101010 100%)";
const EASE         = [0.22, 1, 0.36, 1] as const;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const KiGlossar = () => {
  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const kiGlossar = useLocalized("ki-glossar", GLOSSAR_STATIC, kiGlossarEn);
  const GLOSSARY: Record<string, GlossaryTerm[]> = kiGlossar.glossary;
  const TOTAL = Object.values(GLOSSARY).reduce((n, arr) => n + arr.length, 0);

  const [query, setQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOSSARY;
    const out: Record<string, GlossaryTerm[]> = {};
    for (const L of ALPHABET) {
      const items = (GLOSSARY[L] || []).filter(
        e => e.term.toLowerCase().includes(q) || e.def.toLowerCase().includes(q)
      );
      if (items.length) out[L] = items;
    }
    return out;
  }, [query]);

  const lettersWithContent = ALPHABET.filter(L => (filtered[L]?.length ?? 0) > 0);
  const resultCount = lettersWithContent.reduce((n, L) => n + filtered[L].length, 0);

  const scrollToLetter = (L: string) => {
    const el = document.getElementById(`gl-${L}`);
    if (!el) return;
    // window.scrollTo statt scrollIntoView: der overflow-x-hidden-Wrapper wird vom
    // Browser zum (nicht scrollenden) Scroll-Container, scrollIntoView würde ins Leere zielen.
    const top = el.getBoundingClientRect().top + window.scrollY - 124;
    window.scrollTo({ top, behavior: "smooth" });
  };

  // Scroll-Spy: aktiven Buchstaben hervorheben
  useEffect(() => {
    const sections = lettersWithContent
      .map(L => document.getElementById(`gl-${L}`))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveLetter(visible[0].target.id.replace("gl-", ""));
      },
      { rootMargin: "-150px 0px -72% 0px", threshold: 0 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SEOHead
        title={kiGlossar.seo.title}
        description={kiGlossar.seo.descriptionTemplate.replace("{total}", String(TOTAL))}
        canonical={kiGlossar.seo.canonical}
      />

      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <NoiseOverlay opacity={0.03} fixed zIndex={2} />
        <MobileNavigation onContactClick={() => {}} theme="dark" />

        {/* ── HERO ── */}
        <div className="relative" style={{ background: PAPER, minHeight: "clamp(460px, 66vh, 680px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div aria-hidden style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(23,23,23,0.06) 0%, transparent 62%)",
          }} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "clamp(100px,16vh,140px) 24px clamp(60px,8vh,100px)" }}
          >
            <h1 style={{
              color: INK_DEEP,
            }}>
              {kiGlossar.hero.headline}
            </h1>

            <p style={{
              fontFamily: OUTFIT,
              color: "#3C3C3C",
              maxWidth: "560px",
              margin: "0 auto",
            }}>
              {kiGlossar.hero.sublineTemplate.replace("{total}", String(TOTAL))}
            </p>
          </motion.div>

          <motion.div
            animate={{ opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
              width: "2px", height: "clamp(80px, 10vh, 130px)",
              background: "linear-gradient(to bottom, rgba(23,23,23,0), rgba(23,23,23,0.45) 50%, rgba(23,23,23,0.14))",
              boxShadow: "0 0 10px rgba(23,23,23,0.22)", zIndex: 3,
            }}
          />
        </div>

        {/* ── GLOSSAR ── */}
        <div style={{ background: PAPER, position: "relative" }}>
          {/* Sticky Toolbar: Suche + Alphabet */}
          <div
            style={{
              position: "sticky", top: 0, zIndex: 20,
              background: "rgba(242,242,242,0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "16px 24px" }}>
              {/* Suche */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
                <div style={{ position: "relative", width: "100%", maxWidth: "440px" }}>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={kiGlossar.toolbar.searchPlaceholder}
                    aria-label={kiGlossar.toolbar.searchAriaLabel}
                    style={{
                      width: "100%",
                      padding: "11px 38px 11px 18px",
                      fontFamily: OUTFIT,
                      fontWeight: 400,
                      fontSize: "14px",
                      color: INK_DEEP,
                      background: "#fff",
                      border: `1.5px solid ${HAIRLINE}`,
                      borderRadius: "999px",
                      outline: "none",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = INK_DEEP)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = HAIRLINE)}
                  />
                  <span aria-hidden style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: INK_DEEP, fontSize: "15px", pointerEvents: "none" }}>{kiGlossar.toolbar.searchGlyph}</span>
                </div>
              </div>

              {/* Alphabet */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px" }}>
                {ALPHABET.map((L) => {
                  const has = (filtered[L]?.length ?? 0) > 0;
                  const isActive = activeLetter === L;
                  return (
                    <button
                      key={L}
                      onClick={() => has && scrollToLetter(L)}
                      disabled={!has}
                      aria-label={kiGlossar.toolbar.letterAriaTemplate.replace("{letter}", L)}
                      style={{
                        fontFamily: OUTFIT,
                        width: "30px", height: "30px",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12.5px", fontWeight: 600,
                        borderRadius: "999px",
                        border: "1px solid transparent",
                        cursor: has ? "pointer" : "default",
                        transition: "background-color 0.18s ease, color 0.18s ease",
                        background: isActive ? LIME : "transparent",
                        color: isActive ? INK_DEEP : has ? INK_DEEP : "rgba(23,23,23,0.22)",
                      }}
                      onMouseEnter={(e) => { if (has && !isActive) { e.currentTarget.style.background = "rgba(23,23,23,0.06)"; } }}
                      onMouseLeave={(e) => { if (has && !isActive) { e.currentTarget.style.background = "transparent"; } }}
                    >
                      {L}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Begriffe */}
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "clamp(48px,7vw,88px) 24px clamp(56px,7vw,96px)" }}>
            {resultCount === 0 ? (
              <p style={{ fontFamily: OUTFIT, textAlign: "center", color: "rgba(23,23,23,0.68)", padding: "60px 0" }}>
                {kiGlossar.emptyTemplate.split("{query}")[0]}{query}{kiGlossar.emptyTemplate.split("{query}")[1]}
              </p>
            ) : (
              lettersWithContent.map((L) => (
                <section
                  key={L}
                  id={`gl-${L}`}
                  style={{ scrollMarginTop: "150px", marginBottom: "clamp(48px,6vw,72px)" }}
                >
                  {/* Buchstaben-Überschrift */}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px", paddingBottom: "14px", borderBottom: `1px solid ${HAIRLINE}` }}>
                    {/* h2 statt span: Gruppentitel der Begriffsliste — schließt
                        die Lücke H1 → H3 in der Überschriften-Hierarchie. */}
                    <h2 style={{
                      fontFamily: OUTFIT,
                      fontWeight: 800,
                      fontSize: "clamp(2rem, 4vw, 2.9rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.01em",
                      color: INK_DEEP,
                      margin: 0,
                    }}>{L}</h2>
                    <span style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(23,23,23,0.68)" }}>
                      {filtered[L].length} {filtered[L].length === 1 ? kiGlossar.countLabel.singular : kiGlossar.countLabel.plural}
                    </span>
                  </div>

                  {/* Begriffs-Karten */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
                    {filtered[L].map((e) => (
                      <div
                        key={e.term}
                        style={{
                          background: "#FFFFFF",
                          borderRadius: "16px",
                          border: `1px solid ${HAIRLINE}`,
                          boxShadow: "0 1px 2px rgba(23,23,23,0.06)",
                          padding: "20px 22px",
                        }}
                      >
                        <h3 style={{
                          color: INK_DEEP,
                        }}>
                          {e.term}
                        </h3>
                        <p style={{ fontFamily: OUTFIT, color: "rgba(23,23,23,0.68)" }}>
                          {e.def}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}

            {/* Abschluss-CTA — dunkle Ink-Karte */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{
                position: "relative",
                marginTop: "clamp(48px,6vw,72px)",
                background: INK_GRADIENT,
                borderRadius: "24px",
                border: "1px solid rgba(204,255,0,0.14)",
                padding: "clamp(40px, 6vw, 64px) clamp(24px, 4vw, 48px)",
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              {/* Dezenter Lime-Schein unten links — Ink-Karte bekommt Tiefe */}
              <div aria-hidden style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 70% 60% at 0% 100%, rgba(204,255,0,0.14) 0%, transparent 65%)",
              }} />
              {/* Edge-Riss an der Oberkante — das Markenzeichen */}
              <EdgeRip style={{ top: "-1px", right: "14%", width: "28px", height: "66px", zIndex: 1 }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{
                  fontFamily: OUTFIT,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "#fff",
                  marginBottom: "12px",
                }}>
                  {kiGlossar.cta.heading}
                </p>
                <p style={{
                  fontFamily: OUTFIT,
                  color: "rgba(255,255,255,0.68)",
                  maxWidth: "480px",
                  margin: "0 auto 28px",
                }}>
                  {kiGlossar.cta.body}
                </p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <EdgePillButton to="/kontakt">{kiGlossar.cta.button}</EdgePillButton>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <Suspense fallback={<div style={{ minHeight: 200 }} />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default KiGlossar;
