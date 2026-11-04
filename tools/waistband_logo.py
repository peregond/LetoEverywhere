#!/usr/bin/env python3
"""Replace the garbled waistband lettering with a clean wordmark.

Run with the ComfyUI python (has Pillow):
  ~/ComfyUI-Installs/ComfyUI/standalone-env/bin/python3 tools/waistband_logo.py IN OUT \
      --erase 312,866,104,44 --center 432,887 --height 20
"""
import argparse
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'


def main():
    p = argparse.ArgumentParser()
    p.add_argument('src')
    p.add_argument('dst')
    p.add_argument('--erase', help='x,y,w,h of old lettering to cover; skip if the band is already clean')
    p.add_argument('--center', required=True, help='x,y where the new wordmark is centred')
    p.add_argument('--height', type=int, default=20)
    p.add_argument('--text', default='CALVIN KLEIN')
    p.add_argument('--tracking', type=float, default=0.18, help='extra letter spacing, fraction of height')
    p.add_argument('--angle', type=float, default=0.0)
    a = p.parse_args()

    img = Image.open(a.src).convert('RGB')
    if a.erase:
        x, y, w, h = map(int, a.erase.split(','))
        # Stretch a clean strip of band from just right of the lettering so the patch keeps the band's shading.
        patch = img.crop((x + w + 4, y, x + w + 16, y + h)).resize((w, h), Image.BILINEAR)
        mask = Image.new('L', (w, h), 0)
        ImageDraw.Draw(mask).rectangle((10, 4, w - 6, h - 4), fill=255)
        img.paste(patch, (x, y), mask.filter(ImageFilter.GaussianBlur(6)))

    font = ImageFont.truetype(FONT, a.height)
    spacing = a.height * a.tracking
    widths = [font.getlength(c) for c in a.text]
    total = sum(widths) + spacing * (len(a.text) - 1)
    layer = Image.new('L', (int(total) + 20, a.height * 2), 0)
    draw = ImageDraw.Draw(layer)
    cx = 10.0
    for c, cw in zip(a.text, widths):
        draw.text((cx, a.height * 0.35), c, font=font, fill=235)
        cx += cw + spacing
    layer = layer.rotate(a.angle, resample=Image.BICUBIC, expand=True).filter(ImageFilter.GaussianBlur(0.6))
    tx, ty = map(int, a.center.split(','))
    ink = Image.new('RGB', layer.size, (226, 222, 216))
    img.paste(ink, (tx - layer.width // 2, ty - layer.height // 2), layer)
    img.save(a.dst)
    print('saved', a.dst)


if __name__ == '__main__':
    main()
