/**
 * Page: Websites & Web-Plattformen  — Landing (Webentwicklung & Design)
 * --------------------------------------------------------------
 * Standalone-Landing (Struktur wie `pages/kiAudit.ts`): Hero, Showreel
 * (Video + Logo-Grid), Projektablauf (3 Schritte), Projekteinblicke
 * (Case-Karten) und Erstgespräch-CTA. Layout am Referenz-Design
 * orientiert, Optik in NEWEDGE-CI. Voice: Sie-Form (wie die
 * KI-Audit-Landing).
 * Bilder = vorhandene NEWEDGE-Assets (Platzhalter für echte Projekte,
 * im CMS austauschbar). Serialisierbar (nur Strings/Arrays) — CMS-tauglich.
 * Strapi-Mapping: Single Type `web-design`.
 * --------------------------------------------------------------
 */
import type { SEOContent } from "../types";
import type { ImageKey } from "../assets";

export const webDesign = {
  seo: {
    title: "Website für den Mittelstand entwickeln | NEWEDGE München",
    description:
      "NEWEDGE entwickelt individuelle Websites für den Mittelstand, die Ihnen qualifizierte Anfragen bringen — Strategie, Design und Entwicklung aus einer Hand.",
    canonical: "/websites",
  } satisfies SEOContent,

  /** HERO — hell, zentriert (Referenz-Layout), Violett-Akzent. */
  hero: {
    headlinePrefix: "Websites, die ",
    headlineAccent: "verkaufen",
    headlineSuffix: " — bevor Sie überhaupt sprechen.",
    sub: "Ihre Website ist Ihre erste Verkaufskraft. Wir bauen Auftritte, die Vertrauen schaffen und qualifizierte Anfragen bringen — nicht nur gut aussehen.",
    trustChips: ["Besucher werden Kunden", "Mehr qualifizierte Anfragen", "Ein Ansprechpartner"],
    ctaPrimary: "Erstgespräch anfragen",
    note: "100% kostenlos & unverbindlich.",
  },

  /** SHOWREEL — dunkle Karte mit Video-Facade + Logo-Grid + Founder-Avatar. */
  showreel: {
    logosHeading: "Wachsende Marken vertrauen NEWEDGE",
    videoCaption: "NEWEDGE — Projekte im Video",
    founder: { name: "Sebastian", role: "Co-Founder NEWEDGE", image: "team-sebastian" as ImageKey },
  },

  /** PROJEKTABLAUF — 3 Schritte. */
  prozess: {
    eyebrow: "In drei Schritten zur Website, die verkauft.",
    heading: "Der Projektablauf",
    steps: [
      {
        title: "Strategie & Branding",
        desc: "Wir definieren, wofür Sie stehen und für wen — und bauen ein visuelles System, das Ihre Qualität auf den ersten Blick zeigt.",
        image: "painpoint-a-vorher-nachher" as ImageKey,
      },
      {
        title: "Webdesign",
        desc: "Ein schnelles, individuelles Design, das Besucher überzeugt und gezielt zu Anfragen führt — nicht nur gefällt.",
        image: "albanova-website" as ImageKey,
      },
      {
        title: "Entwicklung",
        desc: "Sauber gebaut und wächst mit Ihnen mit: schnell, flexibel, leicht zu pflegen — am Ende gehört alles Ihnen, ohne Agentur-Abhängigkeit.",
        image: "painpoint-a-feature2" as ImageKey,
      },
    ],
    ctaPrimary: "Erstgespräch anfragen",
    note: "100% kostenlos & unverbindlich.",
  },

  /** PROJEKTEINBLICKE — Case-Karten (Logo + Text + Projekt-Visual). */
  cases: {
    eyebrow: "Projekte",
    heading: "Projekteinblicke",
    items: [
      {
        logo: "logo-albanova-consulting" as ImageKey,
        name: "AlbaNova Consulting",
        desc: "Von der Vision zur Marktpräsenz: neue Website und durchgängiger Markenauftritt — klar positioniert, hochwertig, auf Anfragen ausgerichtet.",
        imageDesktop: "albanova-website" as ImageKey,
        imagePhone: "pain-point-kundensupport-hero" as ImageKey,
      },
      {
        logo: "logo-elite-aesthetic" as ImageKey,
        name: "Elite Aesthetic",
        desc: "Ein digitaler Auftritt, der die Premium-Positionierung widerspiegelt — Design und Online-Buchung greifen ineinander und wirken sofort professionell.",
        imageDesktop: "pain-point-professional-services-hero" as ImageKey,
        imagePhone: "pain-point-health-care-hero" as ImageKey,
      },
      {
        logo: "logo-becoming-you" as ImageKey,
        name: "Becoming You",
        desc: "Eine Plattform, die mitwächst: individuelle Oberfläche, sauberes Fundament und ein System, das das Team selbst weiterpflegen kann.",
        imageDesktop: "painpoint-a-section3" as ImageKey,
        imagePhone: "pain-point-kpi-dashboard-hero" as ImageKey,
      },
    ],
  },

  /** ERSTGESPRÄCH — dunkle Abschluss-Sektion (Avatar → Heading → Sub → CTA → Logo-Cloud). */
  finalCta: {
    eyebrow: "Los geht's",
    heading: "Erstgespräch buchen",
    sub: "In einem kurzen Kennenlerngespräch schauen wir gemeinsam, ob und wo ein Projekt Sinn ergibt — auf Basis Ihrer Situation und Ziele.",
    ctaPrimary: "Erstgespräch anfragen",
    note: "100% kostenlos & unverbindlich.",
  },
} as const;
