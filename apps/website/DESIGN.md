---
name: NEWEDGE
description: Rebrush 2026 — helles Papier, ein Lime als Fläche, Ink als Stimme, Flash als Textakzent. Weiche runde Karten, Outfit überall. Dapta-inspirierte Kompositionen mit Marken-Riss.
colors:
  lime: "#CCFF00"
  ink: "#171717"
  paper: "#F2F2F2"
  flash: "#FF1E00"
  white: "#FFFFFF"
  ink-soft: "#3C3C3C"
  ink-muted: "#5E5E5A"
  ink-deep: "#101010"
  ink-raise: "#1F1F1F"
  error: "#B91C1C"
  success: "#15803D"
  lime-soft: "rgba(204,255,0,0.45)"
  hairline: "rgba(23,23,23,0.14)"
  ink-secondary: "rgba(23,23,23,0.68)"
typography:
  h1:
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "var(--font-h1)  /* 32px mobile → 56px desktop, Stufen via CSS-Vars in index.css */"
    fontWeight: 800
    lineHeight: "var(--lh-heading)"
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "'Outfit', sans-serif"
    fontSize: "var(--font-h2)  /* 28px mobile → 40px desktop */"
    fontWeight: 700
    letterSpacing: "-0.015em"
  h3:
    fontFamily: "'Outfit', sans-serif"
    fontSize: "var(--font-h3)  /* 22px mobile → 28px desktop */"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "'Outfit', sans-serif"
    fontSize: "var(--font-body)  /* 16px mobile → 18px desktop */"
    fontWeight: 400
    lineHeight: "var(--lh-body)"
  label:
    fontFamily: "'Outfit', sans-serif"
    fontSize: "13px"
    fontWeight: 700
    letterSpacing: "0.08em"
    textTransform: "uppercase"
rounded:
  card: "16px"
  cardLarge: "20px"
  canvas: "24px – 40px (Hero-Bühnen)"
  pill: "999px"
spacing:
  section: "clamp(56px, 7vw, 96px)"
  sectionLarge: "clamp(64px, 8vw, 100px)"
  cardPadding: "20px – 34px"
components:
  button-primary:
    name: "EdgePillButton (src/components/ui/EdgeCta.tsx)"
    shape: "Pill (999px), Label + Lime-Pfeil-Kreis rechts"
    backgroundColor: "Ink-Verlauf linear-gradient(160deg,#1F1F1F,#171717 45%,#101010); Varianten: ink, lime, frost"
    hover: "Lime-Overlay + Mini-EdgeRip; scale 1.03"
  button-secondary:
    name: "EdgeTextButton"
    shape: "nur Label + Pfeil, transparent, Lime-Unterstrich (.edge-underline); tone=light auf dunklen Flächen"
  card:
    backgroundColor: "{colors.white}"
    border: "1px solid {colors.hairline}"
    rounded: "16px"
    shadow: "0 1px 2px rgba(23,23,23,0.06)  /* Feature-Karten größer, aber weich */"
  nav:
    name: "MobileNavigation — schwebende weiße Pill, fixed, schrumpft beim Scroll"
---

# Design System: NEWEDGE (Rebrush 2026)

> Dieses Dokument beschreibt das SHIPPENDE System (Stand 2026-07). Die frühere
> violette CI (`#5658DF` / `#8476EF` / Paper `#F8F5FF`) ist abgelöst und darf
> nicht mehr referenziert werden — ebenso das noch ältere „Ink & Edge"-System
> (DM Serif Display, Consolas, 0-Radius).
> Vollständige Farbreferenz mit Kontrastwerten und Verboten:
> `FARBPALETTE.md` (Repo-Wurzel). Bei Widerspruch gewinnt FARBPALETTE.md.
> Copy-Regeln: `.claude/brand-voice-guidelines.md` (bindend, Sie-Form; Careers Du).

## 1. Overview

