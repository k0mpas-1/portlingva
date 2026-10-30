# События GA4

Ресурс **«ПОРТЛИНГВА — сайт»**, Measurement ID `G-2CZ494QV10`, поток `https://portlingva.vercel.app`.

Все вызовы `gtag('event', …)` находятся в одном файле `js/analytics.js`:

- **строка 58**: функция `send()`, единая точка отправки;
- **строка 79**: общий обработчик кликов по элементам с атрибутом `data-event`;
- **строки 88, 95, 100, 111**: события из логики страниц (`video_play`, `level_test_complete`, `generate_lead`, `form_error`).

Другие скрипты (`form.js`, `level-test.js`) `gtag` не вызывают. Они сообщают о событии DOM-событием `pl:*`, а `analytics.js` переводит его в событие GA4.
Имя, телефон и e-mail посетителя в GA4 не передаются: в `analytics.js` есть белый список параметров (`ALLOWED`, строка 33).

## Таблица событий

Тип: **авто** — собирает расширенная статистика (Enhanced measurement) без кода; **рек.** — рекомендованное Google; **своё** — запрограммировано на сайте. ★ — ключевое событие (Key event).

| № | Событие | Тип | Где отправляется (файл: строка) | Параметры и пример значений |
|---|---|---|---|---|
| 1 | `page_view` | авто | `<head>` каждой страницы, `gtag('config')` | `page_location=https://portlingva.vercel.app/phrases.html?utm_source=instagram…`, `page_title=50 фраз на английском для поездки — Портлингва` |
| 2 | `scroll` | авто | Enhanced measurement, 90 % страницы | `percent_scrolled=90` |
| 3 | `click` | авто | исходящие ссылки: соцсети, Telegram, WhatsApp | `link_url=https://t.me/portlingva_school`, `outbound=true` |
| 4 | `file_download` | авто | `prices.html: 97` (прайс), `phrases.html: 55` (50 фраз) | `file_name=/files/price-list.pdf`, `file_extension=pdf` |
| 5 | `form_start` | авто | `contacts.html: 58`, первое касание формы | `form_id=lead-form` |
| 6 | `form_submit` | авто | `contacts.html: 58`, отправка формы | `form_id=lead-form` |
| 7 | `generate_lead` ★ | рек. | `js/analytics.js: 100` ← `js/form.js: 180`, **только после ответа `{"ok": true}`** | `lead_language=english`, `lead_level=b1`, `lead_source=instagram` |
| 8 | `cta_click` | своё | `analytics.js: 79`; разметка: `index.html: 43` (шапка), `55` (первый экран), повторный призыв, `courses.html: 72`, итог теста | `button_name=hero_trial`, `page_section=hero` |
| 9 | `language_filter` | своё | `analytics.js: 79`; `index.html: 84`, `courses.html` (фильтр) | `language=chinese` (с сайта уходит как `lang`, см. ниже), `page_section=languages` |
| 10 | `view_course` | своё | `analytics.js: 79`; `courses.html: 60` (клик по карточке курса) | `language=chinese`, `course_format=group` |
| 11 | `level_test_start` | своё | `analytics.js: 79`; `index.html: 125`, `phrases.html: 56`, `level-test.html: 65` | `page_section=home_test_teaser` |
| 12 | `level_test_complete` | своё | `analytics.js: 95` ← `js/level-test.js: 120`, ответ на 12-й вопрос | `level=b1`, `score=8` |
| 13 | `teacher_view` | своё | `analytics.js: 79`; `index.html: 144`, `teachers.html: 58` | `teacher_id=t02`, `language=chinese` |
| 14 | `select_tariff` | своё | `analytics.js: 79`; `prices.html: 64` (кнопка «Выбрать») | `tariff_name=group_month`, `tariff_price=7600` |
| 15 | `contact_click` ★ | своё | `analytics.js: 79`; телефон в шапке `index.html: 42`, `contacts.html: 116`, подвал | `contact_type=phone` / `email` |
| 16 | `messenger_click` ★ | своё | `analytics.js: 79`; `contacts.html: 122` (Telegram), `123` (WhatsApp) | `messenger=telegram` / `whatsapp` |
| 17 | `social_click` | своё | `analytics.js: 79`; подвал всех страниц (`index.html: 222`), `thanks.html: 74` | `network=instagram`, `page_section=footer` / `thanks` |
| 18 | `form_error` | своё | `analytics.js: 111` ← `js/form.js: 145` (поле), `189` (сервер) | `field_name=phone`, `error_type=format`; `field_name=server`, `error_type=server` |
| 19 | `promo_copy` (по выбору) | своё | `analytics.js: 79`; `phrases.html: 88` | `promo_code=PHRASE10` |
| 20 | `video_play` (по выбору) | своё | `analytics.js: 88`, `index.html: 189`, **один раз за просмотр страницы** | `video_title=lesson_fragment_english` |

Значения `error_type`: `required` (пустое поле), `format` (неверный формат), `length` (длина имени), `server` (приёмник вернул ошибку или недоступен).

## Особенность параметра `language`

Для gtag.js `language` — служебное поле конфигурации (язык браузера, в запросе передаётся как `ul=`). Если отправить `gtag('event', 'language_filter', {language: 'korean'})`, GA4 получит `ul=korean` вместо параметра события, а язык браузера посетителя будет испорчен. Проверено в DevTools → Network: запрос `/g/collect` содержал `ul=korean`.

Решение:
1. `js/analytics.js` (строка 43, объект `RENAME`) отправляет значение под именем **`lang`**.
2. В GA4 создано правило **Admin → Data streams → Portlingva → Modify events → `lang_to_language`**: если `event_name` соответствует `language_filter|view_course|teacher_view`, то параметр `language` = `[[lang]]`. После обработки у событий есть параметр `language`, как требует ТЗ. Снимок: `screens/ga4/modify-event-lang.png`.

## Пользовательские параметры (Admin → Custom definitions, область «Событие»)

Зарегистрированы 30.10.2026. Снимок: `screens/ga4/custom-definitions.png`.

| Параметр | События | Вопрос отчёта |
|---|---|---|
| `button_name` | cta_click | Какая кнопка заявки сработала |
| `page_section` | cta_click, social_click | В каком блоке страницы был клик |
| `language` | language_filter, view_course | Какой язык интересует |
| `level` | level_test_complete | Какой уровень показывает тест |
| `lead_language` | generate_lead | Язык в заявке |
| `tariff_name` | select_tariff | Какой тариф выбирают |
| `messenger` | messenger_click | Какой мессенджер выбирают |

## Ключевые события (Admin → Events → ★)

`generate_lead`, `contact_click`, `messenger_click`. Других ключевых событий в ресурсе нет. Снимок: `screens/ga4/key-events.png`.

## Как проверить в DebugView

1. Открыть сайт с параметром `?ga_debug=1`, например `https://portlingva.vercel.app/?ga_debug=1`. Включится `debug_mode` на 2 часа (cookie `ga_debug`). Выключить: `?ga_debug=0`. Второй способ — расширение Google Analytics Debugger.
2. GA4 → Admin → DebugView. Выполнить действие на сайте, нажать на событие в ленте и раскрыть параметры.
3. Сохранить снимок в `screens/ga4/<имя_события>.png`.
