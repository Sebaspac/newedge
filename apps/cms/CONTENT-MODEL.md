# NEWEDGE — Strapi Content-Model (Migration aus `src/content/**`)

> **Rollout-Status (2026-07-08): ✅ VOLLSTÄNDIG migriert & geseedet.**
> Alle Seiten + Sections sind als Strapi-Single-Types angelegt, die
> Anwendungsfelder als `pain-point`-Collection. Generiert + geseedet über
> `scripts/gen-schemas.mjs` (aus dem Website-Content-JSON) + den env-gateten
> Seeder in `src/index.ts` (`SEED=1 npm run develop`, idempotent). Public-Read
> ist gesetzt; das Frontend liest live aus `/api/*` (Fallback bleibt aktiv,
> falls Strapi offline). Verschachtelte Strukturen sind als `json`-Felder
> modelliert (shape-erhaltend zu `fromStrapi`), einfache Leaf-Felder als
> `string`/`text`. Reservierte Keys (`id`/`type`/`default`) werden beim Seed zu
> `fieldId`/`fieldType`/`defaultLabel` umbenannt und vom Frontend zurückgemappt.
> Feineres Component-Modeling (statt `json`) kann später pro Typ nachgezogen
> werden, ohne den Frontend-Vertrag zu brechen.

Mapping der typisierten Content-Schicht der Website (`new-edge-website-ACTIVE/src/content/**`)
auf Strapi-5-Typen. Strukturprinzip:

- **`collections/`** (TS) → **Collection Types** (frei anlegbar)
- **`pages/`** (TS) → **Single Types** (je Seite ein Datensatz)
- **`sections/`** (TS) → **Single Types** (geteilte/seitenübergreifende Texte) bzw. Components
- geteilte Interfaces → **Components** (`shared.*`)
- Bilder (`ImageKey`) → **Media**-Felder · Icons (`IconName`) → **enum**/String-Feld

---

## ✅ Erledigt & build-verifiziert

### Collection Types (frei anlegbar)
| Strapi | Quelle | Felder |
|---|---|---|
| `testimonial` | `collections/testimonials.ts` | text (text), name, role, order |
| `job` | `collections/jobs.ts` | title, slug (uid), mailto, **tags** `shared.tag[]`, **sections** `shared.job-section[]`, order |
| `lead` | Lead-Service (FastAPI, POST `/api/leads`) | quelle (`roi`\|`kontakt`), name, email, telefon, firma, position, nachricht, leadId (unique), potenzialEur, payloadJson (json), eingegangenAm — `draftAndPublish: false` |

> ⚠️ **`lead` ist kein redaktioneller Typ, sondern ein Eingangskorb mit personen­bezogenen
> Daten.** Er wird ausschließlich vom Lead-Service befüllt (API-Token, Recht: nur `create`).
> **Niemals Public-Rechte vergeben** — der Typ steht bewusst nicht in `readActions` in
> `src/index.ts`. Primärablage bleiben `data/leads.jsonl` / `data/contacts.jsonl` im Service;
> das CMS ist die Zweitablage, damit das Team Leads ohne SSH sieht.

### Components (`shared.*`)
| Component | Felder |
|---|---|
| `shared.seo` | title, description, canonical, ogImage (media) |
| `shared.cta` | label, href |
| `shared.tag` | label |
| `shared.bullet` | text |
| `shared.job-section` | label, items `shared.bullet[]` |

> Build geprüft: `npx strapi ts:generate-types` (0 Fehler) + `npm run build` (✔). Im Admin (`npm run develop`) sofort bespielbar.

---

## 🔜 Single Types (Rollout — gleiches Muster)

Jede Seite/Section wird ein **Single Type** mit `seo: shared.seo` + ihren Feldern.
Empfehlung: pro Single Type die Felder 1:1 aus dem TS-Interface; verschachtelte Objekte →
`shared.*`-Components; Listen → repeatable Components.

### Seiten (`pages/*`)
`home`, `about`, `methodik`, `careers` (Chrome — Jobs bleiben Collection), `ki-audit`,
`ki-glossar` (terms → `shared.glossary-term[]`), `impressum`, `contact`, `mini-case-detail`,
`unsubscribe`, `not-found`, `pain-point-auswahlverfahren`.

### Sections (`sections/*`, geteilt/global)
`footer`, `nav` (Menüpunkte → `shared.nav-item[]` mit icon-enum), `testimonials-section`,
`hero`, `problem-journey`, `cortex`, `positioned-for-impact`, `horizontal-scroll`,
`three-steps-cta`, `impact-counter`, `embedded-ai`, `der-schnitt`, `ticker-scroll`,
`cookie-consent`, `client-logos`, `contact-form-modal`, `structured-data` (Org/FAQ),
`maschinenraum-ticker`, `new-edge-system`, `audit-sla-status`.

### Noch zu modellierende Components (Auszug)
`shared.icon-card` (icon-enum, title, desc), `shared.nav-item` (label, to, icon),
`shared.stat` (value, label, icon), `shared.glossary-term` (term, definition),
`shared.image-with-alt` (image media, alt), `shared.faq-entry` (question, answer).

### Komplexe Fälle
- **`pain-points`** (`painPoints.ts`, ~1700 Z.): pro Pain-Point/Branche viele Felder
  (hero, compare-table, feature-cards, mini-cases, faq …). Empfehlung: eigener
  **Collection Type `pain-point`** (frei pflegbar pro Slug) mit reichen Components,
  statt eines Single Types. Mini-Cases ggf. als Sub-Collection.
- **Icons**: `IconName`-Union als Strapi-**enumeration** (Werte = Keys aus `icons.tsx`).
- **Bilder**: `ImageKey` → Media-Feld; beim Seed die Dateien in die Media-Library laden.

---

## Rollout-Optionen für die Single Types
1. **Schema-Dateien generieren** (wie die Collections oben) — mechanisch, pro Typ
   `content-types/<name>/schema.json` + factory controller/route/service. Gut versionierbar.
2. **Strapi Content-Type Builder (Admin-UI)** — schneller für einmalige Single Types,
   schreibt dieselben schema.json.

Nach jedem Hinzufügen: `npx strapi ts:generate-types` → `npm run build` (grün halten).
