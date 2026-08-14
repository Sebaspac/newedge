/**
 * Basis-URL des NEWEDGE Lead-Services (FastAPI — siehe apps/lead-api/).
 * --------------------------------------------------------------
 * Ein Service bedient beide Formulare, deshalb genügt EINE Env-Variable:
 *
 *   VITE_API_URL = https://newedgebrand.com     ← eigene Domain (Same-Origin)
 *
 * Seit der Zusammenlegung in einen Stack läuft der Lead-Service im selben
 * docker-compose wie das CMS (apps/cms/docker-compose.yml, Service "lead-api")
 * und hängt hinter demselben nginx: /contact, /roi-report und /abmelden/<token>
 * werden auf 127.0.0.1:8090 geproxied (apps/cms/deploy/nginx.conf).
 * Same-Origin heißt: kein CORS, kein Preflight, keine zweite Subdomain.
 *
 * Die Pfade sind bewusst OHNE Präfix geblieben — /abmelden/<token> steht so in
 * bereits versendeten Follow-up-Mails und darf sich nicht ändern.
 *
 * Leer = Test-Modus: Formulare zeigen lokal Erfolg, senden aber nicht.
 * Lokal echt testen: Lead-Container starten und VITE_API_URL=http://localhost:8081
 * setzen — der Vite-Dev-Proxy reicht die Pfade an :8090 weiter (vite.config.ts).
 * --------------------------------------------------------------
 */
const API_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? "").replace(/\/+$/, "");

/** Kontaktformular (/kontakt + ContactFormModal). Leer = Test-Modus. */
export const CONTACT_ENDPOINT = API_URL ? `${API_URL}/contact` : "";

/** ROI-Rechner: Lead + PDF-Report. Leer = Test-Modus. */
export const ROI_ENDPOINT = API_URL ? `${API_URL}/roi-report` : "";
