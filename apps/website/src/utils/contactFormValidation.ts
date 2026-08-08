import { z } from 'zod';
import { CONTACT_ENDPOINT } from './apiConfig';

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_SUBMISSIONS_PER_WINDOW = 1;
let lastSubmissionTime = 0;
let submissionCount = 0;

// Contact form validation schema — 3 fields only
export const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "Name muss mindestens 2 Zeichen lang sein" })
    .max(120, { message: "Name darf maximal 120 Zeichen lang sein" }),
  email: z.string()
    .trim()
    .email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein" })
    .max(200, { message: "E-Mail darf maximal 200 Zeichen lang sein" }),
  phone: z.string().trim().max(30, { message: "Telefon darf maximal 30 Zeichen lang sein" }).optional().or(z.literal('')),
  company: z.string().trim().max(120, { message: "Firma darf maximal 120 Zeichen lang sein" }).optional().or(z.literal('')),
  position: z.string().trim().max(120, { message: "Position darf maximal 120 Zeichen lang sein" }).optional().or(z.literal('')),
  message: z.string()
    .trim()
    .min(10, { message: "Nachricht muss mindestens 10 Zeichen lang sein" })
    .max(5000, { message: "Nachricht darf maximal 5000 Zeichen lang sein" }),
  // DSGVO Art. 6 Abs. 1 lit. a — Einwilligung ist Pflicht, der Server prüft sie ebenfalls
  consent: z.literal(true, {
    errorMap: () => ({ message: "Bitte stimmen Sie der Verarbeitung Ihrer Daten zu" }),
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export function checkRateLimit(): { allowed: boolean; error?: string } {
  const now = Date.now();
  if (now - lastSubmissionTime > RATE_LIMIT_WINDOW_MS) {
    submissionCount = 0;
  }
  if (submissionCount >= MAX_SUBMISSIONS_PER_WINDOW) {
    const remainingSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastSubmissionTime)) / 1000);
    return { allowed: false, error: `Bitte warten Sie ${remainingSeconds} Sekunden, bevor Sie erneut senden.` };
  }
  return { allowed: true };
}

export function recordSubmission(): void {
  lastSubmissionTime = Date.now();
  submissionCount++;
}

export function isHoneypotTriggered(honeypotValue: string | undefined): boolean {
  return !!honeypotValue && honeypotValue.trim().length > 0;
}

// Validate and return per-field errors
export function validateContactForm(data: Record<string, unknown>): {
  success: boolean;
  data?: ContactFormData;
  fieldErrors?: Record<string, string>;
} {
  try {
    const validated = contactFormSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.errors) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      return { success: false, fieldErrors };
    }
    return { success: false, fieldErrors: { _form: "Ein unerwarteter Fehler ist aufgetreten" } };
  }
}

/** Fehlertexte des Services (server.py) → verständliche deutsche Meldung. */
const SERVER_ERRORS: Record<string, string> = {
  rate_limited: "Zu viele Anfragen. Bitte versuchen Sie es in ein paar Minuten erneut.",
  invalid_email: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  invalid_fields: "Bitte prüfen Sie Ihre Eingaben.",
  consent_required: "Bitte stimmen Sie der Verarbeitung Ihrer Daten zu.",
};

/**
 * Sendet die Anfrage an den NEWEDGE Lead-Service (VPS).
 * Ohne konfigurierte `VITE_API_URL` läuft die Funktion im Test-Modus:
 * sie meldet Erfolg, sendet aber nichts (nur für lokale Entwicklung).
 */
export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  if (!CONTACT_ENDPOINT) {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true };
  }

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        position: data.position || null,
        message: data.message,
        consent: data.consent,
        sourcePage: typeof window !== 'undefined' ? window.location.pathname : null,
      }),
    });

    const result = await response.json().catch(() => ({} as { success?: boolean; error?: string }));

    if (response.ok && result.success) {
      return { success: true };
    }

    return {
      success: false,
      error: SERVER_ERRORS[result.error as string] || "Senden fehlgeschlagen. Bitte versuchen Sie es erneut oder schreiben Sie an info@newedgebrand.com.",
    };
  } catch {
    return { success: false, error: "Verbindungsfehler. Bitte erneut versuchen oder schreiben Sie an info@newedgebrand.com." };
  }
}
