#!/usr/bin/env python3
"""Refine one base image on the local ComfyUI with a free checkpoint (no API nodes).

Usage:
  python3 tools/comfy_one_local.py --ckpt jugg --denoise 0.35 --out /tmp/nikola-one-jugg.png
"""
import argparse, json, time, urllib.parse, urllib.request, uuid

URL = 'http://127.0.0.1:8188'

CKPTS = {
    'jugg': 'Juggernaut-XL_v9_RunDiffusionPhoto_v2.safetensors',
    'pony': 'ponyRealism_v21MainVAE.safetensors',
    'wai': 'waiIllustriousSDXL_v170.safetensors',
}

SUBJECT = (
    'adult man sitting on the edge of a bed in a small apartment at night, '
    'short dark buzz cut, light stubble, thick dark eyebrows, warm tan skin, '
    'very muscular athletic body, broad chest, defined abs, '
    'wearing only plain white cotton briefs, shirtless, '
    'looking up at the viewer with a shy warm wanting expression, faint smile, '
    'hands resting on the mattress, warm bedside lamp light, soft shadows, '
    'cozy dim bedroom, natural anatomy, correct hands'
)

POSITIVE = {
    'jugg': 'semi-realistic digital painting, premium visual novel CG, cinematic lighting, '
            'detailed skin shading, ' + SUBJECT,
    'pony': 'score_9, score_8_up, score_7_up, semi-realistic, digital painting, '
            'visual novel CG, cinematic lighting, ' + SUBJECT,
    'wai': 'masterpiece, best quality, semi-realistic, ' + SUBJECT,
}

NEGATIVE = (
    'anime, cartoon, lineart, deformed anatomy, extra limbs, extra fingers, fused fingers, '
    'bad hands, duplicated body, small head, long neck, floating objects, broken furniture, '
    'jeans, pants, shirt, text, watermark, logo, blurry, lowres, jpeg artifacts'
)
NEGATIVE_PONY = 'score_4, score_5, score_6, ' + NEGATIVE


def http(path, data=None):
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(URL + path, data=body,
                                 headers={'Content-Type': 'application/json'} if body else {})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ckpt', choices=CKPTS, required=True)
    ap.add_argument('--base', default='nikola-one-briefs-base.png')
    ap.add_argument('--denoise', type=float, default=0.35)
    ap.add_argument('--steps', type=int, default=30)
    ap.add_argument('--cfg', type=float, default=5.0)
    ap.add_argument('--seed', type=int, default=424242)
    ap.add_argument('--prompt', help='override positive prompt')
    ap.add_argument('--out', required=True)
    a = ap.parse_args()

    wf = {
        '1': {'class_type': 'CheckpointLoaderSimple', 'inputs': {'ckpt_name': CKPTS[a.ckpt]}},
        '2': {'class_type': 'LoadImage', 'inputs': {'image': a.base}},
        '3': {'class_type': 'ImageScaleToTotalPixels',
              'inputs': {'image': ['2', 0], 'upscale_method': 'lanczos', 'megapixels': 1.0, 'resolution_steps': 8}},
        '4': {'class_type': 'VAEEncode', 'inputs': {'pixels': ['3', 0], 'vae': ['1', 2]}},
        '5': {'class_type': 'CLIPTextEncode', 'inputs': {'text': a.prompt or POSITIVE[a.ckpt], 'clip': ['1', 1]}},
        '6': {'class_type': 'CLIPTextEncode',
              'inputs': {'text': NEGATIVE_PONY if a.ckpt == 'pony' else NEGATIVE, 'clip': ['1', 1]}},
        '7': {'class_type': 'KSampler', 'inputs': {
            'model': ['1', 0], 'positive': ['5', 0], 'negative': ['6', 0], 'latent_image': ['4', 0],
            'seed': a.seed, 'steps': a.steps, 'cfg': a.cfg,
            'sampler_name': 'dpmpp_2m', 'scheduler': 'karras', 'denoise': a.denoise}},
        '8': {'class_type': 'VAEDecode', 'inputs': {'samples': ['7', 0], 'vae': ['1', 2]}},
        '9': {'class_type': 'SaveImage', 'inputs': {'images': ['8', 0],
                                                     'filename_prefix': f'SerbianSummer/nikola/one-{a.ckpt}'}},
    }

    pid = json.loads(http('/prompt', {'prompt': wf, 'client_id': str(uuid.uuid4())}))['prompt_id']
    print('queued', pid, a.ckpt, 'denoise', a.denoise)
    while True:
        time.sleep(3)
        hist = json.loads(http(f'/history/{pid}'))
        if pid not in hist:
            continue
        st = hist[pid]['status']
        if st.get('status_str') == 'error':
            for m in st.get('messages', []):
                if m[0] == 'execution_error':
                    raise SystemExit('ERROR: ' + m[1].get('exception_message', ''))
        for out in hist[pid]['outputs'].values():
            for img in out.get('images', []):
                qs = urllib.parse.urlencode({'filename': img['filename'], 'subfolder': img['subfolder'], 'type': img['type']})
                open(a.out, 'wb').write(http('/view?' + qs))
                print('saved', a.out)
                return


if __name__ == '__main__':
    main()
