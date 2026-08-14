import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { MobileNavigation } from "@/components/MobileNavigation";
import SEOHead from "@/components/SEOHead";
import { SpeakWithUsCta } from "@/components/SpeakWithUsCta";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { EdgePillButton, EdgeTextButton } from "@/components/ui/EdgeCta";
import { EdgeRip } from "@/components/ui/EdgeRip";
import { about as ABOUT_STATIC } from "@/content/pages/about";
import { about as aboutEn } from "@/content/en/pages/about";
import { img } from "@/content";
import { useLocalized } from "@/hooks/useLocalized";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const FLASH       = "#FF1E00";
const INK_DEEP = "#171717";
const INK = "#3C3C3C";
const INK_DEEPER = "#101010";
const PAPER = "#F2F2F2";
const HAIRLINE = "rgba(23,23,23,0.14)";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Kicker/Eyebrow-Grundstil (Farbe je Fläche: LIME hell / LIME dunkel). */
const KICKER: React.CSSProperties = {
  fontFamily: OUTFIT,
  fontWeight: 700,
  fontSize: "13px",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const About = () => {
  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const about = useLocalized("about", ABOUT_STATIC, aboutEn);
  const { language } = useLanguage();

  return (
    <>
      <SEOHead
        title={about.seo.title}
        description={about.seo.description}
        canonical={about.seo.canonical}
      />

      <div className="min-h-screen overflow-x-hidden" style={{ background: PAPER, color: INK_DEEP }}>
        <NoiseOverlay opacity={0.03} fixed zIndex={2} />
        <MobileNavigation onContactClick={() => {}} theme="dark" />

        {/* ── HERO ──────────────────────────────────────────────── */}
        <div className="relative" style={{ background: PAPER, minHeight: "clamp(460px, 66vh, 680px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {/* Sanfter Violett-Glow von oben (statt dunkler Vignette) */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "radial-gradient(ellipse 90% 70% at 50% -10%, rgba(204,255,0,0.14) 0%, transparent 62%)",
          }} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "clamp(100px,16vh,140px) 24px clamp(60px,8vh,100px)" }}
          >
            {/* Headline */}
            <h1 style={{
              color: INK_DEEP,
              maxWidth: "22ch",
              margin: "0 auto",
            }}>
              {about.hero.headline}
            </h1>

            {/* Subline */}
            <p style={{
              fontFamily: OUTFIT,
              color: INK,
              maxWidth: "560px",
              margin: "0 auto",
            }}>
              {about.hero.subline}
            </p>

            {/* CTA → Kontaktseite (kein Calendly mehr) */}
            <div style={{ marginTop: "36px", display: "flex", justifyContent: "center" }}>
              <EdgePillButton to="/kontakt">{about.hero.cta.label}</EdgePillButton>
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
              background: "linear-gradient(to bottom, rgba(23,23,23,0), rgba(23,23,23,0.45) 50%, rgba(23,23,23,0.22))",
              boxShadow: "0 0 10px rgba(23,23,23,0.22)",
              zIndex: 3,
            }}
          />
        </div>

        {/* ── TEAM CARDS ─────────────────────────────────────────── */}
        <div style={{ background: PAPER, padding: "clamp(56px,7vw,96px) 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* Team-Titel — violetter Eyebrow + Überschrift */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ marginBottom: "clamp(36px, 5vw, 56px)" }}
            >
              <p style={{ ...KICKER, color: INK_DEEP, marginBottom: "14px" }}>
                {language === "en" ? "Our Team" : "Unser Team"}
              </p>
              <h2 style={{ color: INK_DEEP }}>
                {language === "en" ? "Your AI Department" : "Deine KI-Abteilung"}
              </h2>
            </motion.div>
            <style>{`
              .team-photo .team-img {
                position: absolute; inset: 0; width: 100%; height: 100%;
                object-fit: cover; display: block;
                transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
                will-change: opacity, transform;
              }
              .team-img-hover { opacity: 0; }
              .team-card--swap:hover .team-img-base { opacity: 0; transform: scale(1.05); }
              .team-card--swap:hover .team-img-hover { opacity: 1; transform: scale(1.05); }
              @media (prefers-reduced-motion: reduce) {
                .team-photo .team-img { transition: opacity 0.2s ease; }
                .team-card--swap:hover .team-img-base,
                .team-card--swap:hover .team-img-hover { transform: none; }
              }
            `}</style>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}>
              {about.team.map((member, i) => (
                <motion.div
                  key={member.name}
                  className={member.imgHover ? "team-card team-card--swap" : "team-card"}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
                  style={{
                    background: "#FFFFFF",
                    border: `1px solid ${HAIRLINE}`,
                    borderRadius: "16px",
                    boxShadow: "0 1px 2px rgba(23,23,23,0.06)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Photo / Avatar */}
                  <div className="team-photo" style={{ aspectRatio: "3 / 4", background: "#E5E5E5", overflow: "hidden", position: "relative" }}>
                    {member.img ? (
                      <>
                        <img
                          className="team-img team-img-base"
                          src={img(member.img)}
                          alt={member.name}
                          style={{ objectPosition: member.imgPos || "center top" }}
                        />
                        {member.imgHover && (
                          <img
                            className="team-img team-img-hover"
                            src={img(member.imgHover)}
                            alt=""
                            aria-hidden
                            loading="lazy"
                            style={{ objectPosition: member.imgHoverPos || member.imgPos || "center top" }}
                          />
                        )}
                      </>
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #E5E5E5 0%, #D3D3D3 100%)",
                      }}>
                        <span style={{
                          fontFamily: OUTFIT,
                          fontWeight: 800,
                          fontSize: "4rem",
                          letterSpacing: "-0.02em",
                          color: INK_DEEP,
                          opacity: 0.35,
                        }}>
                          {member.initials}
                        </span>
                      </div>
                    )}
                    {/* Role badge — violette Pill */}
                    <div style={{
                      position: "absolute",
                      top: "14px",
                      left: "14px",
                      background: "rgba(23,23,23,0.92)",
                      backdropFilter: "blur(8px)",
                      borderRadius: "999px",
                      padding: "6px 14px",
                    }}>
                      <span style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "11px", letterSpacing: "0.06em", color: "#fff", textTransform: "uppercase" }}>
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "26px 24px 30px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h2 style={{ color: INK_DEEP, marginBottom: "18px" }}>
                      {member.name}
                    </h2>

                    {/* Facts */}
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, flex: 1 }}>
                      {member.facts.map((f, fi) => (
                        <li key={fi} style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          paddingBottom: "10px",
                          marginBottom: fi < member.facts.length - 1 ? "10px" : 0,
                          borderBottom: fi < member.facts.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                        }}>
                          <span aria-hidden style={{ color: INK_DEEP, fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>▸</span>
                          <span style={{ fontFamily: OUTFIT, fontWeight: 400, fontSize: "13.5px", color: "rgba(23,23,23,0.68)", lineHeight: 1.6 }}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* LinkedIn */}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          marginTop: "22px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          textDecoration: "none",
                          color: INK_DEEP,
                          opacity: 0.8,
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "0.8")}
                        aria-label={`${member.name} auf LinkedIn`}
                      >
                        {/* LinkedIn official logo */}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="5" fill={INK_DEEP}/>
                          <path d="M7.5 9.5H5V19H7.5V9.5Z" fill="white"/>
                          <circle cx="6.25" cy="6.75" r="1.5" fill="white"/>
                          <path d="M13 13.5C13 12.4 13.9 11.5 15 11.5C16.1 11.5 17 12.4 17 13.5V19H19.5V13.5C19.5 11 17.5 9 15 9C13.8 9 12.7 9.5 12 10.3V9.5H9.5V19H12V13.5H13Z" fill="white"/>
                        </svg>
                        <span style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                          LinkedIn
                        </span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── WERKBANK — System-Manifest ──────────────────────────── */}
        <div style={{ background: PAPER, borderTop: `1px solid ${HAIRLINE}`, padding: "clamp(56px,7vw,96px) 24px" }}>
          <style>{`
            .wb-grid { display: grid; grid-template-columns: 1.08fr 0.92fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
            .wb-row {
              position: relative; display: grid; grid-template-columns: 64px 1fr; gap: 20px;
              align-items: baseline; padding: clamp(18px, 2.4vw, 26px) 20px;
              border: 1px solid ${HAIRLINE}; border-radius: 16px; overflow: hidden;
              background: #ffffff;
              box-shadow: 0 1px 2px rgba(23,23,23,0.06);
              margin-bottom: 10px;
            }
            .wb-row:last-child { margin-bottom: 0; }
            .wb-row::before {
              content: ""; position: absolute; inset: 0; background: ${LIME};
              transform: scaleY(0); transform-origin: bottom; z-index: 0;
              transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
            }
            .wb-row:hover::before { transform: scaleY(1); }
            .wb-row > * { position: relative; z-index: 1; transition: color 0.3s ease, -webkit-text-stroke-color 0.3s ease; }
            .wb-num {
              font-family: ${OUTFIT}; font-weight: 800;
              font-size: clamp(1.8rem, 2.8vw, 2.4rem); line-height: 1; letter-spacing: -0.01em;
              color: transparent;
              -webkit-text-stroke: 1px rgba(23,23,23,0.45);
            }
            .wb-row:hover .wb-num { -webkit-text-stroke-color: rgba(23,23,23,0.68); }
            .wb-label {
              color: ${INK_DEEP};
              font-family: ${OUTFIT};
              font-weight: 700;
              font-size: clamp(1.1rem, 1.9vw, 1.35rem);
              letter-spacing: -0.01em;
              line-height: 1.2;
            }
            .wb-desc { color: ${INK}; font-family: ${OUTFIT}; font-weight: 400; }
            .wb-row:hover .wb-label,
            .wb-row:hover .wb-desc { color: #fff; }
            .wb-photo { position: relative; border: 1px solid ${HAIRLINE}; border-radius: 16px; overflow: hidden; }
            @media (max-width: 860px) {
              .wb-grid { grid-template-columns: 1fr; }
            }
            @media (prefers-reduced-motion: reduce) {
              .wb-row::before { transition: none; }
            }
          `}</style>

          <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
            {about.werkbank.eyebrow && (
              <p style={{ ...KICKER, color: INK_DEEP, marginBottom: "14px" }}>
                {about.werkbank.eyebrow}
              </p>
            )}
            <h2 style={{ color: INK_DEEP }}>
              {about.werkbank.heading}
            </h2>
            <p style={{ fontFamily: OUTFIT, color: INK, maxWidth: "62ch", marginBottom: "clamp(40px, 5vw, 64px)" }}>
              {about.werkbank.intro}
            </p>

            <div className="wb-grid">
              {/* Manifest */}
              <div>
                {about.werkbank.manifest.map((row, i) => (
                  <div key={row.k} className="wb-row">
                    <span className="wb-num" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <span className="wb-label" style={{ display: "block", marginBottom: "8px" }}>{row.k}</span>
                      <span className="wb-desc" style={{ display: "block", fontSize: "14px", lineHeight: 1.65 }}>{row.v}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Video als dokumentiertes Artefakt — mit versetztem Outline-Rahmen + Edge-Riss */}
              <div style={{ position: "relative" }}>
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "-12px 12px 12px -12px",
                    border: "1.5px solid rgba(204,255,0,0.45)",
                    borderRadius: "16px 64px 16px 64px",
                    transform: "rotate(-1.5deg)",
                    pointerEvents: "none",
                  }}
                />
                <div className="wb-photo" style={{ aspectRatio: "16 / 9" }}>
                  {/* Native YouTube-Vorschau (kein Custom-Facade) */}
                  <iframe
                    src={`https://www.youtube.com/embed/${about.werkbank.video.youtubeId}?rel=0&modestbranding=1&color=white`}
                    title={about.werkbank.video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block" }}
                  />
                  {/* Kleiner Riss von der Oberkante — die „Edge" der Marke */}
                  <EdgeRip style={{ top: "-1px", left: "20%", width: "30px", height: "72px", zIndex: 2 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA — geteilte Komponente, 1:1 wie auf der Anwendungsfelder-Seite ── */}
        <SpeakWithUsCta
          eyebrow={about.cta.eyebrow}
          headingLine1={about.cta.headingLine1}
          headingLine2={about.cta.headingLine2}
          phoneHref={about.cta.phone.href}
          phoneLabel={about.cta.phone.label}
        />

        {/* Footer */}
        <Suspense fallback={<div style={{ minHeight: 200 }} />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default About;
