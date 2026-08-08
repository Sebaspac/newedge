/**
 * Section-Text: Kontakt-Formular-Modal (ContactFormModal)
 * --------------------------------------------------------------
 * Wiederverwendbares Kontakt-Dialog-Modal (Pain-Point-/Lösungsseiten).
 * Enthält Titel, Beschreibung, Feld-Labels/Placeholder, Honeypot-Text,
 * Button-Beschriftungen sowie alle Inline-/Toast-Statusmeldungen.
 *
 * Hinweis: Die Felder sind als typisiertes Array modelliert; Render-Logik,
 * Validierung, Submit-Handler und `name`-Attribute bleiben in der Komponente.
 *
 * ACHTUNG (Überschneidung): `pages/home.ts` besitzt einen eigenen
 * `contact`-Block für das Kontakt-Sheet der Index-Seite. Das ist eine
 * SEPARATE Sache mit eigenem Wortlaut — bewusst NICHT wiederverwendet.
 *
 * Strapi-Mapping: Single Type `contact-form-modal` (bzw. Teil von „globals").
 * --------------------------------------------------------------
 */

/** Einzelnes Formularfeld (Input/Textarea). `name` = Datenschlüssel (Logik). */
export interface ContactModalField {
  name: string;
  label: string;
  placeholder: string;
}

export const contactFormModal = {
  header: {
    title: "Get in touch!",
    description: "Tell us about your project – we'll get back to you shortly",
  },

  /** Versteckter Honeypot (Spam-Schutz, optisch ausgeblendet). */
  honeypot: {
    label: "Website URL (leave empty)",
  },

  fields: {
    name: { name: "name", label: "Name *", placeholder: "Your name" },
    email: { name: "email", label: "Email *", placeholder: "your@email.com" },
    phone: { name: "phone", label: "Phone", placeholder: "+49 123 456789" },
    company: { name: "company", label: "Company", placeholder: "Your company" },
    position: { name: "position", label: "Position", placeholder: "Your position" },
    message: {
      name: "message",
      label: "Message *",
      placeholder: "Tell us about your project...",
    },
  } satisfies Record<string, ContactModalField>,

  /** Pflicht-Einwilligung (DSGVO Art. 6 Abs. 1 lit. a) — Text vor, Link, Text nach. */
  consent: {
    before: "I agree that my details may be processed to handle my enquiry. Details in the ",
    linkLabel: "privacy policy",
    linkHref: "/impressum#datenschutz",
    after: ". This consent can be withdrawn at any time.",
  },

  submit: {
    idle: "Send message",
    submitting: "Sending...",
  },

  /** Inline-/Toast-Statusmeldungen nach Submit. */
  messages: {
    honeypotSuccess: "Message sent! We'll be in touch soon.",
    slaSuccess: "Audit accepted. The 24-hour clock is running — you can track the status on this page.",
    success: "Message sent! We'll be in touch soon.",
    errorFallback: "Something went wrong.",
  },
} as const;
