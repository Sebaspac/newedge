import { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { LocaleLink as Link } from "@/components/LocaleLink";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MobileNavigation } from "@/components/MobileNavigation";
import SEOHead from "@/components/SEOHead";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { impressum as IMPRESSUM_STATIC } from "@/content/pages/impressum";
import { impressum as impressumEn } from "@/content/en/pages/impressum";
import { useLocalized } from "@/hooks/useLocalized";

const Footer = lazy(() => import("@/components/Footer").then((m) => ({ default: m.Footer })));

const OUTFIT = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const INK_DEEP = "#171717";
const INK = "#3C3C3C";
const PAPER = "#F2F2F2";
const MUTED = "#5E5E5A";
const HAIRLINE = "rgba(23,23,23,0.14)";
const EASE = [0.22, 1, 0.36, 1] as const;

/** Rechtstext-Grundschrift — erbt Größe/Zeilenhöhe vom globalen Fließtext-System. */
const BODY: React.CSSProperties = {
  fontFamily: OUTFIT,
  fontWeight: 400,
  color: INK,
  maxWidth: "72ch",
};

/** Hervorgehobene Begriffe/Box-Titel innerhalb des Rechtstexts. */
const STRONG: React.CSSProperties = { fontWeight: 600, color: INK_DEEP };

/** Weiße Abschnitts-Karte: 16px Radius, Hairline, subtiler Schatten. */
const CARD: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  border: `1px solid ${HAIRLINE}`,
  boxShadow: "0 1px 2px rgba(23,23,23,0.06)",
  padding: "clamp(20px, 3vw, 28px)",
};

/** Ink-farbener Textlink mit dezentem Hover. */
const linkClass = "underline underline-offset-4 transition-opacity hover:opacity-70";
const linkStyle: React.CSSProperties = { color: INK_DEEP };

const SectionDivider = () => (
  <div aria-hidden className="my-10 md:my-14" style={{ borderTop: `1px solid ${HAIRLINE}` }} />
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h3
    style={{
      color: INK_DEEP,
    }}
  >
    {children}
  </h3>
);

const ChapterHeading = ({ children }: { children: React.ReactNode }) => (
  <h2
    style={{
      color: INK_DEEP,
      marginBottom: "32px",
    }}
  >
    {children}
  </h2>
);

