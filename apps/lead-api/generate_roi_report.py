"""
generate_roi_report.py — NEWEDGE ROI-Rechner → Kunden-Report (PDF)

Erzeugt aus einem ROI-Rechner-Lead (Payload des Website-Rechners /roi-rechner)
einen 6-seitigen, personalisierten Audit-Report im aktuellen NEWEDGE-CI
(Lime #CCFF00 · Ink #171717 · Paper #F2F2F2, Outfit).

Struktur nach dem freigegebenen Muster (NewEdge_Audit_Musterfirma_GmbH.pdf):
  1. Cover
  2. Ihre Situation (3 Erkenntnisse aus den Angaben)
  3. Ihre größten Automatisierungs-Chancen (Tabelle je Rolle)
  4. Ihr ROI auf einen Blick (+ Kosten des Wartens + Hochrechnung)
  5. Unsere Empfehlung (KI-Audit-Einstieg, BAFA)
  6. Nächste Schritte + Kontakt

Aufruf:
  python3 generate_roi_report.py [payload.json] [output.pdf]
  (ohne Argumente: sample_roi_lead.json → ROI_Report_<Firma>.pdf)

Payload-Kontrakt: siehe sample_roi_lead.json — alle berechneten Werte kommen
aus dem Frontend (eine Rechen-Wahrheit, keine Formel-Duplikate in Python).
"""

import json
import os
import sys
from datetime import datetime, timezone

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------------------
# NEWEDGE CI (Rebrush 2026-07)
# ---------------------------------------------------------------------------
INK        = HexColor("#171717")
INK_SOFT   = HexColor("#3C3C3C")
MUTED      = HexColor("#6B6B66")
LIME       = HexColor("#CCFF00")
LIME_DARK  = HexColor("#B4E600")
PAPER      = HexColor("#F2F2F2")
CARD       = white
HAIRLINE   = HexColor("#DBDBD7")
FLASH      = HexColor("#FF1E00")          # nur für Warn-Zahlen (Kosten des Wartens)
INK_ON_DARK_MUTED = Color(1, 1, 1, alpha=0.72)

W, H   = 595.27, 841.89                    # A4
MARGIN = 46
CW     = W - 2 * MARGIN

LOGO_DARK  = os.path.join(BASE_DIR, "assets", "newedge-wordmark-dark.png")   # Ink-Wortmarke für helle Seiten
LOGO_WHITE = os.path.join(BASE_DIR, "assets", "newedge-wordmark-white.png")  # Weiße Wortmarke fürs Cover

CONTACT_MAIL  = "info@newedgebrand.com"
CONTACT_PHONE = "+49 176 60 431 467"
CONTACT_WEB   = "newedgebrand.com"
CONTACT_LINE  = "NEWEDGE · Die KI-Abteilung für den Mittelstand"

# ---------------------------------------------------------------------------
# Fonts (Outfit; 500 als Regular-Ersatz)
# ---------------------------------------------------------------------------
def register_fonts():
    fonts = {
        "Outfit":     "outfit-v15-latin-500.ttf",
        "Outfit-SB":  "outfit-v15-latin-600.ttf",
        "Outfit-B":   "outfit-v15-latin-700.ttf",
        "Outfit-XB":  "outfit-v15-latin-800.ttf",
    }
    for name, fname in fonts.items():
        path = os.path.join(BASE_DIR, "fonts", fname)
        pdfmetrics.registerFont(TTFont(name, path))

F_REG, F_SB, F_B, F_XB = "Outfit", "Outfit-SB", "Outfit-B", "Outfit-XB"

# ---------------------------------------------------------------------------
# Formatierung (deutsch)
# ---------------------------------------------------------------------------
def eur(v, approx=False):
    s = f"{round(v):,} €".replace(",", ".")
    return ("~" + s) if approx else s

def eur_round100(v):
    return eur(round(v / 100) * 100, approx=True)

def num(v):
    return f"{round(v):,}".replace(",", ".")

def dec1(v):
    return f"{v:.1f}".replace(".", ",")

def payback_label(p):
    return "< 1 Monat" if p < 1 else (f"{round(p)} Monat" if round(p) == 1 else f"{round(p)} Monate")

def effort_label(e):
    return "niedrig" if e >= 8 else ("mittel" if e >= 6 else "hoch")