**Creative North Star: „Helles Papier, ein Lime, weiche Präzision."**

Die Website steht auf einem hellgrauen Papierton (`#F2F2F2`), auf dem weiße,
weich gerundete Karten und ein einziges Signal-Lime (`#CCFF00`) arbeiten.
Referenz-Ästhetik sind Dapta-artige SaaS-Kompositionen — große abgerundete
Bühnen, schwebende App-Fenster, Stat-Kreise — kombiniert mit dem Marken-Detail
des „Edge-Risses" (`EdgeRip`): ein kleiner Papier-Riss an Kanten und Bildern.

Die zentrale Regel des Systems: **Lime ist eine Fläche, keine Stimme.**
Auf Papier hat Lime 1,05:1 Kontrast — als Text dort schlicht unsichtbar.
Wo ein Akzent *sprechen* muss (Wort in der Headline, Nav-Hover, Eyebrow),
spricht `#FF1E00` Flash. Wo er *tragen* muss (CTA-Füllung, Badge, Wash,
Marker-Strich), trägt Lime — und die Schrift darauf ist immer Ink.

- **Alle Heroes sind hell** (Papier + dezenter Lime-Wash von oben,
  `radial-gradient(… rgba(204,255,0,0.10) …)`). Dunkle Flächen gibt es nur
  noch als bewusste Mid-Page-Momente (Video-Showcase, Garantie, Kontakt-CTA,
  Zitat-Karten).
- **Eine Schrift:** Outfit, für alles. Gewicht macht die Hierarchie
  (800 H1 / 700 H2-H3 / 400–600 Body/Labels).
- **Keine Hero-Eyebrows.** Subpage-Heroes öffnen direkt mit der H1
  (nur der Homepage-Hero behält sein Greeting). Sektions-Eyebrows
  (Label-Stil, Flash) sind weiterhin erlaubt.

## 2. Farben

Elf Hex-Werte, mehr nicht. Details, RGB/HSL und die vollständigen Verbote
stehen in `FARBPALETTE.md`; hier die Arbeitsfassung.

### Kern

- **Lime `#CCFF00`** — die eine Fläche: CTA-Füllung, Badges, Nummern-Kreise,
  Marker-Strich (`.edge-mark`), Struktur-Washes, aktive Zustände. Als *Text*
  nur auf Ink/dunkel. **Nie Text auf hellem Grund. Nie Seitenhintergrund.**
- **Ink `#171717`** — Headlines, Icons, dunkle Sektionsflächen und Basis
  aller abgeleiteten rgba-Werte. Nie `#000`.
- **Paper `#F2F2F2`** — globaler Seitenton (auch als `--background`-Token);
  gleichzeitig die Textfarbe auf Ink-Flächen.
- **Flash `#FF1E00`** — Textakzent auf hell: Akzent-Wörter in Headlines
  (per `withAccent`, sprachbewusst DE/EN), Link-/Nav-Hover, Eyebrow-Akzent.
  3,45:1 → **nur Large Text** (≥ 24 px bzw. ≥ 18,7 px bold) und Grafik.
  Kein Statusrot (das ist `error`), keine großflächige Fläche.

### Stütz-Töne

- **White `#FFFFFF`** — Karten/erhöhte Flächen auf Paper, Text auf Ink.
- **Ink Soft `#3C3C3C`** — Fließtext auf hell (9,9:1). Sekundärtext:
  `rgba(23,23,23,0.68)`.
- **Ink Muted `#5E5E5A`** — Meta, Labels, Captions, Sub-Zeilen (5,8:1).
- **Ink Deep `#101010`** — nur unterer Gradient-Stop und tiefste Fläche.
- **Ink Raise `#1F1F1F`** — ausschließlich oberer Stop des Ink-Verlaufs.

### Status

- **Error `#B91C1C`** — Formularfehler, negative Vergleichs-Icons.
- **Success `#15803D`** — Erfolgsmeldung, positive Vergleichs-Icons.

