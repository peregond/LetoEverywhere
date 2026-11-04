#!/usr/bin/env python3
"""Refine one image on the local ComfyUI (free, no API nodes).

Usage: python3 tools/comfy_one.py --tag v1 [--seed N] [--denoise 0.42] [--ckpt ponyRealism_v21MainVAE.safetensors]
Result: artwork/nikola-one/<tag>.png
"""
import argparse, json, pathlib, time, urllib.parse, urllib.request, uuid

URL = 'http://127.0.0.1:8188'
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'artwork' / 'nikola-one'

POSITIVE = """score_9, score_8_up, score_7_up, semi-realistic digital painting, premium visual novel CG,
1man, solo, adult man, very short dark buzz cut, shaved sides, light stubble, thick dark eyebrows, dark eyes, warm tan skin,
muscular athletic body, broad shoulders, defined abs, light chest hair,
sitting on the edge of a bed, small apartment bedroom at night, warm bedside lamp, soft shadows,
wearing only white Calvin Klein briefs, thick black elastic waistband with white "Calvin Klein" logo text,
shirtless, barefoot, shy wanting expression, faint smile,
natural proportions, detailed hands, coherent background, cinematic warm lighting"""

NEGATIVE = """score_4, score_5, score_6, source_anime, source_cartoon, 3d render, lowres, blurry, jpeg artifacts,
bad anatomy, extra limbs, extra fingers, fused fingers, deformed hands, long neck, small head,
duplicate, 2boys, woman, jeans, pants, shirt, long hair, side part, pompadour, watermark, signature, censor bar,
see-through fabric, transparent underwear, wet fabric, exposed penis, nude,
scar, pale skin, red hair, ginger hair, makeup"""


