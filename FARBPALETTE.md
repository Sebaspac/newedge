# NEWEDGE — Farbpalette

Kanonische Farbreferenz der Marke (Brandboard 2026-07). Dieses Dokument ist
die **Quelle der Wahrheit für Farbe**. Bei Widerspruch zu `DESIGN.md`,
Komponenten-Kommentaren oder Altbeständen gewinnt dieses Dokument.

Implementiert als CSS-Variablen in `apps/website/src/index.css` (`--ne-*`),
als Tailwind-Farben in `apps/website/tailwind.config.ts` (`ne.*`, z. B.
`bg-ne-lime`, `text-ne-ink`, `border-ne-hairline`).

> **Die eine Regel, die alles trägt:**
> **Lime ist eine Fläche, keine Stimme.**
> `#CCFF00` auf `#F2F2F2` hat **1,05:1** — als Text auf hellem Grund unsichtbar.
> Wo ein Akzent sprechen muss, spricht **Flash `#FF1E00`**.
> Text *auf* Lime ist immer **Ink `#171717`** (15,3:1).

---

## Überblick

| Name | Hex | Rolle in einem Satz | Kontrast auf Paper |
|---|---|---|---|
| **Lime** | `#CCFF00` | Die eine Fläche: CTA, Badge, Marker, Wash | 1,05:1 — nie Text |
| **Ink** | `#171717` | Schrift, Icons, dunkle Flächen, Basis aller Alphas | 16,0:1 |
| **Paper** | `#F2F2F2` | Seitenhintergrund; Schrift auf Ink | — |
| **Flash** | `#FF1E00` | Textakzent + Hover auf hell | 3,45:1 — nur Large Text |
| **White** | `#FFFFFF` | Karten auf Paper, Schrift auf Ink | — |
| **Ink Soft** | `#3C3C3C` | Fließtext auf hell | 9,9:1 |
| **Ink Muted** | `#5E5E5A` | Meta, Labels, Captions | 5,8:1 |
| **Ink Deep** | `#101010` | Nur Verlaufs-Endpunkt + tiefste Fläche | 17,0:1 |
| **Ink Raise** | `#1F1F1F` | Nur Verlaufs-Startpunkt | 14,7:1 |
| **Error** | `#B91C1C` | Formularfehler, negative Icons | 5,8:1 |
| **Success** | `#15803D` | Erfolgsmeldung, positive Icons | 4,48:1 — s. u. |