### Abgeleitete Ink-Alphas (sechs Stufen, keine Zwischenwerte erfinden)

| Token | Wert | Rolle |
|---|---|---|
| `--ne-ink-06` | `rgba(23,23,23,0.06)` | Wash, Zebra-Zeilen, Hover-Fläche |
| `--ne-hairline` | `rgba(23,23,23,0.14)` | Standard-Border/Divider/Card-Rand |
| `--ne-hairline-strong` | `rgba(23,23,23,0.22)` | aktive/hover-Border |
| `--ne-ink-quiet` | `rgba(23,23,23,0.45)` | Deko-Icons, Zahlen-Ghosts — **kein Fließtext** |
| `--ne-ink-secondary` | `rgba(23,23,23,0.68)` | Sekundärtext auf Paper |
| `--ne-scrim` | `rgba(23,23,23,0.92)` | Modal-Backdrop, Overlay |

Für dunkle Flächen gilt dieselbe Leiter auf `rgba(255,255,255,…)`,
für Lime-Washes dieselbe Leiter auf `rgba(204,255,0,…)`.

### Verläufe (die einzigen erlaubten)

- **Ink-Verlauf** (Primär-Pill, Footer, Nav-Pill, Ticker, dunkle Bühnen):
  `linear-gradient(160deg,#1F1F1F 0%,#171717 45%,#101010 100%)`
  → Token `--ne-ink-gradient` / `bg-gradient-ne-ink`.
  Richtungsvarianten 120deg/150deg sind erlaubt, die Stops nicht.
- **Lime-Verlauf** (Lime-Flächen mit Tiefe, z. B. Statement-Stats):
  `linear-gradient(120deg,#CCFF00 0%,#D9F53A 45%,#CCFF00 100%)`
  → `--ne-lime-gradient` / `bg-gradient-ne-lime`.
- **Showcase-Verlauf** Ink → Lime (Case-/Video-/ROI-Karten):
  `linear-gradient(150deg,#171717 0%,#333A00 45%,#CCFF00 100%)`
  → `--ne-showcase-gradient` / `bg-gradient-ne-showcase`.
  `#D9F53A` und `#333A00` sind **Verlaufs-Stützpunkte**, keine eigenständigen
  Palettenfarben — nie flächig oder als Text verwenden.
- **Bild-Scrim** (Text auf Foto): `linear-gradient(180deg,rgba(16,16,16,0) 55%,rgba(16,16,16,0.92) 100%)`.

Alles andere ist ein neuer Verlauf und damit verboten.

## 3. Typografie

Global über CSS-Variablen in `src/index.css` (`--font-h1…--font-body`,
responsive Stufen mobile/tablet/desktop). Komponenten setzen KEINE eigenen
H-Größen, außer bewusst kompaktere Karten (dann explizit, z. B. Case-Karten
19px). Kompositum-Bindestriche in Headlines non-breaking (`‑`).

## 4. Flächen & Tiefe

- Karten: weiß, Hairline-Border (`rgba(23,23,23,0.14)`), **weiche** Schatten
  (klein `0 1px 2px rgba(23,23,23,0.06)` = `--ne-shadow-card`, Feature-Karten
  bis `0 24px 56px -18px rgba(23,23,23,0.18)` = `--ne-shadow-lift`).
  Beide Schatten zentral als Token nutzen, nicht inline duplizieren.
- Radius-Sprache: 16px Karten, 20–24px große Karten/Bühnen, 40px Hero-Canvas,
  999px Pills. **Kein 0-Radius mehr.**
- `NoiseOverlay` (0.03) liegt seitenweit als Körnung.
- `JaggedDivider` + `EdgeRip` sind die Marken-Übergänge/-Risse.
- Fokus: Ink-Ring (2px, Offset 2) + Lime-Halo (6px). Der Ink-Ring trägt hell,
  der Lime-Halo trägt dunkel — zusammen sichtbar auf beiden Gründen.
