#!/usr/bin/env python3
"""Create vertical 9:16 storyboard stubs with UI-safe framing for adult evening CGs.

Game layout: `.scene` is flex:1 above the dialogue panel (not a full-bleed overlay).
With background-size:cover the phone crops ~12% top (tools/location) and ~20–35%
bottom (depending on choices / short viewports). Keep face+torso+waist in the
middle band; put the black inpaint bar so important body detail ends by ~65%.
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "assets"
ART = ROOT / "artwork" / "adult-evenings"
PHOTOS = set(json.loads((ART / "PHOTOS.json").read_text(encoding="utf-8")).get("files", []))
PEOPLE = [
    "milica", "dragan", "jelena", "asya", "luka", "ana", "stefan", "marko",
    "vuk", "lazar", "teodora", "ivana", "strahinya", "milos",
]
# beat -> (inpaint label, bar as fractions l,t,r,b)
# Bars stay mostly above the dialogue crop (~0.65).
BEATS = [
    ("seductive", "look", (0.28, 0.42, 0.72, 0.64)),
    ("door", "door", (0.26, 0.40, 0.74, 0.64)),
    ("briefs", "bed", (0.22, 0.40, 0.78, 0.64)),
    ("touch", "touch", (0.24, 0.42, 0.76, 0.64)),
    ("ready", "ready", (0.20, 0.38, 0.80, 0.64)),
    ("sex", "sex", (0.18, 0.36, 0.82, 0.64)),
    ("climax", "face", (0.28, 0.22, 0.72, 0.48)),
    ("cum-inside", "finish", (0.22, 0.40, 0.78, 0.64)),
    ("cum-cloth", "finish", (0.22, 0.40, 0.78, 0.64)),
    ("cum-chest", "finish", (0.26, 0.34, 0.74, 0.60)),
    ("afterglow", "after", (0.22, 0.42, 0.78, 0.64)),
]
W, H = 1080, 1920
# UI bands as fractions of canvas height (guides for artists / inpaint).
TOP_UI = 0.10
DIALOGUE_CROP = 0.65


def font(size: int):
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def make(person: str, beat: str, label: str, bar: tuple[float, float, float, float]) -> Path:
    img = Image.new("RGB", (W, H), (18, 22, 34))
    draw = ImageDraw.Draw(img)
    # Warm lamp pool centered on face band (below top UI)
    face_cy = int(H * 0.28)
    for r, a in ((520, 40), (360, 70), (220, 110)):
        overlay = Image.new("RGB", (W, H), (18, 22, 34))
        od = ImageDraw.Draw(overlay)
        od.ellipse((W // 2 - r, face_cy - r, W // 2 + r, face_cy + r), fill=(70, 48, 28))
        img = Image.blend(img, overlay, a / 255)
        draw = ImageDraw.Draw(img)
    # Head / shoulders silhouette — fully above dialogue crop
    cx, cy = W // 2, int(H * 0.28)
    draw.ellipse((cx - 120, cy - 150, cx + 120, cy + 150), fill=(42, 36, 48))
    draw.rounded_rectangle((cx - 160, cy + 120, cx + 160, int(H * 0.48)), radius=40, fill=(42, 36, 48))
    # Black inpaint bar (important body detail ends by DIALOGUE_CROP)
    x0, y0, x1, y1 = bar
    draw.rectangle((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)), fill=(0, 0, 0))
    # Soft ambient fill under dialogue crop — no critical detail
    draw.rectangle((0, int(H * DIALOGUE_CROP), W, H), fill=(14, 16, 24))
    # UI guides (not part of final art intent — thin dashed cues for inpaint)
    guide = ImageDraw.Draw(img)
    y_top = int(H * TOP_UI)
    y_bot = int(H * DIALOGUE_CROP)
    guide.line([(40, y_top), (W - 40, y_top)], fill=(90, 70, 50), width=2)
    guide.line([(40, y_bot), (W - 40, y_bot)], fill=(90, 70, 50), width=2)
    # Labels
    title = f"{person} · {beat}"
    draw.text((48, 48), "SERBIAN SUMMER · 18+ STORYBOARD", fill=(180, 160, 120), font=font(28))
    draw.text((48, 100), title, fill=(240, 230, 210), font=font(44))
    draw.text((48, 170), f"inpaint zone: {label}", fill=(160, 150, 140), font=font(28))
    draw.text((48, 210), "safe: face+torso above lower line · top line = tools", fill=(130, 120, 110), font=font(22))
    draw.text((48, H - 80), "replace black bar only · keep face · UI crops bottom", fill=(140, 130, 120), font=font(24))
    out = OUT / f"{person}-night-{beat}-v1.webp"
    img.save(out, "WEBP", quality=86, method=6)
    return out


def main() -> None:
    ART.mkdir(parents=True, exist_ok=True)
    made = []
    skipped = []
    for person in PEOPLE:
        for beat, label, bar in BEATS:
            name = f"{person}-night-{beat}-v1.webp"
            if name in PHOTOS:
                skipped.append(name)
                continue
            made.append(make(person, beat, label, bar).name)
    manifest = {
        "note": (
            "Storyboard stubs with UI-safe framing. Head ~28% height; inpaint bars end by 65%; "
            "bottom band is dialogue/cover crop. Nikola reuses riverside-night CGs. "
            "Males: target opaque speedos (shirtless). Photos already present were left untouched."
        ),
        "canvas": {"w": W, "h": H},
        "ui_bands": {"top_tools": TOP_UI, "dialogue_crop_from": DIALOGUE_CROP},
        "position_hint": "50% 35%",
        "files": made,
        "skipped_photos": skipped,
        "beats": [b[0] for b in BEATS],
        "people": PEOPLE,
    }
    (ART / "STORYBOARDS.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(made)} storyboards, kept {len(skipped)} photos → {OUT}")


if __name__ == "__main__":
    main()