def http(path, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(URL + path, data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def inpaint(wf, a):
    x, y, w, h = map(int, a.mask.split(','))
    wf.update({
        '11': {'class_type': 'SolidMask', 'inputs': {'value': 0.0, 'width': a.width, 'height': a.height}},
        '12': {'class_type': 'SolidMask', 'inputs': {'value': 1.0, 'width': w, 'height': h}},
        '13': {'class_type': 'FeatherMask', 'inputs': {'mask': ['12', 0], 'left': 48, 'top': 48, 'right': 48, 'bottom': 48}},
        '14': {'class_type': 'MaskComposite', 'inputs': {'destination': ['11', 0], 'source': ['13', 0],
                                                         'x': x, 'y': y, 'operation': 'add'}},
        '15': {'class_type': 'SetLatentNoiseMask', 'inputs': {'samples': ['5', 0], 'mask': ['14', 0]}},
        '16': {'class_type': 'ImageCompositeMasked', 'inputs': {'destination': ['4', 0], 'source': ['9', 0],
                                                                'x': 0, 'y': 0, 'resize_source': False, 'mask': ['14', 0]}},
    })
    wf['8']['inputs']['latent_image'] = ['15', 0]
    wf['10']['inputs']['images'] = ['16', 0]
    return wf


def workflow(a):
    wf = {
        '1': {'class_type': 'CheckpointLoaderSimple', 'inputs': {'ckpt_name': a.ckpt}},
        '2': {'class_type': 'CLIPSetLastLayer', 'inputs': {'clip': ['1', 1], 'stop_at_clip_layer': a.clip_skip}},
        '3': {'class_type': 'LoadImage', 'inputs': {'image': a.image}},
        '4': {'class_type': 'ImageScale', 'inputs': {'image': ['3', 0], 'upscale_method': 'lanczos',
                                                     'width': a.width, 'height': a.height, 'crop': 'center'}},
        '5': {'class_type': 'VAEEncode', 'inputs': {'pixels': ['4', 0], 'vae': ['1', 2]}},
        '6': {'class_type': 'CLIPTextEncode', 'inputs': {'text': a.positive, 'clip': ['2', 0]}},
        '7': {'class_type': 'CLIPTextEncode', 'inputs': {'text': NEGATIVE + ', ' + a.negative_extra, 'clip': ['2', 0]}},
        '8': {'class_type': 'KSampler', 'inputs': {
            'model': ['1', 0], 'positive': ['6', 0], 'negative': ['7', 0], 'latent_image': ['5', 0],
            'seed': a.seed, 'steps': a.steps, 'cfg': a.cfg, 'sampler_name': a.sampler,
            'scheduler': 'karras', 'denoise': a.denoise}},
        '9': {'class_type': 'VAEDecode', 'inputs': {'samples': ['8', 0], 'vae': ['1', 2]}},
        '10': {'class_type': 'SaveImage', 'inputs': {'images': ['9', 0],
                                                     'filename_prefix': f'SerbianSummer/nikola/one-{a.tag}'}},
    }
    if not a.image:
        del wf['3'], wf['4']
        wf['5'] = {'class_type': 'EmptyLatentImage', 'inputs': {'width': a.width, 'height': a.height, 'batch_size': 1}}
        wf['8']['inputs']['denoise'] = 1.0
    if a.face_ref:
        wf.update({
            '20': {'class_type': 'IPAdapterUnifiedLoader', 'inputs': {'model': ['1', 0], 'preset': 'PLUS FACE (portraits)'}},
            '21': {'class_type': 'LoadImage', 'inputs': {'image': a.face_ref}},
            '22': {'class_type': 'IPAdapterAdvanced', 'inputs': {
                'model': ['20', 0], 'ipadapter': ['20', 1], 'image': ['21', 0], 'weight': a.face_weight,
                'weight_type': 'linear', 'combine_embeds': 'concat', 'start_at': 0.0, 'end_at': 1.0,
                'embeds_scaling': 'V only'}},
        })
        wf['8']['inputs']['model'] = ['22', 0]
    return inpaint(wf, a) if a.mask else wf


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--tag', required=True)
    p.add_argument('--image', default='nikola-one-briefs-base.png', help="Comfy input image; '' for text-to-image")
    p.add_argument('--ckpt', default='ponyRealism_v21MainVAE.safetensors')
    p.add_argument('--seed', type=int, default=20261028)
    p.add_argument('--denoise', type=float, default=0.42)
    p.add_argument('--steps', type=int, default=30)
    p.add_argument('--cfg', type=float, default=6.0)
    p.add_argument('--positive', default=POSITIVE)
    p.add_argument('--mask', help='x,y,w,h of the only area to redraw, in 768x1344 pixels')
    p.add_argument('--face-ref', help='Comfy input image whose face the result should match')
    p.add_argument('--face-weight', type=float, default=0.85)
    p.add_argument('--size', default='768x1344', help='WxH the input is scaled to before sampling')
    p.add_argument('--clip-skip', type=int, default=-2, help='-2 for Pony, -1 for Juggernaut')
    p.add_argument('--sampler', default='dpmpp_2m_sde')
    p.add_argument('--negative-extra', default='')
    a = p.parse_args()
    a.width, a.height = map(int, a.size.split('x'))

    pid = json.loads(http('/prompt', {'prompt': workflow(a), 'client_id': str(uuid.uuid4())}))['prompt_id']
    print('queued', pid, flush=True)
    while True:
        time.sleep(3)
        hist = json.loads(http(f'/history/{pid}'))
        if pid not in hist:
            continue
        status = hist[pid]['status']
        if status.get('status_str') == 'error':
            for kind, msg in status.get('messages', []):
                if kind == 'execution_error':
                    raise SystemExit(msg.get('exception_message'))
        for out in hist[pid]['outputs'].values():
            for img in out.get('images', []):
                qs = urllib.parse.urlencode({k: img.get(k, '') for k in ('filename', 'subfolder', 'type')})
                OUT.mkdir(parents=True, exist_ok=True)
                dest = OUT / f'{a.tag}.png'
                dest.write_bytes(http('/view?' + qs))
                print('saved', dest)
        return


if __name__ == '__main__':
    main()
