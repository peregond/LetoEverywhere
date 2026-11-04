# Недостающие иллюстрации (ветка «Квартира, банк, вечер с Драганом»)

В этой сессии не было инструмента генерации изображений. Вместо подмены сцены случайной картинкой для каждого недостающего кадра ниже даны сцена, точное назначение в коде, композиционные требования, референсы и готовый промпт. Остальная работа завершена и опирается на существующие ассеты.

Общий стиль для всех промптов: рисованная романтическая визуальная новелла, реалистичные пропорции, мягкое аниме-влияние, тёплый вечерний или дневной свет, балканская атмосфера Белграда, без текста, цифр, логотипов, водяных знаков и элементов интерфейса. Персонажей делать узнаваемыми по референсам, головы не обрезать (см. `public/art-framing.js`, правила «фон и прозрачный спрайт — разные слои»). Портреты — прозрачный WebP/PNG 1024×1536, фоны — вертикальные 9:16 (например 1080×1920), запас по краям для разных iPhone.

## Чем заменены недостающие кадры сейчас

| Что нужно | Что используется сейчас | Файл/место |
| --- | --- | --- |
| Три экрана осмотра (вода, окна, роутер) | Рисованные векторные SVG прямо в коде | `STATION_ART` и `art` в `public/scene-quests.js` |
| Вечерний образ Драгана без ключей | Позы без ключей из существующего набора: `dragan-confident`, `dragan-worried`, `dragan-surprised-living` | `EVENING_POSE` в `public/host-evening.js` |
| Серая и белая облегающая футболка Under Armour | Перекрашенный слой чёрной футболки (не генерация, скрипт `tools/art/recolor-dragan-tee.py`) | `public/assets/dragan-kitchen-borrowed-layer-{grey,white}-v1.webp` |
| Вечерний двор | Существующий фон `courtyard-after-film` (гирлянды, вечер) | `public/host-evening.js` |
| Объятие с силуэтом игрока | Объятие остаётся текстовой сценой с обычным фоном; отдельного кадра нет | `host_evening_close` |

## Что создать

### 1. Объятие Драгана: два варианта по полу игрока (приоритет: высокий)
Сцена `host_evening_close`, страница 3 («Объятие получается коротким…»).
- `public/assets/dragan-hug-neutral-male-v1.webp` и `dragan-hug-neutral-female-v1.webp`, 1080×1920, вечерний двор у двери.
- Драган обнимает **нейтральный серый силуэт** игрока (мужской или женский), без лица и деталей одежды, чтобы подходило любому имени. Обе руки Драгана видны полностью, голова не обрезана, стола нет.
- Референсы: `dragan-confident.webp`, `courtyard-after-film.webp`, `belgrade-night-walk.webp`.
- Подключение: добавить в `presentationFor` выбор кадра по `state.profile.gender` (сейчас профиль не доходит до `presentationFor`; передать пол через `flags` или аргумент) и зарегистрировать фон в `BACKGROUNDS`.
- Промпт: «Vertical 9:16 hand-painted romantic visual novel scene, warm lantern-lit evening courtyard in Belgrade with string lights, a tall broad-shouldered man in his forties with short dark hair greying at the temples and a neat dark beard (Dragan, dark green linen shirt, no keys) gently hugs a featureless neutral grey silhouette of a {man|woman} (flat grey shape, no face, no clothing detail). Both of his arms fully visible, heads uncropped with generous margin above, soft rim light, warm teal and amber palette, realistic proportions with soft anime influence, no text, no UI.»

### 2. Вечерний образ Драгана (приоритет: высокий)
Сцены `host_evening`, `host_old_town`, `host_terrace`, `host_terrace_meal`, `host_evening_close`, `host_evening_goodnight`.
- `public/assets/dragan-evening-{friendly,thoughtful,laughing,flirty}-v1.webp`, прозрачные 1024×1536.
- Тот же Драган (короткие тёмные волосы с сединой, ухоженная борода, крепкое сложение), но аккуратный вечерний образ: тёмный льняной пиджак или тёмная рубашка с закатанными рукавами, часы, **без ключей в руках** (ключи уже отданы игроку), руки свободны или в карманах.
- Референсы: `dragan-v2.webp`, `dragan-confident.webp`, `dragan-flirty-v2.webp`.
- Подключение: заменить `EVENING_POSE` в `public/host-evening.js` на спрайты `evening-*` в `CHARACTER_SPRITES.dragan`.
- Промпт: «Transparent-background full-body character sprite, hand-painted semi-realistic visual novel style, Dragan, tall broad-shouldered man in his forties, short dark hair greying at the temples, neat dark beard, in a tidy dark linen blazer over an open-collar shirt, leather watch, relaxed {friendly|thoughtful|laughing|flirty} expression, hands empty (no keys), 3/4 stance, warm evening rim light, head fully inside the frame with margin, no text, no background.»
- Для Йелены при желании сделать парный вечерний набор (`jelena-evening-*`).

