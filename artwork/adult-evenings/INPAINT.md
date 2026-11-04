# Постельные CG · сториборды под inpaint

Генератор Cursor режет откровенные кадры (см. `artwork/romance-wardrobe/AUDIT.md`, `artwork/nikola-early-night/INPAINT.md`). Для 14 партнёров (кроме Николы) в `public/assets/{person}-night-{beat}-v1.webp` лежат **сториборды** или промежуточные генерации.

**Мужчины:** целевой образ — **голый торс + непрозрачные speedo**. Cursor часто блокирует слова briefs/speedo; часть кадров временно в athletic short-shorts без футболки (`*-night-{seductive,briefs,door}`). Shorts → inpaint в speedo локально.

Никола продолжает использовать готовый набор `nikola-*-v1` из ранней ночи у реки.

## UI и обрезка (обязательно)

Игровой экран — колонка: сверху `.scene` (flex), снизу панель диалога. Фон с `background-size: cover` и `position: 50% 35%` на телефоне **срезает** верх (~инструменты/локация) и низ (~20–35% кадра). Диалог не лежит поверх картинки — он уменьшает высоту сцены.

| Зона кадра (1080×1920) | Что держать |
|---|---|
| 0–10% сверху | Только фон; лицо ниже линии инструментов |
| 12–40% | Голова и плечи |
| 40–65% | Торс, резинка и мешочек speedo / бельё |
| 65–100% | Только простыня/атмосфера — это уйдёт под crop диалога |

Пересборка заглушек с направляющими: `python3 tools/art/make-adult-storyboards.py`.
Нормализация фото-CG в locked 1080×1920 с подъёмом субъекта: `python3 tools/art/normalize-adult-night-frames.py`.

## Биты (как у Николы)

| beat | Назначение |
|---|---|
| `seductive` | Взгляд в белье |
| `door` | У двери |
| `briefs` | На кровати в белье (мужчины — speedo) |
| `touch` | Касание |
| `ready` | Speedo спущены под ягодицы / бельё в сторону |
| `sex` | Секс |
| `climax` | Крупный план |
| `cum-inside` / `cum-cloth` / `cum-chest` | Финиш |
| `afterglow` | После |

Персонажи: `milica`, `dragan`, `jelena`, `asya`, `luka`, `ana`, `stefan`, `marko`, `vuk`, `lazar`, `teodora`, `ivana`, `strahinya`, `milos`.

## Как дорисовать

1. Открой WebP-заглушку в img2img / inpaint (ComfyUI: `tools/comfy_one.py` / локальный туннель).
2. Замаскируй **только чёрный прямоугольник** (он уже выше линии crop).
3. Промпт: `artwork/adult-evenings/PROMPTS.json` → `inpaint_template` + описание персонажа и бита; для мужчин явно **opaque speedos, shirtless**.
4. Сохрани тем же именем в `public/assets/`, затем `node scripts/generate-art-catalog.mjs`.

Тексты сцен: `public/adult-cast.js`, `public/adult-evenings.js`, `public/adult-sex-copy.js`.
