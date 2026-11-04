#!/usr/bin/env python3
"""Queue ComfyUI img2img jobs for Nikola early-night placeholders. Credentials via env only."""
import json, os, sys, time, uuid, urllib.request, urllib.error, urllib.parse, base64, pathlib

URL = os.environ['COMFY_URL'].rstrip('/')
AUTH = 'Basic ' + base64.b64encode(os.environ['COMFY_AUTH'].encode()).decode()
CKPT = 'waiIllustriousSDXL_v170.safetensors'
OUT_DIR = pathlib.Path('public/assets')
CLIENT = str(uuid.uuid4())

NEG = (
  'child, loli, shota, underage, female, woman, jeans, denim, pants, trousers, '
  'shirt, t-shirt, polo, jacket, hoodie, open shirt, button-up, bodybuilder, exaggerated muscles, '
  'oil skin, hyper muscular, lowres, blurry, bad anatomy, extra limbs, text, watermark, logo, ui, cropped head'
)
BASE = (
  'masterpiece, best quality, semi-realistic hand-painted visual novel illustration, '
  '1boy, adult man 29 years old, very short dark buzz cut hair, neat short stubble, warm brown eyes, '
  'tall naturally athletic bakery-worker build, strong shoulders, believable muscle not bodybuilder, '
  'handsome individual face matching reference, SHIRTLESS, bare torso, no shirt, no jacket, '
)

REF = 'nikola-ref.webp'  # shirtless dream-bare identity upload

JOBS = [
  dict(name='nikola-briefs-bulge-v1', ref=REF, denoise=0.754, seed=13001,
       prompt=BASE + 'sitting on bed edge, ONLY wearing plain white Calvin Klein style cotton briefs dark waistband, '
       'clear erect bulge outline through white fabric, precum damp spot, shy aroused look, '
       'bedroom warm lamp, cream sheets, full body head to knees'),
  dict(name='nikola-briefs-touch-v1', ref=REF, denoise=0.752, seed=13002,
       prompt=BASE + 'ONLY white cotton briefs dark waistband, hand grabbing erect bulge through fabric, '
       'stretched briefs, flushed shy moan, bedroom lamp, cream sheets'),
  dict(name='nikola-jock-ready-v1', ref=REF, denoise=0.75, seed=13003,
       prompt=BASE + 'on all fours on bed looking back flirty, ONLY white jockstrap dark waistband, '
       'pouch with erection, bare buttocks, bedroom lamp, cream sheets'),
  dict(name='nikola-jock-fuck-v1', ref=REF, denoise=0.752, seed=13004,
       prompt=BASE + 'on all fours, white jockstrap on, being fucked from behind by grey male silhouette, '
       'penetration visible, arched back, moaning looking back, bedroom lamp, cream sheets, explicit'),
  dict(name='nikola-cum-inside-v1', ref=REF, denoise=0.752, seed=13005,
       prompt=BASE + 'on all fours after sex, white jockstrap, cum leaking, trembling, flushed laugh, '
       'bedroom lamp, cream sheets, explicit'),
  dict(name='nikola-cum-jock-v1', ref=REF, denoise=0.75, seed=13006,
       prompt=BASE + 'on all fours looking back, white jockstrap covered in fresh cum on waistband and pouch, '
       'bedroom lamp, explicit'),
  dict(name='nikola-cum-chest-v1', ref=REF, denoise=0.754, seed=13007,
       prompt=BASE + 'lying on back on cream sheets, white jockstrap pulled aside, cum on chest nipples neck, '
       'flushed climax face, bedroom lamp, explicit'),
]

def api(path, data=None, method=None):
  headers = {'Authorization': AUTH}
  body = None
  if data is not None:
    body = json.dumps(data).encode()
    headers['Content-Type'] = 'application/json'
  req = urllib.request.Request(URL + path, data=body, headers=headers, method=method or ('POST' if body else 'GET'))
  with urllib.request.urlopen(req, timeout=120) as r:
    return json.load(r)

def workflow(job):
  # SDXL portrait latent ~832x1216
  w, h = 832, 1216
  return {
    '1': {'class_type': 'CheckpointLoaderSimple', 'inputs': {'ckpt_name': CKPT}},
    '2': {'class_type': 'CLIPTextEncode', 'inputs': {'text': job['prompt'], 'clip': ['1', 1]}},
    '3': {'class_type': 'CLIPTextEncode', 'inputs': {'text': NEG, 'clip': ['1', 1]}},
    '4': {'class_type': 'LoadImage', 'inputs': {'image': job['ref']}},
    '5': {'class_type': 'ImageScale', 'inputs': {
      'image': ['4', 0], 'upscale_method': 'lanczos', 'width': w, 'height': h,
      'crop': 'center'
    }},
    '6': {'class_type': 'VAEEncode', 'inputs': {'pixels': ['5', 0], 'vae': ['1', 2]}},
    '7': {'class_type': 'KSampler', 'inputs': {
      'model': ['1', 0], 'seed': job['seed'], 'steps': 28, 'cfg': 5.5,
      'sampler_name': 'euler_ancestral', 'scheduler': 'normal',
      'positive': ['2', 0], 'negative': ['3', 0], 'latent_image': ['6', 0],
      'denoise': job['denoise']
    }},
    '8': {'class_type': 'VAEDecode', 'inputs': {'samples': ['7', 0], 'vae': ['1', 2]}},
    '9': {'class_type': 'SaveImage', 'inputs': {'images': ['8', 0], 'filename_prefix': job['name']}},
  }

def wait(prompt_id, timeout=300):
  t0 = time.time()
  while time.time() - t0 < timeout:
    hist = api(f'/history/{prompt_id}')
    if prompt_id in hist and hist[prompt_id].get('outputs'):
      return hist[prompt_id]
    time.sleep(2)
  raise TimeoutError(prompt_id)

def download(filename, subfolder, out_path):
  q = f'/view?filename={urllib.parse.quote(filename)}&subfolder={urllib.parse.quote(subfolder)}&type=output'
  req = urllib.request.Request(URL + q, headers={'Authorization': AUTH})
  with urllib.request.urlopen(req, timeout=120) as r:
    out_path.write_bytes(r.read())

def main():
  only = set(sys.argv[1:]) if len(sys.argv) > 1 else None
  jobs = [j for j in JOBS if only is None or j['name'] in only]
  print(f'queueing {len(jobs)} jobs on {URL}')
  results = []
  for job in jobs:
    wf = workflow(job)
    res = api('/prompt', {'prompt': wf, 'client_id': CLIENT})
    pid = res['prompt_id']
    print('queued', job['name'], pid)
    results.append((job, pid))
  for job, pid in results:
    print('waiting', job['name'], '...')
    hist = wait(pid)
    images = hist['outputs']['9']['images']
    img = images[0]
    tmp = pathlib.Path('/tmp') / f"{job['name']}.png"
    download(img['filename'], img.get('subfolder', ''), tmp)
    # convert via ffmpeg to webp
    webp = OUT_DIR / f"{job['name']}.webp"
    os.system(f'ffmpeg -y -i {tmp} -c:v libwebp -quality 88 {webp} >/dev/null 2>&1')
    print('saved', webp, webp.stat().st_size)

if __name__ == '__main__':
  main()
