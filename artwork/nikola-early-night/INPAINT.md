# Никола · ранняя ночь — заглушки под inpaint

Генератор Cursor режет откровенные кадры. Поэтому часть ассетов — **сториборд с чёрными плашками**: поза, свет, лицо и композиция уже есть; закрытые зоны нужно дорисовать в другом ИИ (inpaint / img2img).

## Готовые (белые трусы / шорты, без джинсов)

| Файл | Статус |
|---|---|
| `belgrade-park-evening-v1.webp` | Фон парка — готов |
| `nikola-apartment-night-v1.webp` | Фон квартиры — готов |
| `nikola-park-shy-wanting-v1.webp` | Смущённый / хочет — белые трусы |
| `nikola-park-nervous-laugh-v1.webp` | Нервный смех — белые трусы |
| `nikola-bedroom-seductive-v1.webp` | Соблазнительный взгляд — белые трусы |
| `nikola-door-kiss-v1.webp` | У двери — белые трусы |
| `nikola-briefs-lookdown-v1.webp` | На кровати, взгляд вниз — белые трусы (заменён в сцене) |
| `nikola-briefs-touch-v2.webp` | Касание: глаза закрыты, прикусил губу — от `bed-smile`, inpaint лица (заменил `touch-v1`) |
| `nikola-ready-back-v1.webp` | На коленях спиной, взгляд через плечо, белые трусы — img2img от `jock-ready-v1` + inpaint низа (заменил `jock-ready-v1`) |
| `nikola-sex-moan-v1.webp` | На спине, стонет — img2img от `bed-moan-v1` (заменил `jock-fuck-v1`) |
| `nikola-after-bliss-v1.webp` | После, блаженная улыбка — img2img от `bed-moan-v1` (заменил `cum-inside-v1`) |
| `nikola-after-laugh-v1.webp` | После, смеётся — img2img от `bed-moan-v1` (заменил `cum-jock-v1`) |
| `nikola-after-tender-v1.webp` | После, нежный взгляд — img2img от `bed-moan-v1` (заменил `cum-chest-v1`) |
| `nikola-briefs-bed-smile-v1.webp` | На кровати, смотрит и улыбается — локальный ComfyUI, Pony Realism img2img (`tools/comfy_one.py`) |
| `nikola-bed-moan-v1.webp` | Стон на кровати — белые трусы |
| `nikola-climax-face-v1.webp` | Крупный план оргазма |
| `nikola-afterglow-smile-v1.webp` | После, улыбка — белые трусы |

## ComfyUI (догенерация)

Эти кадры перегенерированы через ComfyUI туннель (`tools/comfy_nikola_gen.py`, чекпоинт `waiIllustriousSDXL_v170`, img2img от shirtless-рефа). Можно ещё крутить seed/denoise локально.

| Файл | Содержание |
|---|---|
| `nikola-briefs-bulge-v1.webp` | Shirtless, белые briefs, рельеф стояка |
| `nikola-briefs-touch-v1.webp` | Касание / ближе к briefs |
| `nikola-jock-ready-v1.webp` | Джоки, взгляд через плечо |
| `nikola-jock-fuck-v1.webp` | Секс / джоки |
| `nikola-cum-inside-v1.webp` | Финиш внутрь |
| `nikola-cum-jock-v1.webp` | Финиш на джоки |
| `nikola-cum-chest-v1.webp` | Финиш на грудь |

## Как дорисовать

1. Открой WebP/JPG заглушки в img2img или inpaint.
2. Замаскируй **только чёрные прямоугольники**.
3. Промпт-заготовка (EN): см. `PROMPTS.json`.
4. Сохрани результат тем же именем в `public/assets/`, затем `node scripts/generate-art-catalog.mjs`.

Текст сцен уже в `public/nikola-early-night.js` и не зависит от готовности арта.
