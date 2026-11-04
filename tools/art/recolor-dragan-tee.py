"""Recolours the black Under Armour tee on Dragan's seated kitchen pose into a grey or white one.
Not generated art: the shirt region is found by flood fill and re-lit from the original shading.
Usage: python3 tools/art/recolor-dragan-tee.py
Writes public/assets/dragan-kitchen-borrowed-layer-{grey,white}-v1.webp"""
from PIL import Image, ImageFilter, ImageDraw
import numpy as np
src=Image.open('public/assets/dragan-kitchen-borrowed-layer-v1.webp').convert('RGBA')
a=np.array(src).astype(float);H,W=a.shape[:2]
rgb=a[...,:3];al=a[...,3];lum=rgb.mean(axis=2);sat=rgb.max(axis=2)-rgb.min(axis=2)
yy,xx=np.mgrid[0:H,0:W]
# Above the collar line the beard hangs over the neck: keep the middle strip out of the candidate area.
beard=(yy<0.29*H)&(xx>0.31*W)&(xx<0.43*W)  # lower left of the beard, still touching the collar
cand=(al>128)&(lum<105)&(sat<50)&(yy<0.705*H)&(yy>0.18*H)&~beard
# Thin dark joints between the beard and the collar are cut by eroding before the flood fill, then restored.
core=np.array(Image.fromarray((cand*255).astype('uint8')).filter(ImageFilter.MinFilter(9)))>0
ys,xs=np.where(core);d=(ys-0.52*H)**2+(xs-0.5*W)**2;i=d.argmin();seed=(int(xs[i]),int(ys[i]))
mimg=Image.fromarray((core*255).astype('uint8')).copy()
ImageDraw.floodfill(mimg,seed,128,thresh=0)
core_shirt=(np.array(mimg)==128)
m=np.array(Image.fromarray((core_shirt*255).astype('uint8')).filter(ImageFilter.MaxFilter(9)))>0
m&=cand
grown=np.array(Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.MaxFilter(5)))>0
grow=grown&(lum<150)&(al>0)&(yy<0.71*H)&~beard
mm=np.array(Image.fromarray((grow*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.0))).astype(float)/255
def recolor(kind):
    out=a.copy()
    if kind=='grey':
        t=np.clip(92+lum*1.8,0,215);col=np.stack([t*0.98,t,t*1.04],axis=2)
    else:
        t=np.clip(186+lum*1.15,0,252);col=np.stack([t,t*0.995,t*0.985],axis=2)
    out[...,:3]=rgb*(1-mm[...,None])+col*mm[...,None]
    return Image.fromarray(np.clip(out,0,255).astype('uint8'),'RGBA')
for kind in ('grey','white'):
    recolor(kind).save(f'public/assets/dragan-kitchen-borrowed-layer-{kind}-v1.webp',quality=92,method=6)
print('mask pixels',int(m.sum()))
