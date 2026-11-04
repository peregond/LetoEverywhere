# Визуальная согласованность · ранние прогулки и Ада

Сверка новых портретов из PR #22 с эталонами (Никола buzz-v3, Милица, Йелена v2, Драган evening).

## Решение по файлам

| Файл | Вердикт | Почему |
|---|---|---|
| `marko-door-v1.webp`, `marko-swim-v1.webp` | оставить | Живописный свет, лицо и тело совпадают с draft-референсом |
| `stefan-workshop-v1.webp`, `stefan-swim-v1.webp` | оставить | Та же проработка, мягкие тени |
| `ana-camera-v1.webp` | оставить | Хороший эталон для Аны |
| `ana-swim-v1.webp` | **заменён** | Лицо/причёска и более плоский рендер расходились с `ana-camera-v1` |
| `milica-show/wave/riverside/swim` | оставить | Согласованы с `milica.webp` |
| `jelena-stroll-*`, `jelena-swim-v1` | оставить | Согласованы с `jelena-v2` |
| `asya-pointing-v1.webp` | оставить | Совпадает с `asya-friendly` |
| `vuk-headphones-v1.webp`, `vuk-swim-v1.webp` | оставить | Внутренне согласованы |
| `nikola-guide/napkin-buzz-v3` | оставить | Лицо и фартук как у `nikola-friendly-buzz-v3` |
| `nikola-evening-wave-buzz-v3.webp` | **заменён** | Были длинные волнистые волосы вместо buzz; фигура не совпадала с аэропортным `nikola-dream-bare-buzz-v3` |
| `nikola-swim-short-buzz-v3.webp` | **заменён** | Пластичный блеск и упрощённые контуры; фигура подогнана к `nikola-dream-bare-buzz-v3` |

## Эталон фигуры Николы

Без фартука канон — `public/assets/nikola-dream-bare-buzz-v3.webp` (аэропортная фантазия): широкие плечи, крупные pecs, грудной волос, глубокий пресс, тёплый тон кожи, buzz.

Повтор wave/swim (v4) сгенерирован строго с этим референсом: swim — та же стойка (рука на бедре) и тот же торс; wave — та же масса под льняной рубашкой, открытый ворот с тем же грудным волосом.

Оригиналы до замены: `artwork/style-consistency/originals/`.
Исходники генерации v4: `artwork/style-consistency/sources/`.
Промпты: `artwork/style-consistency/PROMPTS.json`.
