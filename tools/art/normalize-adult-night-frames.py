#!/usr/bin/env python3
"""Reframe adult night photo CGs onto locked 1080×1920 with UI-safe composition.

Only touches files listed in artwork/adult-evenings/PHOTOS.json.
Keeps the subject higher so head clears the top tools band (~10%) and
waist/speedo stay above the dialogue cover-crop (~65% of canvas height).
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "public" / "assets"
ART = ROOT / "artwork" / "adult-evenings"
PHOTOS = json.loads((ART / "PHOTOS.json").read_text(encoding="utf-8")).get("files", [])
W, H = 1080, 1920
TARGET_CONTENT_MID = 0.40


def subject_bbox(im: Image.Image) -> tuple[int, int, int, int]:
    gray = im.convert("L")
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edges = ImageEnhance.Contrast(edges).enhance(2.0)
    w, h = edges.size
    data = edges.load()
    ys, xs = [], []
    step = 4
    for y in range(0, h, step):
        for x in range(int(w * 0.08), int(w * 0.92), step):
            if data[x, y] > 28:
                xs.append(x)
                ys.append(y)
    if len(xs) < 40:
        return (int(w * 0.15), int(h * 0.08), int(w * 0.85), int(h * 0.85))
    pad_x, pad_y = int(w * 0.04), int(h * 0.03)
    return (
        max(0, min(xs) - pad_x),
        max(0, min(ys) - pad_y),
        min(w, max(xs) + pad_x),
        min(h, max(ys) + pad_y),
    )


def fit_ui_safe(src: Image.Image) -> Image.Image:
    src = src.convert("RGB")
    sw, sh = src.size
    x0, y0, x1, y1 = subject_bbox(src)
    sub_w = max(1, x1 - x0)
    sub_h = max(1, y1 - y0)

    scale_w = (W * 0.82) / sub_w
    scale_h = (H * 0.70) / sub_h
    scale = min(scale_w, scale_h)
    cover = max(W / sw, H / sh)
    scale = max(scale, cover * 0.92)

    nw, nh = max(1, int(sw * scale)), max(1, int(sh * scale))
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)

    sub_mid_px = ((y0 + y1) / 2) * scale
    top = int(TARGET_CONTENT_MID * H - sub_mid_px)
    if nh >= H:
        top = max(H - nh, min(0, top))
    else:
        top = max(0, min(H - nh, top))

    left = (W - nw) // 2
    if nw >= W:
        sub_mid_x = ((x0 + x1) / 2) * scale
        left = int(W / 2 - sub_mid_x)
        left = max(W - nw, min(0, left))

    canvas = Image.new("RGB", (W, H), (18, 22, 34))
    edge = resized.crop((0, max(0, nh // 3), nw, max(1, nh // 3 + 1))).resize((W, H))
    canvas.paste(edge)
    canvas.paste(resized, (left, top))
    return canvas


def main() -> None:
    changed = []
    for name in PHOTOS:
        path = ASSETS / name
        if not path.exists():
            print("missing", name)
            continue
        out = fit_ui_safe(Image.open(path))
        out.save(path, "WEBP", quality=90, method=6)
        changed.append(name)
    print(f"normalized {len(changed)} photos from PHOTOS.json")
    for name in changed:
        print(" ", name)


if __name__ == "__main__":
    main()
