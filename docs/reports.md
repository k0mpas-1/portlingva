# Отчёты GA4 (ТЗ 8.1–8.3)

Сняты 31.10.2026 за период 29–31.10.2026 (Custom). Выводы — в [report.md](report.md). Снимки — в `screens/reports/` и `screens/explore/`.

## 8.1. Стандартные отчёты (Reports)

| Отчёт | Где | Настройка | Снимок |
|---|---|---|---|
| Reports snapshot | Отчёты → Сводка | Compare → Preceding period | `snapshot.png` |
| User acquisition | Привлечение → Привлечение пользователей | `First user source / medium` | `user-acquisition.png` |
| Traffic acquisition | Привлечение → Привлечение трафика | `Session source / medium` + доп. параметр `Session campaign`; второй снимок с `Session manual ad content` | `traffic-campaign.png`, `traffic-content.png` |
| Landing page | Вовлечённость → Целевая страница | доп. параметр `Session source` | `landing-source.png` |
| Pages and screens | Вовлечённость → Страницы и экраны | Views, Active users, Average engagement time | `pages.png` |
| Events | Вовлечённость → События | строки `generate_lead`, `cta_click`, `language_filter`, `view_course`, `level_test_start` (поиск) | `events.png` |
| Key events | Вовлечённость → Ключевые события | разбивка по `Session source / medium` | `key-events.png` |
| Tech | Технологии → Сведения | `Device category` | `tech.png` |

- **Сравнения** в Traffic acquisition: «Добавить сравнение» → `Session source` *точно совпадает* `instagram` и второе `Session source` *точно совпадает* `(direct)`. Снимок `comparison.png`.
- **CSV:** Traffic acquisition → «Поделиться отчётом» → «Скачать файл» → CSV → сохранить как `docs/reports/traffic-acquisition.csv`.
- **Library:** Отчёты → Библиотека → «Создать новую коллекцию» → «ПОРТЛИНГВА»; внутри — свой отчёт «Кампания trial_jan_2027» (параметры `Session source / medium`, `Session campaign`, `Session manual ad content`; показатели Sessions, Engagement rate, Key events). Опубликовать коллекцию. Снимок `library.png`.

## 8.2. Исследования (Explore)

Названия начинаются с «ПОРТЛИНГВА ·». Сегменты сеансов: **Instagram Sessions** (`Session source` = `instagram`) и **Direct Sessions** (`Session source` = `(direct)`).

| Исследование | Настройка |
|---|---|
| ПОРТЛИНГВА · Свободная форма | Строки: `Session source / medium`, `Session campaign`, `Session manual ad content`. Значения: Sessions, Engaged sessions, Key events. Фильтр: `Session campaign` = `trial_jan_2027`. Вкладка 2 — те же строки, сегменты Instagram и Direct рядом. Экспорт CSV → `docs/reports/free-form.csv` |
| ПОРТЛИНГВА · Воронка | 5 шагов: `page_view` → `language_filter` → `cta_click` → `form_start` → `generate_lead`. Вкладка 1 — открытая (Open), вкладка 2 — копия закрытая, Breakdown `Session source`, вкладка 3 — Breakdown `Device category`. Сегменты Instagram и Direct |
| ПОРТЛИНГВА · Воронка со временем | копия воронки, у шага `form_start` — «в течение 10 минут» после `cta_click` |
| ПОРТЛИНГВА · Путь | начальная точка — страница `phrases.html`, следующие 3 шага по `Page title`, раскрыт один узел |
| ПОРТЛИНГВА · Обратный путь | конечная точка — событие `generate_lead`, 3 предыдущих шага по `Event name` |

У каждого снимка должен быть виден значок качества данных (Data quality) в правом верхнем углу.

## 8.3. Атрибуция и оповещение

- **Admin → Attribution settings:** записать модель (по умолчанию «На основе данных» / Data-driven) и окно (по умолчанию 30 дней для привлечения, 90 дней для остальных) → в `report.md`.
- Раздел «Реклама» в России не заполняется (Google Реклама не подключена), цепочку перед заявкой показывает обратный путь.
- **Custom insight** (создано 30.10.2026): Главная → «Статистика» → «Создать». «ПОРТЛИНГВА · Instagram: сеансы упали > 50 %»: ежедневно; сегмент «Источник, связанный с первым взаимодействием пользователя» = `instagram` (измерения «Источник сеанса» в оповещениях нет); показатель «Входы» (аналог сеансов: метрики «Сеансы» в оповещениях нет); условие «Снижение в % больше чем» 50 по сравнению со вчерашним днём; уведомление на e-mail исполнителя. Снимок `screens/reports/custom-insight.png`.