MATURITY_TEXT = {
    "none": ("Noch ganz am Anfang",
             "Fast alles läuft heute manuell. Das heißt aber auch: Ihr Potenzial ist am größten — "
             "schon die ersten Automationen ersetzen spürbar Handarbeit."),
    "some": ("Erste Tools im Einsatz",
             "Erste Tools sind bereits im Einsatz, aber noch nicht systematisch verbunden. "
             "Die Grundlagen sind da — jetzt geht es um ein System statt einzelner Insellösungen."),
    "advanced": ("Schon einige Automationen",
             "Einige Automationen laufen bereits, aber unsystematisch. Der größte Hebel liegt jetzt "
             "in der Konsolidierung: ein verbundenes System statt vieler Inseln."),
}

# ---------------------------------------------------------------------------
# Zeichen-Helfer
# ---------------------------------------------------------------------------
def wrapped(c, text, x, y, max_w, font=F_REG, size=9.5, color=INK_SOFT, lh=None):
    """Wortumbruch; gibt y-Position unter der letzten Zeile zurück."""
    if lh is None:
        lh = size * 1.45
    c.setFillColor(color)
    c.setFont(font, size)
    line = ""
    cy = y
    for w_ in text.split():
        test = (line + " " + w_).strip()
        if c.stringWidth(test, font, size) > max_w and line:
            c.drawString(x, cy, line)
            cy -= lh
            line = w_
        else:
            line = test
    if line:
        c.drawString(x, cy, line)
        cy -= lh
    return cy

def logo(c, x, y_top, w=92, dark=True):
    path = LOGO_DARK if dark else LOGO_WHITE
    if os.path.exists(path):
        img = ImageReader(path)
        iw, ih = img.getSize()
        h = w * ih / iw
        c.drawImage(path, x, y_top - h, width=w, height=h, mask="auto")
        return h
    c.setFillColor(INK if dark else white)
    c.setFont(F_XB, 14)
    c.drawString(x, y_top - 14, "NEWEDGE")
    return 14

def page_frame(c, section_label, page_no, total=6):
    """Heller Seitenrahmen: Wortmarke + Sektionslabel oben, Kontakt + Seitenzahl unten."""
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    logo(c, MARGIN, H - 30, w=84, dark=True)
    c.setFillColor(MUTED)
    c.setFont(F_SB, 7.5)
    c.drawRightString(W - MARGIN, H - 44, section_label.upper())
    c.setFillColor(HAIRLINE)
    c.rect(MARGIN, H - 58, CW, 0.8, stroke=0, fill=1)
    # Footer
    c.setFillColor(HAIRLINE)
    c.rect(MARGIN, 44, CW, 0.8, stroke=0, fill=1)
    c.setFillColor(MUTED)
    c.setFont(F_REG, 7)
    c.drawString(MARGIN, 32, f"{CONTACT_LINE} · {CONTACT_MAIL}")
    c.drawRightString(W - MARGIN, 32, f"VERTRAULICH   {page_no} / {total}")

def h1(c, text, y, size=21):
    c.setFillColor(INK)
    c.setFont(F_XB, size)
    c.drawString(MARGIN, y, text)
    return y - size * 0.62

def sub(c, text, y):
    return wrapped(c, text, MARGIN, y - 14, CW, font=F_REG, size=10, color=MUTED)

def chip(c, x, y, text, font=F_SB, size=8, pad=8, fill=None, text_color=None, border=None):
    """Pill-Chip; gibt die Breite zurück. y = Grundlinie des Texts."""
    tw = c.stringWidth(text, font, size)
    w_ = tw + pad * 2
    h_ = size + 9
    if fill is not None:
        c.setFillColor(fill)
        c.roundRect(x, y - (h_ - size) / 2 - 1.5, w_, h_, h_ / 2, stroke=0, fill=1)
    if border is not None:
        c.setStrokeColor(border)
        c.setLineWidth(0.9)
        c.roundRect(x, y - (h_ - size) / 2 - 1.5, w_, h_, h_ / 2, stroke=1, fill=0)
    c.setFillColor(text_color if text_color is not None else INK)
    c.setFont(font, size)
    c.drawString(x + pad, y, text)
    return w_

def stat_tile(c, x, y, w_, h_, value, label, value_color=INK, accent=False):
    c.setFillColor(CARD)
    c.roundRect(x, y, w_, h_, 10, stroke=0, fill=1)
    if accent:
        c.setFillColor(LIME)
        c.roundRect(x, y, 5, h_, 2.5, stroke=0, fill=1)
    c.setFillColor(value_color)
    c.setFont(F_XB, 17)
    c.drawString(x + 16, y + h_ - 30, value)
    c.setFillColor(MUTED)
    c.setFont(F_REG, 8)
    wrapped(c, label, x + 16, y + h_ - 45, w_ - 30, font=F_REG, size=8, color=MUTED, lh=10)

