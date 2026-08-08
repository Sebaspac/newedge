/**
 * Section-Text: Was auf der Infrastruktur läuft (Startseite)
 * --------------------------------------------------------------
 * Folge-Modul zur lokalen Infrastruktur (`sections/cortex.ts`):
 * Steht das Fundament, entstehen darauf die eigentlichen Anwendungen —
 * Firmen-GPT, KI-Agenten, automatisierte Prozesse, zentrale Dashboards,
 * interne Projekte und auf Wunsch ein eigenes White-Label-KI-Angebot.
 *
 * Produkt-Treppe: Phasen 4–6 (Automatisierung → Embedded AI →
 * digitale Arbeitskräfte). Bewusst NACH dem Infrastruktur-Modul —
 * erst das Fundament, dann was darauf läuft.
 *
 * Reiner Text (CMS-tauglich: nur Strings/Arrays). Icons werden in der
 * Komponente über den `icon`-Key aufgelöst.
 * Noch NICHT als Strapi-Feld angelegt (statischer Fallback greift).
 * --------------------------------------------------------------
 */

/** Eine Anwendung, die auf der lokalen Infrastruktur aufsetzt. */
export interface BuiltOnTopItem {
  /** Icon-Key — wird in der Komponente auf ein Tabler-Icon gemappt. */
  icon: "chat" | "agent" | "process" | "dashboard" | "project" | "whitelabel";
  title: string;
  desc: string;
}

export const builtOnTop = {
  /** Section-`aria-label`. */
  ariaLabel: "Anwendungen, die auf Ihrer lokalen KI-Infrastruktur laufen",

  eyebrow: "Darauf aufgebaut",
  heading: "Steht das Fundament, wird es konkret.",
  subtitle:
    "Auf Ihrer Infrastruktur entstehen die Anwendungen, die im Alltag den Unterschied machen — von der eigenen Chat-Lösung bis zur digitalen Arbeitskraft.",

  items: [
    {
      icon: "chat",
      title: "Ihr eigenes Firmen-GPT",
      desc: "Ein Chat, der Ihr Unternehmen kennt: Ihre Dokumente, Ihre Prozesse, Ihre Sprache. Für alle Mitarbeiter — ohne dass Firmenwissen nach außen gelangt.",
    },
    {
      icon: "agent",
      title: "KI-Agenten, die mitarbeiten",
      desc: "Digitale Arbeitskräfte übernehmen wiederkehrende Aufgaben vollständig. Nicht als Assistent, der zuarbeitet — sondern als Erledigung.",
    },
    {
      icon: "process",
      title: "Prozesse, die von selbst laufen",
      desc: "Angebote, Rechnungen, Dokumentenprüfung: Was heute Hände bindet, läuft automatisch durch — und meldet sich nur, wenn etwas abweicht.",
    },
    {
      icon: "dashboard",
      title: "Ihre Zahlen an einem Ort",
      desc: "Zentrale Dashboards führen zusammen, was heute in ERP, CRM und Excel verstreut liegt. Tagesaktuell statt Wochenrückblick.",
    },
    {
      icon: "project",
      title: "Interne Projekte, gemeinsam umgesetzt",
      desc: "Was Ihr Betrieb speziell braucht, bauen wir darauf auf — vom Prototyp bis in den laufenden Betrieb.",
    },
    {
      icon: "whitelabel",
      title: "Ihr eigenes KI-Angebot",
      desc: "Auf Wunsch als White Label: Sie bieten Ihren Kunden KI-Leistungen unter eigenem Namen an — wir bleiben im Maschinenraum.",
    },
  ] as BuiltOnTopItem[],

  /** Text-Button (scrollt zur CTA-Section). */
  cta: "Möglichkeiten besprechen →",
};