const Impressum = () => {
  // Inhalte live aus dem CMS (Strapi); Fallback: statischer Content-Layer
  const impressum = useLocalized("impressum", IMPRESSUM_STATIC, impressumEn);
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  const { page, impressumSection: imp, datenschutzSection: ds } = impressum;

  return (
    <div className="min-h-screen" style={{ background: PAPER, fontFamily: OUTFIT }}>
      <SEOHead
        title={impressum.seo.title}
        description={impressum.seo.description}
        canonical={impressum.seo.canonical}
        noindex
      />
      <NoiseOverlay opacity={0.03} fixed zIndex={2} />
      <MobileNavigation onContactClick={() => {}} theme="dark" />

      {/* Main Content */}
      <main
        className="mx-auto px-6 lg:px-8"
        style={{ maxWidth: "820px", paddingTop: "clamp(120px, 14vh, 152px)", paddingBottom: "clamp(64px, 8vw, 100px)" }}
      >
        {/* Zurück zur Startseite */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ marginBottom: "clamp(32px, 5vw, 48px)" }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 transition-opacity hover:opacity-70"
            style={{
              fontFamily: OUTFIT,
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("legal.backToHome")}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: EASE }}
            style={{
              color: INK_DEEP,
            }}
          >
            {page.titleLine1}<br />
            {page.titleLine2}
          </motion.h1>

          <p
            style={{
              fontFamily: OUTFIT,
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: MUTED,
              marginBottom: "clamp(56px, 8vw, 80px)",
            }}
          >
            {page.stand}
          </p>

          {/* ═══════════════ IMPRESSUM ═══════════════ */}
          <section>
            <ChapterHeading>{imp.title}</ChapterHeading>

            {/* Angaben gemäß § 5 TMG */}
            <div className="mb-8">
              <SectionHeading>{imp.angaben.heading}</SectionHeading>
              <div style={CARD}>
                <p style={{ ...BODY, ...STRONG }}>{imp.angaben.company}</p>
                <p style={{ ...BODY, marginTop: "4px" }}>{imp.angaben.owner}</p>
                <p style={BODY}>{imp.angaben.country}</p>
                <p style={{ ...BODY, marginTop: "12px" }}>
                  {imp.angaben.emailLabel}{" "}
                  <a href={imp.angaben.email.href} className={linkClass} style={linkStyle}>
                    {imp.angaben.email.label}
                  </a>
                </p>
              </div>
            </div>

            <SectionDivider />

            {/* Geltungsbereich */}
            <div className="mb-8">
              <SectionHeading>{imp.geltungsbereich.heading}</SectionHeading>
              <p style={{ ...BODY, marginBottom: "12px" }}>
                {imp.geltungsbereich.intro}
              </p>
              <ul className="list-disc list-inside space-y-1" style={BODY}>
                {imp.geltungsbereich.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                      style={linkStyle}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <SectionDivider />

            {/* Haftungsbeschränkung */}
            <div className="mb-8">
              <SectionHeading>{imp.sections[0].heading}</SectionHeading>
              <div className="space-y-4" style={BODY}>
                {imp.sections[0].body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <SectionDivider />

            {/* Externe Links */}
            <div className="mb-8">
              <SectionHeading>{imp.sections[1].heading}</SectionHeading>
              <div className="space-y-4" style={BODY}>
                {imp.sections[1].body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <SectionDivider />

            {/* Urheberrecht */}
            <div>
              <SectionHeading>{imp.sections[2].heading}</SectionHeading>
              <div className="space-y-4" style={BODY}>
                {imp.sections[2].body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════ DATENSCHUTZ ═══════════════ */}
          <div aria-hidden className="my-16 md:my-24" style={{ borderTop: "2px solid rgba(23,23,23,0.22)" }} />

          <section id="datenschutz" style={{ scrollMarginTop: "96px" }}>
            <ChapterHeading>{ds.title}</ChapterHeading>

            {/* 1. Verantwortlicher */}
            <div className="mb-8">
              <SectionHeading>{ds.verantwortlicher.heading}</SectionHeading>
              <p style={{ ...BODY, marginBottom: "16px" }}>
                {ds.verantwortlicher.intro}
              </p>
              <div style={CARD}>
                {ds.verantwortlicher.address.map((line, i) => (
                  <p key={i} style={BODY}>{line}</p>
                ))}
                <p style={{ ...BODY, marginTop: "12px" }}>
                  {ds.verantwortlicher.emailLabel}{" "}
                  <a href={ds.verantwortlicher.email.href} className={linkClass} style={linkStyle}>
                    {ds.verantwortlicher.email.label}
                  </a>
                </p>
              </div>
            </div>

            <SectionDivider />

            {/* 2. Erhebung */}
            <div className="mb-8">
              <SectionHeading>{ds.erhebung.heading}</SectionHeading>
              <div className="space-y-4" style={BODY}>
                {ds.erhebung.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <SectionDivider />

            {/* 3. Server-Logfiles */}
            <div className="mb-8">
              <SectionHeading>{ds.serverLogfiles.heading}</SectionHeading>
              <p style={{ ...BODY, marginBottom: "16px" }}>
                {ds.serverLogfiles.intro}
              </p>
              <ul className="list-disc list-inside space-y-1" style={{ ...BODY, marginBottom: "16px" }}>
                {ds.serverLogfiles.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p style={{ ...BODY, marginBottom: "8px" }}>
                {ds.serverLogfiles.after1}
              </p>
              <p style={BODY}>
                {ds.serverLogfiles.after2}
              </p>
            </div>

            <SectionDivider />

            {/* 4. Kontaktaufnahme */}
            <div className="mb-8">
              <SectionHeading>{ds.kontaktaufnahme.heading}</SectionHeading>
              <div className="space-y-4" style={BODY}>
                {ds.kontaktaufnahme.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <SectionDivider />

            {/* 5. Meta Pixel */}
            <div className="mb-8">
              <SectionHeading>{ds.metaPixel.heading}</SectionHeading>
              <div className="space-y-4" style={BODY}>
                {ds.metaPixel.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <p>
                  {ds.metaPixel.moreInfoLabel}{" "}
                  <a
                    href={ds.metaPixel.moreInfoLink.href}
                    className={linkClass}
                    style={linkStyle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ds.metaPixel.moreInfoLink.label}
                  </a>
                </p>
              </div>
              <div style={{ ...CARD, marginTop: "16px" }}>
                <p style={{ ...BODY, ...STRONG, fontSize: "14px", marginBottom: "8px" }}>{ds.metaPixel.box.title}</p>
                <p style={BODY}>
                  {ds.metaPixel.box.body}
                </p>
              </div>
            </div>

            <SectionDivider />

            {/* 6. Google Tag Manager */}
            <div className="mb-8">
              <SectionHeading>{ds.googleTagManager.heading}</SectionHeading>
              <div className="space-y-4" style={BODY}>
                {ds.googleTagManager.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <div style={{ ...CARD, marginTop: "16px" }}>
                <p style={{ ...BODY, ...STRONG, fontSize: "14px", marginBottom: "8px" }}>{ds.googleTagManager.box.title}</p>
                <ul className="list-disc list-inside space-y-1" style={BODY}>
                  {ds.googleTagManager.box.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <p style={{ ...BODY, marginTop: "16px" }}>
                {ds.googleTagManager.moreInfoLabel}{" "}
                <a
                  href={ds.googleTagManager.moreInfoLink.href}
                  className={linkClass}
                  style={linkStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ds.googleTagManager.moreInfoLink.label}
                </a>
              </p>
            </div>

            <SectionDivider />

            {/* 7. Google Analytics */}
            <div className="mb-8">
              <SectionHeading>{ds.googleAnalytics.heading}</SectionHeading>
              <div className="space-y-4" style={BODY}>
                {ds.googleAnalytics.intro.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="mt-6 mb-6">
                <p style={{ ...BODY, ...STRONG, fontSize: "14px", marginBottom: "12px" }}>{ds.googleAnalytics.purpose.title}</p>
                <div className="space-y-2" style={BODY}>
                  {ds.googleAnalytics.purpose.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p style={{ ...BODY, ...STRONG, fontSize: "14px", marginBottom: "12px" }}>{ds.googleAnalytics.data.title}</p>
                <ul className="list-disc list-inside space-y-1" style={BODY}>
                  {ds.googleAnalytics.data.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div style={{ ...CARD, marginBottom: "16px" }}>
                <p style={{ ...BODY, ...STRONG, fontSize: "14px", marginBottom: "8px" }}>{ds.googleAnalytics.box.title}</p>
                <p style={BODY}>
                  {ds.googleAnalytics.box.body}
                </p>
              </div>

              <p style={BODY}>
                {ds.googleAnalytics.moreInfoLabel}{" "}
                <a
                  href={ds.googleAnalytics.moreInfoLink.href}
                  className={linkClass}
                  style={linkStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ds.googleAnalytics.moreInfoLink.label}
                </a>
              </p>
            </div>

            <SectionDivider />

            {/* 8. Cookies */}
            <div className="mb-8">
              <SectionHeading>{ds.cookies.heading}</SectionHeading>
              <p style={{ ...BODY, marginBottom: "16px" }}>
                {ds.cookies.intro}
              </p>

              <div className="mb-6">
                <p style={{ ...BODY, ...STRONG, fontSize: "14px", marginBottom: "12px" }}>{ds.cookies.types.title}</p>
                <ul className="list-disc list-inside space-y-2" style={BODY}>
                  {ds.cookies.types.items.map((item, i) => (
                    <li key={i}><span style={STRONG}>{item.term}</span>{item.rest}</li>
                  ))}
                </ul>
              </div>

              <div style={CARD}>
                <p style={{ ...BODY, ...STRONG, fontSize: "14px", marginBottom: "8px" }}>{ds.cookies.box.title}</p>
                <p style={BODY}>
                  {ds.cookies.box.body}
                </p>
              </div>
            </div>

            <SectionDivider />

            {/* 9. Ihre Rechte */}
            <div className="mb-8">
              <SectionHeading>{ds.rechte.heading}</SectionHeading>
              <p style={{ ...BODY, marginBottom: "16px" }}>
                {ds.rechte.intro}
              </p>
              <ul className="list-disc list-inside space-y-1" style={{ ...BODY, marginBottom: "16px" }}>
                {ds.rechte.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p style={BODY}>
                {ds.rechte.contactLabel}{" "}
                <a href={ds.rechte.email.href} className={linkClass} style={linkStyle}>
                  {ds.rechte.email.label}
                </a>
              </p>
            </div>

            <SectionDivider />

            {/* 10. Datensicherheit */}
            <div className="mb-8">
              <SectionHeading>{ds.datensicherheit.heading}</SectionHeading>
              <div className="space-y-4" style={BODY}>
                {ds.datensicherheit.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <SectionDivider />

            {/* 11. Änderungen */}
            <div className="mb-8">
              <SectionHeading>{ds.aenderungen.heading}</SectionHeading>
              <div className="space-y-4" style={BODY}>
                {ds.aenderungen.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <SectionDivider />

            {/* 12. Cookie-Consent */}
            <div>
              <SectionHeading>{ds.cookieConsent.heading}</SectionHeading>
              <p style={{ ...BODY, marginBottom: "16px" }}>
                {ds.cookieConsent.intro}
              </p>
              <div style={CARD}>
                <ul className="list-disc list-inside space-y-2" style={BODY}>
                  {ds.cookieConsent.box.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </motion.div>
      </main>

      <Suspense fallback={<div style={{ minHeight: 200 }} />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Impressum;