# ---------------------------------------------------------------------------
# Seite 1 — Cover (Ink-dunkel, Lime-Akzent)
# ---------------------------------------------------------------------------
def page_cover(c, d):
    c.setFillColor(INK)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # Dezentes Raster wie in den dunklen Website-Modulen
    c.setStrokeColor(Color(1, 1, 1, alpha=0.045))
    c.setLineWidth(0.5)
    for gx in range(0, int(W) + 40, 40):
        c.line(gx, 0, gx, H)
    for gy in range(0, int(H) + 40, 40):
        c.line(0, gy, W, gy)

    logo(c, MARGIN, H - 44, w=118, dark=False)

    # VERTRAULICH-Chip oben rechts
    chip_text = "VERTRAULICH"
    tw = c.stringWidth(chip_text, F_SB, 8)
    cx = W - MARGIN - tw - 16
    c.setStrokeColor(Color(1, 1, 1, alpha=0.45))
    c.setLineWidth(0.9)
    c.roundRect(cx, H - 62, tw + 16, 20, 10, stroke=1, fill=0)
    c.setFillColor(Color(1, 1, 1, alpha=0.75))
    c.setFont(F_SB, 8)
    c.drawString(cx + 8, H - 55, chip_text)

    # Titelblock
    y = H * 0.60
    c.setFillColor(LIME)
    c.setFont(F_SB, 10)
    c.drawString(MARGIN, y + 96, "IHR KURZ-AUDIT · KI-POTENZIAL")
    c.setFillColor(white)
    c.setFont(F_XB, 40)
    c.drawString(MARGIN, y + 44, "Ihr KI-Audit")
    c.setFillColor(LIME)
    c.setFont(F_XB, 24)
    c.drawString(MARGIN, y + 8, d["company"] or d["name"] or "Ihr Unternehmen")

    # Lime-Unterstrich
    c.setFillColor(LIME)
    c.roundRect(MARGIN, y - 16, 64, 4, 2, stroke=0, fill=1)
    c.setFillColor(Color(1, 1, 1, alpha=0.35))
    c.roundRect(MARGIN + 72, y - 16, 18, 4, 2, stroke=0, fill=1)

    # Chips: Branche · Rollen · ROI
    cy = y - 58
    cx = MARGIN
    for t in (f"Branche: {d['branche']}",
              f"{len(d['rows'])} {'Rolle' if len(d['rows']) == 1 else 'Rollen'} analysiert",
              "ROI-Potenzial berechnet"):
        tw = c.stringWidth(t, F_SB, 9)
        c.setFillColor(Color(1, 1, 1, alpha=0.08))
        c.roundRect(cx, cy - 8, tw + 22, 26, 13, stroke=0, fill=1)
        c.setStrokeColor(Color(1, 1, 1, alpha=0.30))
        c.setLineWidth(0.8)
        c.roundRect(cx, cy - 8, tw + 22, 26, 13, stroke=1, fill=0)
        c.setFillColor(white)
        c.setFont(F_SB, 9)
        c.drawString(cx + 11, cy, t)
        cx += tw + 22 + 10

    # Empfänger
    ry = y - 120
    c.setFillColor(INK_ON_DARK_MUTED)
    c.setFont(F_REG, 9)
    c.drawString(MARGIN, ry, "Erstellt für:")
    c.setFillColor(white)
    c.setFont(F_B, 12)
    c.drawString(MARGIN, ry - 18, d["name"] or d["company"])
    if d.get("email"):
        c.setFillColor(INK_ON_DARK_MUTED)
        c.setFont(F_REG, 9.5)
        c.drawString(MARGIN, ry - 34, d["email"])

    # Fußzeile
    c.setFillColor(INK_ON_DARK_MUTED)
    c.setFont(F_REG, 8)
    c.drawString(MARGIN, 40, d["dateStr"])
    c.drawRightString(W - MARGIN, 40, f"Erstellt von {CONTACT_LINE}")

