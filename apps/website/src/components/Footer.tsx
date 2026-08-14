import { LocaleLink as Link } from "@/components/LocaleLink";
import { useEffect, useState } from "react";
import { ArrowUpRight, Linkedin, Mail, Phone, MapPin, Instagram, Github } from "lucide-react";
import { footer as FOOTER_STATIC, img } from "@/content";
import { footer as footerEn } from "@/content/en/sections/footer";
import { useLocalized } from "@/hooks/useLocalized";
import { MaschinenraumTicker } from "@/components/MaschinenraumTicker";

/* ── Design tokens (Rebrush) ── */
const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const LIME = "#CCFF00";
const INK_DEEP = "#171717";
const PAPER = "#F2F2F2";
const MUTED = "rgba(255,255,255,0.68)";
const R = 32; // Karten-/Notch-Radius

/** Konkave Übergangs-Ecke (Paper → Karte) für den Back-to-top-Notch. */
const Scoop = ({ flip = false, style }: { flip?: boolean; style: React.CSSProperties }) => (
  <div
    aria-hidden
    style={{
      position: "absolute",
      width: `${R}px`,
      height: `${R}px`,
      background: `radial-gradient(circle at ${flip ? "0% 100%" : "100% 100%"}, transparent ${R}px, ${PAPER} ${R}px)`,
      pointerEvents: "none",
      ...style,
    }}
  />
);

/** Icon je Kontakt-Link (mailto → Mail, tel → Phone, sonst Adresse/Pin). */
const contactIcon = (href: string) => {
  if (href.startsWith("mailto:")) return Mail;
  if (href.startsWith("tel:")) return Phone;
  return MapPin;
};

/** Social-Icons für den schwebenden Notch oben links — getrennt von der Kontakt-Spalte unten. */
const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/new-edge-brand/", Icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/newedgebrand/", Icon: Instagram },
  { label: "GitHub", href: "#", Icon: Github },
];