Elf Werte. Kein zwölfter. Wer eine neue Farbe braucht, braucht in Wahrheit
eine andere Alpha-Stufe (→ [Abgeleitete Werte](#abgeleitete-werte)) oder
einen der drei Verläufe (→ [Verläufe](#verläufe)).

---

## Kern (4)

### Lime — `#CCFF00`

| | |
|---|---|
| RGB | `rgb(204, 255, 0)` |
| HSL | `hsl(72, 100%, 50%)` |
| Token | `--ne-lime` · `bg-ne-lime` · shadcn `--accent` |
| Kontrast | auf Ink **15,3:1** · auf White 1,18:1 · auf Paper **1,05:1** |

**Verwendung.** Vollflächige CTA-Füllung, Badges und Nummern-Kreise, der
handgemalte Marker-Strich (`.edge-mark`, `.edge-underline`), Struktur-Washes
und Glows, aktive Zustände, Pfeil-Kreise in Pill-Buttons, Akzentkanten.
Als *Textfarbe* ausschließlich auf Ink oder dunklen Flächen.

**Verboten.**
- **Nie als Textfarbe auf hellem Grund** (Paper, White, hellen Karten) —
  1,05:1 bzw. 1,18:1. Dort gehört **Flash** hin.
- Nie als Seitenhintergrund. Lime ist ein Signal, kein Grundton.
- Nie in Kombination mit weißer Schrift (1,18:1). Schrift auf Lime = Ink.
- Nicht in shadcn-`--primary` legen: dieses Token wird immer mit weißem
  `--primary-foreground` gepaart.

### Ink — `#171717`

| | |
|---|---|
| RGB | `rgb(23, 23, 23)` |
| HSL | `hsl(0, 0%, 9%)` |
| Token | `--ne-ink` · `bg-ne-ink` / `text-ne-ink` · shadcn `--primary`, `--ring`, `--card-foreground` |
| Kontrast | auf Paper **16,0:1** · auf White 17,9:1 · auf Lime **15,3:1** |

**Verwendung.** Headlines, Icons, dunkle Sektionsflächen und Karten,
Fokusring, Primär-Buttons (mit weißer Schrift), und die Basis **aller**
abgeleiteten rgba-Werte.

**Verboten.**
- Nicht als Fließtext-Grau — dafür `ink-soft` (Ink ist für Headlines).
- Nicht auf dunklen Flächen (Ink auf Ink).
- Nie `#000` statt Ink. Reines Schwarz kommt in der Marke nicht vor.

### Paper — `#F2F2F2`

| | |
|---|---|
| RGB | `rgb(242, 242, 242)` |
| HSL | `hsl(0, 0%, 95%)` |
| Token | `--ne-paper` · `bg-ne-paper` · shadcn `--background` |
| Kontrast | trägt Ink 16,0:1 · trägt Ink-Soft 9,9:1 · trägt Ink-Muted 5,8:1 |

**Verwendung.** Globaler Seitenhintergrund; gleichzeitig die Textfarbe auf
Ink-Flächen (dort weicher als reines Weiß).

**Verboten.**
- Nicht als Kartenfläche *auf* Paper — dort verschwindet die Karte.
  Karten auf Paper sind **White**.

### Flash — `#FF1E00`

| | |
|---|---|
| RGB | `rgb(255, 30, 0)` |
| HSL | `hsl(7, 100%, 50%)` |
| Token | `--ne-flash` · `text-ne-flash` |
| Kontrast | auf Paper **3,45:1** · auf White 3,86:1 · auf Ink 4,64:1 |

**Verwendung.** Der *sprechende* Akzent auf hellem Grund: Akzent-Wörter in
Headlines (`withAccent`), Link- und Nav-Hover, Eyebrow-Akzent, akzentuierte
Zahlen. Immer dort, wo Lime stehen würde, wenn Lime lesbar wäre.

**Verboten.**
- **Nur Large Text und Grafik.** 3,45:1 erfüllt WCAG AA erst ab 24 px
  (bzw. 18,7 px bold). Kein Fließtext, keine Captions, keine Labels in 13 px.
- Nicht als Statusfarbe für Fehler — dafür **Error `#B91C1C`**. Flash ist
  Marke, Error ist Zustand; die beiden dürfen nie verwechselbar sein.
- Nicht als großflächiger Hintergrund. Flash ist ein Strich, keine Wand.

---

## Stütz-Töne (5)

### White — `#FFFFFF`

`rgb(255,255,255)` · `hsl(0,0%,100%)` · `--ne-white` · shadcn `--surface`, `--card`, `--popover`

Karten und erhöhte Flächen auf Paper; Schrift auf Ink-Flächen und auf
Primär-Buttons. **Nicht** als Seitenhintergrund (das ist Paper) und nicht
als Schrift auf Lime.

### Ink Soft — `#3C3C3C`

`rgb(60,60,60)` · `hsl(0,0%,23.5%)` · `--ne-ink-soft` · shadcn `--foreground`

Fließtext/Body auf Paper (9,9:1) und auf Weiß (11,0:1).
**Nicht** auf dunklen Flächen (1,6:1 auf Ink) und nicht für Headlines (dafür Ink).

### Ink Muted — `#5E5E5A`

`rgb(94,94,90)` · `hsl(60,2.2%,36.1%)` · `--ne-ink-muted` · shadcn `--muted-foreground`

Meta-Angaben, Labels, Captions, Sub-Zeilen auf hell (5,8:1 auf Paper,
6,5:1 auf Weiß). **Nicht** auf dunklen Flächen, **nicht** für längere
Fließtext-Blöcke (dafür Ink Soft).

### Ink Deep — `#101010`

`rgb(16,16,16)` · `hsl(0,0%,6.3%)` · `--ne-ink-deep`

**Ausschließlich** unterer Stop des Ink-Verlaufs und tiefste Sektionsfläche.
Nie als Textfarbe, nie als Standard-Sektionsgrund (das ist Ink).

### Ink Raise — `#1F1F1F`

`rgb(31,31,31)` · `hsl(0,0%,12.2%)` · `--ne-ink-raise`

**Ausschließlich** oberer Stop des Ink-Verlaufs. Nie standalone als Fläche,
Border oder Text.

---

## Status (genau einer je Zustand)

### Error — `#B91C1C`

`rgb(185,28,28)` · `hsl(0,73.7%,41.8%)` · `--ne-error` · shadcn `--destructive`

Formular-Fehlermeldungen, negative Vergleichs-Icons.
5,8:1 auf Paper / 6,5:1 auf Weiß → AA auch in 13 px.
**Nicht** als Marken-Akzent (dafür Flash), **nicht** auf dunklen Flächen.

### Success — `#15803D`

`rgb(21,128,61)` · `hsl(142.4,71.8%,29.2%)` · `--ne-success` · shadcn `--success`

Erfolgsmeldungen, positive Vergleichs-Icons.
**Achtung:** 4,48:1 auf Paper — knapp unter AA für Fließtextgröße. Auf
**Weiß** (5,0:1) ist er sauber. Erfolgsmeldungen deshalb auf weiße Karten
setzen, oder ab 18,7 px bold verwenden. **Nicht** als dekorativer Akzent.

---

## Abgeleitete Werte

Sechs Alpha-Stufen auf Ink-Basis. **Keine Zwischenwerte erfinden** — der
Wildwuchs, den diese Leiter ersetzt, waren 42 verschiedene Alphas in
195 Fundstellen.

| Token | Wert | Rolle | Ergebnis auf Paper |
|---|---|---|---|
| `--ne-ink-06` | `rgba(23,23,23,0.06)` | Wash, Zebra-Zeilen, Hover-Fläche | `#E5E5E5` |
| `--ne-hairline` | `rgba(23,23,23,0.14)` | Standard-Border, Divider, Card-Rand | `#D3D3D3` |
| `--ne-hairline-strong` | `rgba(23,23,23,0.22)` | aktive/hover-Border, Schattentiefe | `#C2C2C2` |
| `--ne-ink-quiet` | `rgba(23,23,23,0.45)` | Deko-Icons, Zahlen-Ghosts — **kein Fließtext** (2,9:1) | `#8F8F8F` |
| `--ne-ink-secondary` | `rgba(23,23,23,0.68)` | Sekundärtext auf Paper (5,9:1 — AA-sicher) | `#5D5D5D` |
| `--ne-scrim` | `rgba(23,23,23,0.92)` | Modal-Backdrop, Overlay | — |

**Spiegelsatz Weiß** — gleiche Leiter für dunkle Flächen:
`--ne-white-06` `0.06` · `--ne-white-hairline` `0.14` ·
`--ne-white-hairline-strong` `0.22` · `--ne-white-quiet` `0.45` ·
`--ne-white-secondary` `0.68` · `--ne-white-scrim` `0.92`
(alle auf `rgba(255,255,255,…)`).

**Spiegelsatz Lime** — nur für Washes, Glows und Flächen, nie für Text auf hell:
`--ne-lime-06` `0.06` · `--ne-lime-hairline` `0.14` · `--ne-lime-wash` `0.22` ·
`--ne-lime-soft` `0.45` · `--ne-lime-strong` `0.68`
(alle auf `rgba(204,255,0,…)`).

### Schatten

| Token | Wert | Rolle |
|---|---|---|
| `--ne-shadow-card` | `0 1px 2px rgba(23,23,23,0.06)` | Standard-Karte |
| `--ne-shadow-lift` | `0 24px 56px -18px rgba(23,23,23,0.18)` | Feature-Karte, Hover-Lift |

Tailwind: `shadow-ne-card`, `shadow-ne-lift`. Nie inline duplizieren,
nie mit `rgba(0,0,0,…)` — Schatten sind Ink, nicht Schwarz.

---

## Verläufe

Drei Verläufe. Ein vierter ist ein Fehler.

### Ink-Verlauf — `--ne-ink-gradient` / `bg-gradient-ne-ink`

```css
linear-gradient(160deg, #1F1F1F 0%, #171717 45%, #101010 100%)
```

Primär-Pill, Footer, Nav-Pill, Ticker, dunkle Bühnen. Richtungsvarianten
(120deg, 150deg) sind erlaubt — die Stops nicht.

### Lime-Verlauf — `--ne-lime-gradient` / `bg-gradient-ne-lime`

```css
linear-gradient(120deg, #CCFF00 0%, #D9F53A 45%, #CCFF00 100%)
```

Lime-Flächen, die Tiefe brauchen (Statement-Stats). Schrift darauf: Ink.

### Showcase-Verlauf — `--ne-showcase-gradient` / `bg-gradient-ne-showcase`

```css
/* lineare Form (Token) */
linear-gradient(150deg, #171717 0%, #333A00 45%, #CCFF00 100%)

/* radiale Form — Lime-Hotspot in der Ecke, in Karten mit Bild rechts unten */
radial-gradient(150% 150% at 100% 100%, #CCFF00 0%, #6B7A00 26%, #2E3300 48%, #171717 70%)
```

Ink → Lime für Case-, Video- und CTA-Karten (`CaseSpotlightSection`,
`VideoShowcaseSection`, `SpeakWithUsCta` nutzen die radiale Form).
Beide Formen sind derselbe Verlauf, nur andere Geometrie — die radiale
braucht wegen des größeren Lime-Anteils zwei statt einem Stützpunkt.

> `#D9F53A`, `#333A00`, `#6B7A00` und `#2E3300` sind **Verlaufs-Stützpunkte**,
> keine eigenständigen Palettenfarben. Nie flächig, nie als Text, nie als
> Border verwenden.

### Bild-Scrim

```css
linear-gradient(180deg, rgba(16,16,16,0) 55%, rgba(16,16,16,0.92) 100%)
```

Für Text auf Fotos.

---

## Interaktionszustände

| Zustand | Behandlung |
|---|---|
| **Fokus** | `outline: 2px solid #171717` (Offset 2) **+** `box-shadow: 0 0 0 6px rgba(204,255,0,0.85)`. Der Ink-Ring trägt auf hellem Grund, der Lime-Halo auf dunklem — zusammen sichtbar auf beiden. |
| **Textmarkierung** | `::selection` = Lime-Fläche, Ink-Schrift (15,3:1) |
| **Link-/Nav-Hover auf hell** | Flash `#FF1E00` |
| **Link-/Nav-Hover auf dunkel** | Lime `#CCFF00` |
| **Button-Hover (Lime-Fläche)** | invertiert auf Ink-Fläche + weiße Schrift |
| **Border-Hover** | `--ne-hairline` → `--ne-hairline-strong` |

---

## Abgelöste Farben — nicht mehr verwenden

Die violette CI ist vollständig abgelöst. Taucht einer dieser Werte in
neuem Code auf, ist es ein Fehler:

| Alt | War | Ersatz |
|---|---|---|
| `#5658DF` | Brand-Violett | Ink `#171717`; Fokus/Selection → Ink + Lime-Halo |
| `#8476EF` | Violett-Glow | ersatzlos; falls Glow nötig → `rgba(204,255,0,0.30)` |
| `#9A85F6` | Hellviolett | ersatzlos |
| `#8B8DF0`, `#C2C3F6` | Violett-Light, Lilac | Lime bzw. `--ne-lime-soft` |
| `#17172E`, `#100E1E`, `#3C3C47` | violettstichige Inks | `#171717` / `#101010` / `#3C3C3C` |
| `#F8F5FF` | Helllila Paper | Paper `#F2F2F2` |
| `#8A84A0` | violettstichiges Grau (3,19:1, AA-Fail) | Ink Muted `#5E5E5A` |
| `#6B6B66` | dritter Grauton | Ink Muted `#5E5E5A` |
| `#FFF200`, `#FFF7B2` | zweiter/dritter Gelbton | Lime; als Fläche auf Paper `--ne-lime-soft` |
| `#EF4444` | helles Fehlerrot (3,36:1, AA-Fail) | Error `#B91C1C` |
| `#FBBF24`, `#EAB308`, `#22D3EE` | Streufarben aus totem Code | ersatzlos löschen |
| `rgba(23,23,46,…)` | Alphas auf violettem Ink | `rgba(23,23,23,…)`-Leiter |

---

## Kurzcheck vor dem Commit

1. Steht Lime als Text auf hellem Grund? → **Flash** verwenden.
2. Steht helle Schrift auf Lime? → **Ink** verwenden.
3. Neuer Hex-Wert außerhalb der elf? → auf einen der elf abbilden.
4. Neues `rgba(23,23,23,0.xy)` außerhalb der sechs Stufen? → auf die
   nächstliegende Stufe runden.
5. Neuer Verlauf? → einen der drei bestehenden nehmen.
6. `#000` oder `rgba(0,0,0,…)`? → Ink bzw. die Ink-Alpha-Leiter.
7. Violett in irgendeiner Form? → siehe Tabelle oben.