# ---------------------------------------------------------------------------
# Seite 2 — Ihre Situation
# ---------------------------------------------------------------------------
def page_situation(c, d):
    page_frame(c, "Ihre Situation", 2)
    y = h1(c, "Was wir aus Ihren Angaben lesen", H - 96)
    y = sub(c, "Drei zentrale Erkenntnisse aus Ihrem Kurz-Audit", y)
    y -= 10

    hours_week = d["hoursYear"] / 46 if d["hoursYear"] else 0
    mat_title, mat_text = MATURITY_TEXT.get(d["maturity"], MATURITY_TEXT["some"])
    roles_list = ", ".join(r["sub"] for r in d["rows"])

    cards = [
        ("Manuelle Prozesse binden Kapazität",
         f"Sie haben {len(d['rows'])} {'Bereich' if len(d['rows']) == 1 else 'Bereiche'} markiert, in denen heute "
         f"Handarbeit dominiert — {roles_list}. Zusammen binden diese Tätigkeiten bei Ihrer Teamgröße "
         f"({d['team']} Mitarbeitende) rund {num(hours_week)} Stunden pro Woche."),
        ("Bezifferbares Einsparpotenzial",
         f"Auf Basis realer Automatisierungen ergibt sich für Ihre Auswahl ein Netto-Potenzial von "
         f"{eur_round100(d['totalNet'])} pro Jahr — nach Abzug laufender Kosten. Das entspricht etwa "
         f"{num(d['hoursYear'])} Stunden bzw. {dec1(d['fte'])} Vollzeitkräften pro Jahr."),
        (mat_title, mat_text +
         (f" Sie nutzen bereits: {', '.join(d['usedApps'])} — darauf bauen wir auf, statt zu ersetzen."
          if d["usedApps"] else "")),
    ]

    for i, (title, text) in enumerate(cards, 1):
        card_h = 88
        c.setFillColor(CARD)
        c.roundRect(MARGIN, y - card_h, CW, card_h, 12, stroke=0, fill=1)
        # Nummern-Chip (Lime-Fläche, Ink-Ziffer)
        c.setFillColor(LIME)
        c.roundRect(MARGIN + 16, y - 40, 26, 26, 8, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont(F_XB, 12)
        c.drawCentredString(MARGIN + 29, y - 32, str(i))
        # Titel + Text
        c.setFillColor(INK)
        c.setFont(F_B, 12)
        c.drawString(MARGIN + 56, y - 28, title)
        wrapped(c, text, MARGIN + 56, y - 46, CW - 76, size=9, color=INK_SOFT, lh=12.5)
        y -= card_h + 14

    # Hinweis
    note_h = 40
    c.setFillColor(CARD)
    c.roundRect(MARGIN, y - note_h, CW, note_h, 10, stroke=0, fill=1)
    c.setFillColor(LIME)
    c.roundRect(MARGIN, y - note_h, 5, note_h, 2.5, stroke=0, fill=1)
    wrapped(c,
            "Diese Erkenntnisse basieren auf Ihren Angaben im ROI-Rechner. Im kostenlosen Erstgespräch "
            "vertiefen wir die Punkte und übersetzen sie in konkrete Maßnahmen.",
            MARGIN + 18, y - 16, CW - 36, size=8.5, color=MUTED, lh=11.5)

# ---------------------------------------------------------------------------
# Seite 3 — Automatisierungs-Chancen (Tabelle)
# ---------------------------------------------------------------------------
def page_chancen(c, d):
    page_frame(c, "Automatisierungs-Chancen", 3)
    y = h1(c, f"Ihre größten Automatisierungs-Chancen", H - 96)
    y = sub(c, "Priorisiert nach dem besten Verhältnis von Wirkung zu Aufwand — die schnellsten Erfolge zuerst.", y)
    y -= 12

    col_nr, col_role, col_proc, col_eff = 28, 158, 148, 60
    col_val = CW - col_nr - col_role - col_proc - col_eff

    # Kopfzeile (Ink)
    head_h = 24
    c.setFillColor(INK)
    c.roundRect(MARGIN, y - head_h, CW, head_h, 6, stroke=0, fill=1)
    c.rect(MARGIN, y - head_h, CW, 8, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont(F_SB, 7.5)
    tx = MARGIN + 10
    c.drawString(tx, y - 16, "NR");                       tx += col_nr
    c.drawString(tx, y - 16, "ROLLE / BEREICH");          tx += col_role
    c.drawString(tx, y - 16, "BEISPIELPROZESS");          tx += col_proc
    c.drawString(tx, y - 16, "AUFWAND");                  tx += col_eff
    c.drawRightString(MARGIN + CW - 10, y - 16, "POTENZIAL / JAHR")
    y -= head_h

    row_h = 46
    for i, r in enumerate(d["rows"], 1):
        c.setFillColor(CARD if i % 2 == 1 else PAPER)
        c.rect(MARGIN, y - row_h, CW, row_h, stroke=0, fill=1)

        tx = MARGIN + 10
        c.setFillColor(MUTED)
        c.setFont(F_B, 9)
        c.drawString(tx, y - 20, str(i))
        tx += col_nr

        c.setFillColor(INK)
        role_size = 9.5
        while c.stringWidth(r["sub"], F_B, role_size) > col_role - 14 and role_size > 7:
            role_size -= 0.5
        c.setFont(F_B, role_size)
        c.drawString(tx, y - 17, r["sub"])
        c.setFillColor(MUTED)
        c.setFont(F_REG, 7.5)
        c.drawString(tx, y - 29, r["name"])
        if r.get("quickWin"):
            chip(c, tx, y - 41, "Schneller Erfolg", size=6.5, pad=5, fill=LIME, text_color=INK)
        tx += col_role

        wrapped(c, r["prozess"], tx, y - 17, col_proc - 14, size=8, color=INK_SOFT, lh=10)
        tx += col_proc

        c.setFillColor(INK_SOFT)
        c.setFont(F_REG, 8.5)
        c.drawString(tx, y - 20, effort_label(r["effort"]))
        c.setFillColor(INK)
        c.setFont(F_B, 11)
        c.drawRightString(MARGIN + CW - 10, y - 21, eur_round100(r["net"]))
        y -= row_h

    # Summenzeile
    sum_h = 30
    c.setFillColor(INK)
    c.roundRect(MARGIN, y - sum_h, CW, sum_h, 6, stroke=0, fill=1)
    c.rect(MARGIN, y - sum_h + sum_h - 8, CW, 8, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont(F_SB, 9.5)
    c.drawString(MARGIN + 10, y - 20, "Gesamtpotenzial (netto, pro Jahr)")
    c.setFillColor(LIME)
    c.setFont(F_XB, 12)
    c.drawRightString(MARGIN + CW - 10, y - 21, f"{eur(d['netLo'])} – {eur(d['netHi'])}")
    y -= sum_h + 16

    # Tools + Methodik
    if d["usedApps"]:
        y = wrapped(c, f"Ihre vorhandenen Tools ({', '.join(d['usedApps'])}) binden wir direkt an — "
                       "Ihre KI-Abteilung baut auf dem auf, was schon läuft.",
                    MARGIN, y, CW, size=8.5, color=INK_SOFT, lh=11.5) - 4
    wrapped(c, "Methodik: ROI-Spannen aus über 40 realen Automatisierungen, angepasst an Ihre Teamgröße "
               "und Ihren Reifegrad, abzüglich ~15 % laufender Kosten. Konkrete Zahlen validieren wir im Erstgespräch.",
            MARGIN, y, CW, size=7.5, color=MUTED, lh=10)

# ---------------------------------------------------------------------------
# Seite 4 — ROI auf einen Blick
# ---------------------------------------------------------------------------
def page_roi(c, d):
    page_frame(c, "ROI & Wirtschaftlichkeit", 4)
    y = h1(c, "Ihr ROI auf einen Blick", H - 96)
    y = sub(c, f"Konservativ gerechnet: {eur(d['netLo'])} … ambitioniert: {eur(d['netHi'])} pro Jahr.", y)
    y -= 12

    # Links 2×2 Kacheln, rechts "Kosten des Wartens"
    gap = 10
    left_w = CW * 0.56
    tile_w = (left_w - gap) / 2
    tile_h = 64
    tiles = [
        (eur_round100(d["totalNet"]), "Einsparpotenzial / Jahr (netto)", True),
        (payback_label(d["payback"]), "Investition wieder drin nach", False),
        (f"{num(d['hoursYear'])} Std.", "Freigesetzte Zeit / Jahr", False),
        (f"ca. {dec1(d['fte'])} FTE", "Vollzeitkräfte-Äquivalent", False),
    ]
    for i, (val, lab, accent) in enumerate(tiles):
        tx = MARGIN + (i % 2) * (tile_w + gap)
        ty = y - tile_h - (i // 2) * (tile_h + gap)
        stat_tile(c, tx, ty, tile_w, tile_h, val, lab, accent=accent)

    # Rechts: Kosten des Wartens
    rx = MARGIN + left_w + 14
    rw = CW - left_w - 14
    rh = tile_h * 2 + gap
    c.setFillColor(CARD)
    c.roundRect(rx, y - rh, rw, rh, 10, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont(F_B, 10.5)
    c.drawString(rx + 14, y - 22, "Kosten des Wartens")
    c.setFillColor(MUTED)
    c.setFont(F_REG, 8)
    c.drawString(rx + 14, y - 36, "Ungenutztes Potenzial pro Jahr")
    c.setFillColor(FLASH)
    c.setFont(F_XB, 15)
    c.drawString(rx + 14, y - 54, eur_round100(d["totalNet"]))
    c.setFillColor(MUTED)
    c.setFont(F_REG, 8)
    c.drawString(rx + 14, y - 72, "Über 3 Jahre kumuliert")
    c.setFillColor(FLASH)
    c.setFont(F_XB, 15)
    c.drawString(rx + 14, y - 90, eur_round100(d["totalNet"] * 3))
    wrapped(c, "Während Sie warten, automatisieren Wettbewerber — und der Fachkräftemangel macht "
               "jede manuelle Stunde teurer.", rx + 14, y - 108, rw - 28, size=7.5, color=MUTED, lh=10)

    y -= rh + 24

    # Hochrechnung — kumulierte Einsparungen im ersten Jahr
    c.setFillColor(CARD)
    strip_h = 110
    c.roundRect(MARGIN, y - strip_h, CW, strip_h, 12, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont(F_SB, 9)
    c.drawString(MARGIN + 16, y - 22, "KUMULIERTE EINSPARUNGEN IM ERSTEN JAHR (LINEARE HOCHRECHNUNG)")

    milestones = [("Mo. 3", 0.25), ("Mo. 6", 0.50), ("Mo. 9", 0.75), ("Mo. 12", 1.00)]
    mx0 = MARGIN + 60
    mx1 = MARGIN + CW - 60
    my  = y - 62
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(2)
    c.line(mx0, my, mx1, my)
    for i, (lab, frac) in enumerate(milestones):
        mx = mx0 + (mx1 - mx0) * (i / (len(milestones) - 1))
        last = i == len(milestones) - 1
        c.setFillColor(LIME if last else CARD)
        c.setStrokeColor(INK)
        c.setLineWidth(1.4)
        c.circle(mx, my, 11, stroke=1, fill=1)
        c.setFillColor(INK)
        c.setFont(F_B, 8)
        c.drawCentredString(mx, my - 2.5, str(i + 1))
        c.setFillColor(MUTED)
        c.setFont(F_REG, 7.5)
        c.drawCentredString(mx, my - 26, lab)
        c.setFillColor(INK)
        c.setFont(F_B, 9)
        c.drawCentredString(mx, my - 38, eur_round100(d["totalNet"] * frac))

    y -= strip_h + 14
    wrapped(c, "Alle Werte sind Ihr jährlicher Rückfluss aus Automatisierung — nicht Ihre Kosten. "
               f"Die Investition ({eur(d['invest'], )} inkl. Einstieg und geschätzter Umsetzung) ist bei "
               f"diesem Potenzial nach {payback_label(d['payback'])} wieder eingespielt.",
            MARGIN, y, CW, size=8, color=MUTED, lh=11)

# ---------------------------------------------------------------------------
# Seite 5 — Empfehlung
# ---------------------------------------------------------------------------
def page_empfehlung(c, d):
    page_frame(c, "Unsere Empfehlung", 5)
    y = h1(c, f"Was wir für {d['company'] or 'Sie'} empfehlen", H - 96)
    y = sub(c, "Basierend auf Ihrer Ausgangslage und Ihrer Auswahl", y)
    y -= 12

    # Empfehlungs-Karte
    card_h = 158
    c.setFillColor(CARD)
    c.roundRect(MARGIN, y - card_h, CW, card_h, 12, stroke=0, fill=1)
    cx = MARGIN + 18
    chip(c, cx, y - 30, "KI-AUDIT", size=8, pad=9, fill=LIME, text_color=INK)
    c.setFillColor(INK)
    c.setFont(F_B, 13)
    c.drawString(cx + 78, y - 30, "Der richtige Einstieg: erst messen, dann automatisieren.")
    yy = y - 56
    yy = wrapped(c, "Das KI-Audit übersetzt dieses Kurz-Ergebnis in einen belastbaren Plan: Wir dokumentieren "
                    "Ihre Prozesse, validieren die Zahlen an Ihrem echten Betrieb und priorisieren die Umsetzung.",
                 cx, yy, CW - 40, size=9, color=INK_SOFT, lh=12.5) - 4
    for b in (f"Prozesslandkarte für Ihre {len(d['rows'])} gewählten Bereiche",
              "Priorisierter Umsetzungsplan mit ROI-Ziel je Maßnahme",
              "Prüfung der staatlichen Förderfähigkeit (BAFA) inklusive"):
        c.setFillColor(LIME)
        c.circle(cx + 4, yy + 2.5, 4.5, stroke=0, fill=1)
        # Haken gezeichnet statt Glyphe (Outfit-Latin-Subset hat kein U+2713)
        c.setStrokeColor(INK)
        c.setLineWidth(1.1)
        c.line(cx + 2.2, yy + 2.6, cx + 3.5, yy + 1.2)
        c.line(cx + 3.5, yy + 1.2, cx + 6.0, yy + 4.2)
        yy = wrapped(c, b, cx + 14, yy, CW - 60, size=9, color=INK_SOFT, lh=12) - 3
    # Chips: Investition + BAFA
    w1 = chip(c, cx, y - card_h + 18, f"Investition: ab {eur(d['entryPrice'])}", size=8.5, pad=10, fill=INK, text_color=white)
    chip(c, cx + w1 + 8, y - card_h + 18, "staatlich förderfähig (BAFA)", size=8.5, pad=10, border=INK, text_color=INK)
    y -= card_h + 18

    # Warum NEWEDGE
    c.setFillColor(MUTED)
    c.setFont(F_SB, 8)
    c.drawString(MARGIN, y, "WARUM NEWEDGE?")
    y -= 10
    cols = [
        ("Founder-geführt", "Direkte Zusammenarbeit, keine Zwischenebenen."),
        ("Ergebnis-orientiert", "Wir messen uns an messbaren Ergebnissen — nicht an Stunden."),
        ("Ohne Agentur-Overhead", "Schnelle Entscheidungen, schlanke Strukturen."),
    ]
    col_w = (CW - 24) / 3
    col_h = 62
    for i, (t, s) in enumerate(cols):
        cx2 = MARGIN + i * (col_w + 12)
        c.setFillColor(CARD)
        c.roundRect(cx2, y - col_h, col_w, col_h, 10, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont(F_B, 9.5)
        c.drawString(cx2 + 12, y - 20, t)
        wrapped(c, s, cx2 + 12, y - 34, col_w - 24, size=7.5, color=MUTED, lh=10)
    y -= col_h + 18

    # Tool-Anschluss
    if d["usedApps"]:
        box_h = 44
        c.setFillColor(CARD)
        c.roundRect(MARGIN, y - box_h, CW, box_h, 10, stroke=0, fill=1)
        c.setFillColor(LIME)
        c.roundRect(MARGIN, y - box_h, 5, box_h, 2.5, stroke=0, fill=1)
        wrapped(c, f"Ihr Stack bleibt: {', '.join(d['usedApps'])} werden angebunden statt ersetzt — "
                   "die KI-Abteilung fügt sich in Ihre bestehende Arbeitsweise ein.",
                MARGIN + 18, y - 18, CW - 36, size=8.5, color=INK_SOFT, lh=11.5)

# ---------------------------------------------------------------------------
# Seite 6 — Nächste Schritte + Kontakt
# ---------------------------------------------------------------------------
def page_schritte(c, d):
    page_frame(c, "Nächste Schritte", 6)
    y = h1(c, "Ihr Weg zu mehr Effizienz", H - 96)
    y = sub(c, "Drei einfache Schritte zum Start — kostenlos und unverbindlich.", y)
    y -= 10

    steps = [
        ("Kostenloses Erstgespräch",
         "30 Minuten. Wir gehen Ihr Ergebnis gemeinsam durch und zeigen konkret, was in den nächsten "
         "90 Tagen möglich ist."),
        ("Maßnahmen-Priorisierung",
         "Auf Basis dieses Audits erstellen wir einen priorisierten Aktionsplan mit klaren ROI-Zielen "
         "je Maßnahme — inklusive BAFA-Förderweg."),
        ("Pilot starten",
         f"Wir beginnen mit Ihrem größten Zeitfresser{(' — ' + d['rows'][0]['sub']) if d['rows'] else ''}. "
         "Schneller Erfolg, messbarer ROI, minimales Risiko."),
    ]
    for i, (t, s) in enumerate(steps, 1):
        card_h = 62
        c.setFillColor(CARD)
        c.roundRect(MARGIN, y - card_h, CW, card_h, 12, stroke=0, fill=1)
        c.setStrokeColor(INK)
        c.setLineWidth(1.2)
        c.roundRect(MARGIN + 16, y - 42, 30, 24, 7, stroke=1, fill=0)
        c.setFillColor(INK)
        c.setFont(F_XB, 10)
        c.drawCentredString(MARGIN + 31, y - 34, f"0{i}")
        c.setFont(F_B, 11.5)
        c.drawString(MARGIN + 60, y - 26, t)
        wrapped(c, s, MARGIN + 60, y - 41, CW - 84, size=8.5, color=INK_SOFT, lh=11.5)
        y -= card_h + 12

    y -= 8
    # CTA-Karte (Ink)
    cta_h = 128
    c.setFillColor(INK)
    c.roundRect(MARGIN, y - cta_h, CW, cta_h, 14, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont(F_XB, 17)
    c.drawString(MARGIN + 22, y - 34, "Jetzt Gespräch vereinbaren")
    c.setFillColor(INK_ON_DARK_MUTED)
    c.setFont(F_REG, 9)
    c.drawString(MARGIN + 22, y - 52, "Kostenlos, unverbindlich, konkret — wir zeigen Ihnen in 30 Minuten,")
    c.drawString(MARGIN + 22, y - 65, "was für Ihr Unternehmen sofort möglich ist.")
    # Kontakt-Pille (Lime, Ink-Text)
    pill_text = CONTACT_MAIL
    ptw = c.stringWidth(pill_text, F_B, 10)
    px = W - MARGIN - ptw - 44
    c.setFillColor(LIME)
    c.roundRect(px, y - 48, ptw + 24, 28, 14, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont(F_B, 10)
    c.drawString(px + 12, y - 38, pill_text)
    c.setFillColor(INK_ON_DARK_MUTED)
    c.setFont(F_REG, 8.5)
    c.drawRightString(W - MARGIN - 22, y - 65, f"{CONTACT_PHONE} · {CONTACT_WEB}")

    c.setStrokeColor(Color(1, 1, 1, alpha=0.2))
    c.setLineWidth(0.7)
    c.line(MARGIN + 22, y - 86, W - MARGIN - 22, y - 86)
    wrapped(c, "Dieser Report basiert auf Ihren Angaben im ROI-Rechner und dient als erste Orientierung. "
               "Konkrete Maßnahmen und belastbare Zahlen erarbeiten wir individuell im Gespräch.",
            MARGIN + 22, y - 100, CW - 44, size=7, color=INK_ON_DARK_MUTED, lh=9.5)

# ---------------------------------------------------------------------------
# Payload → Report
# ---------------------------------------------------------------------------
def normalize(payload):
    d = dict(payload)
    d.setdefault("name", "")
    d.setdefault("company", "")
    d.setdefault("email", "")
    d.setdefault("usedApps", d.get("apps", []))
    d.setdefault("rows", [])
    d.setdefault("entryPrice", 3200)
    ts = d.get("submittedAt")
    try:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00")) if ts else datetime.now(timezone.utc)
    except Exception:
        dt = datetime.now(timezone.utc)
    d["dateStr"] = dt.strftime("%d.%m.%Y")
    return d

def generate_roi_report(payload, out_path):
    register_fonts()
    d = normalize(payload)
    c = canvas.Canvas(out_path, pagesize=(W, H))
    c.setTitle(f"NEWEDGE KI-Audit — {d['company'] or d['name']}")
    for page in (page_cover, page_situation, page_chancen, page_roi, page_empfehlung, page_schritte):
        page(c, d)
        c.showPage()
    c.save()
    return out_path

# ---------------------------------------------------------------------------
if __name__ == "__main__":
    payload_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(BASE_DIR, "sample_roi_lead.json")
    with open(payload_path) as f:
        payload = json.load(f)
    company = (payload.get("company") or payload.get("name") or "Lead").replace(" ", "_")
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(BASE_DIR, f"ROI_Report_{company}.pdf")
    print(generate_roi_report(payload, out))