### 3. Кухонные позы Драгана без обрезанных рук (приоритет: высокий)
Сцены `host_coffee_*` (слои `dragan-kitchen-*-layer-v1.webp`, `kitchen-common-layer-v1.webp`, накладка `.kitchen-table` в `public/app.js`/`public/style.css`).
- Проблема: стол закрывает предплечья, поза выглядит как сидение на столе.
- Нужны слои, где Драган сидит **на стуле за столом**, предплечья лежат на столешнице и целиком видны, голова не обрезана. Состояния: `waiting`, `spill`, `comfort`, `soft`, `dry` (с полотенцем), `borrowed` (серая и белая футболка Under Armour — заменить перекрашенные слои из таблицы выше).
- Файлы: `dragan-kitchen-{stage}-layer-v2.webp` и `dragan-kitchen-borrowed-layer-{grey,white}-v2.webp`, 1024×1536, прозрачные, на фоне `kitchen-common-layer-v1`.
- Промпт: «Transparent-background seated character layer for a kitchen scene, Dragan sitting on a wooden chair at a table (table not drawn), both forearms resting naturally on the tabletop height, hands visible, {stage description}, same face and build as the existing layer, close-fitting {grey|white} Under Armour T-shirt, head uncropped.»

### 4. Три экрана осмотра квартиры (приоритет: средний)
`QUEST_STATIONS` в `public/flat-data.js`, отрисовка в `public/scene-quests.js` (`STATION_ART` — карта «станция → файл»).
- Для каждой квартиры (`ana`, `stefan`, `marko`, `vuk`) — три вертикальных кадра: ванная с краном и душем, окно с рамой, полка/ниша с роутером. Всего 12; допустимо начать с трёх общих.
- Файлы: `flat-view-{owner}-{water|windows|internet}-v1.webp`, 1080×1620; крупные предметы по центру: интерфейс сам рисует большие кнопки под кадром.
- Промпт: «Vertical hand-painted visual novel close-up, {bathroom with chrome tap, small basin and shower head | tall old window with frame, curtain and courtyard view | wall niche with a home Wi-Fi router, cables and a small plant}, warm daylight, {Dorcol old building | Vracar balcony flat | New Belgrade modern flat} interior details, no people, no text.»

### 5. Сотрудники банка на втором дне (приоритет: средний)
Сцены `bank_visit_alta`, `bank_alta_*` (Невена) и `bank_visit_adriatic`, `bank_adriatic_*` (Богдан) сейчас без портретов; Милан (API Bank) использует `guest-bank-staff-friendly.webp`.
- `guest-bank-nevena-friendly.webp` — женщина лет 35, строгий пиджак, планшет администратора, аккуратный пучок.
- `guest-bank-bogdan-friendly.webp` — мужчина лет 45–50, серый костюм, папка международного отдела, сдержанная улыбка.
- Прозрачные 1024×1536 в стиле существующих `guest-*` портретов. Регистрация: `EPISODIC_CAST` в `public/episodic-cast.js` и `character:` на страницах этих сцен.
- Это эпизодические герои без романтики и без набора эмоций.

### 6. Новые хозяева: полные наборы эмоций (приоритет: низкий)
`rental-{ana,stefan,marko,vuk}-sport-draft.webp` — единственный эскиз у каждого. Для «живого» просмотра нужны `friendly`, `thoughtful`, `laughing`, `flirty` (см. `artwork/rental-hosts/STORY-PLAN.md`).

### 7. Отдельный вечерний двор и дверь (приоритет: низкий)
`belgrade-courtyard-evening-v1.webp`, `courtyard-door-evening-v1.webp`: тот же двор, что `belgrade-courtyard.webp`, но в синий час, окна светятся, лампа у двери, без экрана и стульев кинопоказа.

### 8. Художественная карта с тремя районами (приоритет: низкий)
Сейчас используется `belgrade-chapter-map.webp`, пины районов стоят по координатам `MAP_PINS` в `public/scene-quests.js`. Для карты, где районы читаются без подсказок: вертикальная иллюстрация 9:16, Дорћол у Дуная под Калемегданом, Врачар вокруг храма Святого Саввы, Новый Белград за Савой с жилыми блоками; свободные световые поля под кнопки; без подписей. После замены обновить `MAP_PINS`.

## Как подключать новые файлы

1. Положить WebP в `public/assets/`, запустить `node scripts/generate-art-catalog.mjs` (список файлов в `public/art-assets.json`).
2. Зарегистрировать фон в `BACKGROUNDS` или спрайт в `CHARACTER_SPRITES` (см. `public/living-art.js`, `public/abundant-art.js`), проверить рамку головы в `public/art-framing.js`.
3. `node --test tests/*.test.mjs`, затем посмотреть кадры в Safari на iPhone SE, iPhone 14 и 15 Pro Max.