export const Footer = () => {
  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer.
  // Die Rebrush-Chrome-Felder kommen bewusst direkt aus dem statischen Modul.
  const footer = useLocalized("footer", FOOTER_STATIC, footerEn);
  const rb = footer.rebrush;

  // Cookiebot lädt asynchron und ist beim ersten Rendern meist noch nicht da.
  // Ohne diesen Zustand bliebe der Widerrufs-Link dauerhaft unsichtbar — und die
  // Datenschutzerklärung (Abschnitt 8/12) verspräche etwas, das es nicht gibt.
  const [cookiebotBereit, setCookiebotBereit] = useState(false);
  useEffect(() => {
    if (window.Cookiebot) { setCookiebotBereit(true); return; }
    const da = () => setCookiebotBereit(Boolean(window.Cookiebot));
    window.addEventListener("CookiebotOnLoad", da);
    window.addEventListener("CookiebotOnConsentReady", da);
    return () => {
      window.removeEventListener("CookiebotOnLoad", da);
      window.removeEventListener("CookiebotOnConsentReady", da);
    };
  }, []);

  // ROI-Rechner garantiert in der Ressourcen-Spalte zeigen — auch wenn die Spalte
  // aus dem CMS kommt und den Eintrag (noch) nicht enthält.
  const ressourcenLinks = [...footer.columns.ressourcen.links];
  if (!ressourcenLinks.some((l) => l.to === "/roi-rechner")) {
    ressourcenLinks.unshift({ label: "ROI-Rechner", to: "/roi-rechner" });
  }
  const year = new Date().getFullYear();
  const copyright = footer.copyrightTemplate.replace("{year}", String(year));

  const linkStyle: React.CSSProperties = {
    fontFamily: OUTFIT,
    fontWeight: 500,
    fontSize: "16px",
    color: "#fff",
    textDecoration: "none",
    lineHeight: 1,
    transition: "color 0.18s ease",
  };
  const colLabelStyle: React.CSSProperties = {
    fontFamily: OUTFIT,
    fontWeight: 400,
    fontSize: "14px",
    color: MUTED,
    marginBottom: "22px",
  };

  return (
    <footer style={{ background: PAPER }}>
      <MaschinenraumTicker />

      <div style={{ padding: "clamp(12px, 1.5vw, 24px)" }}>
        <div>
          {/* ── Dunkle Footer-Karte (volle Breite, Notches oben links + rechts) ── */}
          <div
            className="relative"
            style={{
              background: `linear-gradient(160deg, #1F1F1F 0%, ${INK_DEEP} 45%, #101010 100%)`,
              borderRadius: `${R + 8}px`,
              overflow: "hidden",
            }}
          >
            {/* Social-Kreise-Notch oben links (Paper-Ausschnitt, Desktop) */}
            <div
              className="hidden lg:block"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 2,
                background: PAPER,
                borderRadius: `0 0 ${R}px 0`,
                padding: "0 16px 16px 0",
              }}
            >
              <div className="flex flex-col gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="transition-colors duration-200"
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "50%",
                      background: LIME,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = INK_DEEP;
                      const svg = e.currentTarget.querySelector("svg");
                      if (svg) svg.style.color = LIME;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = LIME;
                      const svg = e.currentTarget.querySelector("svg");
                      if (svg) svg.style.color = INK_DEEP;
                    }}
                  >
                    <Icon strokeWidth={1.8} style={{ width: "19px", height: "19px", color: INK_DEEP }} />
                  </a>
                ))}
              </div>
              <Scoop style={{ top: 0, right: `-${R}px` }} />
              <Scoop style={{ top: "100%", left: 0 }} />
            </div>

            {/* Vertikales Logo am linken Kartenrand — um -90° gedreht,
                das N unten, liest von unten nach oben (nur Desktop: nutzt
                die 120px-Gutter-Spalte, Mobile hat keinen Seitenrand dafür) */}
            <img
              src={img("newedge-wordmark-white")}
              alt="NEWEDGE"
              loading="lazy"
              className="hidden lg:block"
              style={{
                position: "absolute",
                left: "56px",
                top: "55%",
                height: "34px",
                width: "auto",
                transform: "translate(-50%, -50%) rotate(-90deg)",
                zIndex: 1,
                maxWidth: "none",
              }}
            />

            {/* Back-to-top-Notch oben rechts (Paper-Ausschnitt) */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 2,
                background: PAPER,
                borderRadius: `0 0 0 ${R}px`,
                padding: "0 6px 14px 26px",
                whiteSpace: "nowrap",
                maxWidth: "none", // globale Mobile-Regel `* { max-width:100% }` würde den shrink-to-fit-Notch sonst umbrechen
              }}
            >
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="transition-colors duration-200 hover:text-[#CCFF00]"
                style={{
                  fontFamily: OUTFIT,
                  fontWeight: 600,
                  fontSize: "15px",
                  color: INK_DEEP,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  minHeight: 0, // globale Mobile-Regel `button { min-height:48px }` würde die Notch sonst aufblähen
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  maxWidth: "none",
                }}
              >
                {/* Mobile: kurzer Text; geschütztes Leerzeichen vor dem Emoji → nie 2 Zeilen (Notch bleibt flach) */}
                <span className="hidden lg:inline">{rb.backTop}</span>
                <span className="lg:hidden">{rb.backTopShort || rb.backTop}</span>
                <span aria-hidden style={{ fontSize: "14px" }}>👆</span>
              </button>
              <Scoop flip style={{ top: 0, left: `-${R}px` }} />
              <Scoop flip style={{ top: "100%", right: 0 }} />
            </div>

            <div className="lg:pl-[120px]" style={{ padding: "clamp(26px, 5vw, 80px) clamp(24px, 4vw, 72px) clamp(20px, 2.5vw, 36px)" }}>
              {/* ── Obere Zeile: Heading + CTA | Linkspalten | Kontakt ── */}
              <div className="grid gap-y-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-x-10">
                {/* Heading + CTA */}
                <div className="lg:pl-12">
                  <h2
                    style={{
                      color: "#fff",
                    }}
                  >
                    {rb.headingLine1}
                    <br />
                    {rb.headingLine2}
                  </h2>
                  <Link
                    to={rb.ctaTo}
                    className="inline-flex items-center gap-3 transition-transform duration-200 hover:scale-[1.03]"
                    style={{
                      fontFamily: OUTFIT,
                      fontWeight: 600,
                      fontSize: "15px",
                      background: LIME,
                      color: INK_DEEP,
                      borderRadius: "999px",
                      padding: "10px 10px 10px 24px",
                    }}
                  >
                    {rb.ctaLabel}
                    <span
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        background: INK_DEEP,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <ArrowUpRight style={{ width: "16px", height: "16px", color: LIME }} />
                    </span>
                  </Link>
                  <p style={{ fontFamily: OUTFIT, fontWeight: 500, fontSize: "13px", color: LIME, marginTop: "22px" }}>
                    {footer.meta}
                  </p>
                </div>

                {/* Unternehmen */}
                <div>
                  <p style={colLabelStyle}>{footer.columns.unternehmen.label}</p>
                  <ul className="m-0 p-0 flex flex-col gap-4" style={{ listStyle: "none" }}>
                    {footer.columns.unternehmen.links.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          style={linkStyle}
                          onMouseEnter={(e) => (e.currentTarget.style.color = LIME)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ressourcen */}
                <div>
                  <p style={colLabelStyle}>{footer.columns.ressourcen.label}</p>
                  <ul className="m-0 p-0 flex flex-col gap-4" style={{ listStyle: "none" }}>
                    {ressourcenLinks.map((l) => (
                      <li key={l.to}>
                        <Link
                          to={l.to}
                          style={linkStyle}
                          onMouseEnter={(e) => (e.currentTarget.style.color = LIME)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kontakt */}
                <div>
                  <p style={colLabelStyle}>{footer.columns.kontakt.label}</p>
                  <ul className="m-0 p-0 flex flex-col gap-4" style={{ listStyle: "none" }}>
                    {footer.columns.kontakt.items.map((item) => {
                      const Icon = contactIcon(item.href);
                      return (
                        <li key={item.href} className="flex items-center gap-3">
                          <Icon strokeWidth={1.8} style={{ width: "17px", height: "17px", color: LIME, flexShrink: 0 }} />
                          <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = LIME)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
                          >
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* ── Riesige Marken-Typo ── */}
              <div
                aria-hidden
                className="select-none"
                style={{
                  fontFamily: OUTFIT,
                  fontWeight: 700,
                  fontSize: "clamp(2.2rem, 7vw, 7.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.04em",
                  color: "#fff",
                  textAlign: "center",
                  marginTop: "clamp(48px, 7vw, 110px)",
                  whiteSpace: "nowrap",
                }}
              >
                {rb.giantText}
              </div>

              {/* ── Bottom-Bar ── */}
              <div
                className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.14)",
                  marginTop: "clamp(24px, 3vw, 40px)",
                  paddingTop: "clamp(16px, 2vw, 24px)",
                }}
              >
                <p style={{ fontFamily: OUTFIT, fontWeight: 500, fontSize: "13px", color: MUTED }}>{copyright}</p>
                <div className="flex items-center gap-6">
                  {footer.legalLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      style={{ fontFamily: OUTFIT, fontWeight: 500, fontSize: "13px", color: MUTED, textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = LIME)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                    >
                      {l.label}
                    </Link>
                  ))}
                  {/* Widerruf der Einwilligung — rechtlich erforderlich und in der
                      Datenschutzerklärung (Abschnitt 8 und 12) ausdrücklich zugesagt.
                      Cookiebot.renew() öffnet das Banner erneut; solange Cookiebot
                      nicht geladen ist (z. B. Domain noch nicht gescannt), bleibt der
                      Link aus, statt ins Leere zu führen. */}
                  {cookiebotBereit && (
                    <button
                      type="button"
                      onClick={() => window.Cookiebot?.renew()}
                      style={{ fontFamily: OUTFIT, fontWeight: 500, fontSize: "13px", color: MUTED, background: "none", border: "none", padding: 0, cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = LIME)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                    >
                      {footer.cookieSettingsLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