- Textmarkierung (`::selection`): Lime-Fläche, Ink-Schrift.

## 5. Komponenten (Quelle der Wahrheit im Code)

- **EdgeCta** (`ui/EdgeCta.tsx`): `EdgePillButton` (primär; Varianten ink /
  lime / frost) + `EdgeTextButton` (sekundär, Lime-Unterstrich). Interne
  `href="/…"` werden automatisch lokalisiert (LocaleLink).
- **MitStudyGrid** (`ui/MitStudyGrid.tsx`): „5/100"-MIT-Studien-Grafik
  (10×10-Raster, 5 in Lime), Varianten voll/compact — Methodik-Intro,
  Homepage-Prozess, KI-Audit/Cortex-Intros. Identische Grafik überall.
- **MobileNavigation**: schwebende weiße Pill, Logo aus `nav.logo.src`,
  Nav-Hover in Flash (`ui/menu-vertical.tsx`).
- **SpeakWithUsCta / ThreeStepsCTA / FloatingConsultButton**: Abschluss-CTAs;
  ThreeSteps nutzt Scroll-Pin (Desktop) bzw. gepinntes Karten-Cycling (Mobile).
- **CaseSpotlight / VideoShowcase**: teilen den Showcase-Verlauf (Ink → Lime);
  Videos als **natives YouTube-iframe** (keine Custom-Facades).
- **Bilder:** ausnahmslos über den Content-Layer (`img(key)`-Resolver,
  Registry in `src/content/assets.ts`); CMS-Upload-URLs werden durchgereicht.
  Nie Bild-Keys in Komponenten hartcodieren.

## 6. Layout-Regeln

- **Mobile-Bildreihenfolge:** Inhaltsmodule = Bild → Überschrift → Text;
  Ausnahmen (CTA, Video, Case) = Titel → Text → Bild. Desktop unberührt
  (responsive `order-*` am Spalten-Breakpoint des Moduls).
- Zweispaltige Intro-/Feature-Module gern 60/40 (`lg:grid-cols-[3fr_2fr]`).
- Statement-Callout: Lime-Akzentkante (3px) + H2 + Text
  (Definition-Layout; Methodik-/Careers-Intro).
- Sprachen: DE (`/`) + EN (`/en`), ein Routen-Set; Inhalte aus
  `src/content/**` (DE) / `src/content/en/**` (EN) bzw. Strapi-CMS
  (`<type>` / `<type>-en`).

## 7. Motion

- framer-motion `whileInView` (y: 16–24, once, margin -60px),
  EASE `[0.22, 1, 0.36, 1]`.
- GSAP nur für die horizontale Scroll-Strecke (Homepage) + ThreeSteps-Pin.
- `prefers-reduced-motion` respektieren (Hero-Puls etc. deaktivieren).

## 8. Do / Don't

**Do:** ein Lime-Akzent pro Modul · Flash für sprechende Textakzente ·
Ink für Schrift und Tiefe · weiche Schatten · Outfit-Gewichte für Hierarchie ·
Zahlen als Beweis zuerst · Sie-Form · Mobile-Bildreihenfolge einhalten ·
Bilder nur über den Content-Layer.

**Don't:** **Lime als Textfarbe auf hellem Grund** · Lime als Seitenhintergrund ·
Flash für Statusmeldungen oder als große Fläche · Violett/Lila in jeder Form
(Alt-CI) · dunkle Heroes · 0-Radius/scharfe Kanten · DM Serif/Consolas/Inter ·
Hero-Eyebrows auf Subpages · Custom-Video-Facades · neue Verläufe oder neue
rgba-Alphas erfinden · `#000`/`#fff` als Text-/Flächenfarbe (dafür Ink/White) ·
Bild-Keys oder Texte in Komponenten hartcodieren (Content-Layer!) ·
Buzzwords (siehe Brand-Voice-Guidelines).
