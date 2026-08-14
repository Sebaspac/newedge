#!/usr/bin/env python3
"""
Erzeugt Favicon, PWA-Icons, Apple-Touch-Icon und das OG-Vorschaubild
aus den vorhandenen Marken-Assets — kein neues Design, nur Komposition:

  Icons  →  „NE" (aus der Wortmarke src/assets/newedge-wordmark.webp)
            auf Lime #CCFF00, abgerundete Kachel
  OG     →  weiße Wortmarke auf Ink #171717

Aufruf (aus dem Repo-Root):  python3 scripts/gen-brand-icons.py

Warum ein Skript: Die Icons lassen sich so jederzeit neu erzeugen, wenn sich
die Wortmarke ändert — statt Binärdateien ohne nachvollziehbare Herkunft.
"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "assets"
PUB = ROOT / "public"

LIME = (204, 255, 0, 255)   # #CCFF00
INK = (23, 23, 23, 255)     # #171717

# ── Quelle: „NE" aus der Wortmarke schneiden ────────────────────────────────
wordmark = Image.open(SRC / "newedge-wordmark.webp").convert("RGBA")
# Buchstabenlücken der Wortmarke: N endet ~94, E endet ~182 (bei 633px Breite)
ne = wordmark.crop((0, 0, int(wordmark.width * 185 / 633), wordmark.height))
ne = ne.crop(ne.getbbox())


def tile(size: int, radius_ratio: float = 0.22, pad_ratio: float = 0.18) -> Image.Image:
    """Lime-Kachel mit abgerundeten Ecken und zentriertem dunklem „NE"."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size - 1, size - 1], radius=int(size * radius_ratio), fill=255
    )
    bg = Image.new("RGBA", (size, size), LIME)
    img.paste(bg, (0, 0), mask)

    inner = int(size * (1 - 2 * pad_ratio))
    scale = min(inner / ne.width, inner / ne.height)
    mark = ne.resize((max(1, int(ne.width * scale)), max(1, int(ne.height * scale))), Image.LANCZOS)
    # Wortmarke ist schwarz → auf Ink einfärben, Alpha als Maske
    solid = Image.new("RGBA", mark.size, INK)
    img.alpha_composite(solid_masked(solid, mark), ((size - mark.width) // 2, (size - mark.height) // 2))
    return img


def solid_masked(solid: Image.Image, mark: Image.Image) -> Image.Image:
    out = solid.copy()
    out.putalpha(mark.getchannel("A"))
    return out


def maskable(size: int) -> Image.Image:
    """Vollflächige Lime-Kachel (Android maskable: Ecken werden beschnitten)."""
    img = Image.new("RGBA", (size, size), LIME)
    inner = int(size * 0.55)          # Safe-Zone: Motiv deutlich kleiner
    scale = min(inner / ne.width, inner / ne.height)
    mark = ne.resize((max(1, int(ne.width * scale)), max(1, int(ne.height * scale))), Image.LANCZOS)
    solid = Image.new("RGBA", mark.size, INK)
    img.alpha_composite(solid_masked(solid, mark), ((size - mark.width) // 2, (size - mark.height) // 2))
    return img


def og_image() -> Image.Image:
    """1200×630 — weiße Wortmarke auf Ink, mit Lime-Linie als Marken-Akzent."""
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), INK)
    wm = Image.open(SRC / "newedge-wordmark-white.webp").convert("RGBA")
    target_w = int(W * 0.56)
    scale = target_w / wm.width
    wm = wm.resize((target_w, max(1, int(wm.height * scale))), Image.LANCZOS)
    img.alpha_composite(wm, ((W - wm.width) // 2, (H - wm.height) // 2 - 18))
    # Lime-Akzentlinie unter der Wortmarke
    d = ImageDraw.Draw(img)
    y = (H - wm.height) // 2 + wm.height + 46
    d.rounded_rectangle([W // 2 - 70, y, W // 2 + 70, y + 7], radius=4, fill=LIME)
    return img


def main() -> None:
    (PUB / "icons").mkdir(parents=True, exist_ok=True)

    # Favicon: mehrere Größen in einer .ico
    ico = PUB / "favicon.ico"
    tile(256).save(ico, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print("✓", ico.relative_to(ROOT))

    for size in (32, 180, 192, 512):
        name = "apple-touch-icon.png" if size == 180 else f"icon-{size}.png"
        p = PUB / "icons" / name
        tile(size).save(p)
        print("✓", p.relative_to(ROOT))

    for size in (192, 512):
        p = PUB / "icons" / f"icon-maskable-{size}.png"
        maskable(size).save(p)
        print("✓", p.relative_to(ROOT))

    og = PUB / "og-default.jpg"
    og_image().convert("RGB").save(og, quality=90)
    print("✓", og.relative_to(ROOT), "(1200×630)")


if __name__ == "__main__":
    main()
