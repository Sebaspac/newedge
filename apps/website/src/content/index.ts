/**
 * Content-Layer — zentrales Import-Surface
 * --------------------------------------------------------------
 * Single Source of Truth für alle Inhalte (Text, Bilder, Icons).
 * Komponenten importieren ausschließlich von hier:
 *
 *     import { testimonials, img, Icon } from "@/content";
 *
 * Struktur bildet 1:1 ein Headless-CMS (Strapi) ab:
 *   • assets/icons  → Media-Library + Icon-Enumeration
 *   • collections/* → Collection Types (anlegbar: testimonials, jobs)
 *   • pages/*       → Single Types (je Seite ein Datensatz)
 *   • sections/*    → geteilte Section-/UI-Texte
 * --------------------------------------------------------------
 */

// Foundation
export * from "./types";
export * from "./assets";
export * from "./icons";

// Collections (anlegbar)
export * from "./collections/testimonials";
export * from "./collections/jobs";

// Pages (Single Types) — named exports vermeiden Interface-Namenskollisionen
export { home } from "./pages/home";
export { about } from "./pages/about";
export { methodik } from "./pages/methodik";
export { careers } from "./pages/careers";
export { kiAudit } from "./pages/kiAudit";
export { kiGlossar } from "./pages/kiGlossar";
export { impressum } from "./pages/impressum";
export { painPointPage } from "./pages/painPointAuswahlverfahren";
export { miniCaseDetail } from "./pages/miniCaseDetail";
export { contact } from "./pages/contact";
export { notFound } from "./pages/notFound";

// Sections (geteilte Texte)
export * from "./sections/testimonials";
export * from "./sections/footer";
export * from "./sections/nav";
export { hero } from "./sections/hero";
export { problemJourney } from "./sections/problemJourney";
export { cortex } from "./sections/cortex";
export { positionedForImpact } from "./sections/positionedForImpact";
export { horizontalScroll } from "./sections/horizontalScroll";
export { threeStepsCTA } from "./sections/threeStepsCTA";
export { impactCounter } from "./sections/impactCounter";
export { embeddedAI } from "./sections/embeddedAI";
export { derSchnitt } from "./sections/derSchnitt";
export { tickerScroll } from "./sections/tickerScroll";
export { clientLogos, clientLogosHeading } from "./sections/clientLogos";
export { contactFormModal } from "./sections/contactFormModal";
export { structuredData } from "./sections/structuredData";
export { maschinenraumTicker } from "./sections/maschinenraumTicker";
export { newEdgeSystem } from "./sections/newEdgeSystem";
export { auditSlaStatus } from "./sections/auditSlaStatus";
export { videoShowcase } from "./sections/videoShowcase";
export { caseSpotlight } from "./sections/caseSpotlight";
export { statementStats } from "./sections/statementStats";
export { diamondModel } from "./sections/diamondModel";
export { teamSupport } from "./sections/teamSupport";
export { aiVoices } from "./sections/aiVoices";
