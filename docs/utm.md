# Реестр UTM-ссылок · кампания `trial_jan_2027`

Машиночитаемый реестр — [`utm.csv`](utm.csv), выгрузка листа `utm` таблицы «Portlingva — Leads».
Столбцы: номер, канал, размещение, пять меток (source, medium, campaign, content и страница), полная ссылка, короткая ссылка, адрес публикации, дата публикации.

## Правила (ТЗ 5.1)

1. Только строчные латинские буквы, цифры и `_`. Без пробелов, дефисов и кириллицы.
2. `utm_medium` — одно из: `social`, `affiliate`, `qr`, `email`, `cpc`, `referral`.
3. `utm_campaign` — повод и период: `trial_jan_2027` (для китайской ветки — `chinese_jan_2027`).
4. `utm_content` различает размещения внутри одного источника: `post_01`, `stories_01`, `reel_phrases_01`…
5. Метки стоят после `?` и до `#`: `courses.html?utm_…#chinese`.
6. Ссылка сначала вносится в реестр, потом публикуется. Ссылки по памяти не набираются.

## Реестр

| № | Канал | Размещение | source | medium | campaign | content | Страница |
|---|---|---|---|---|---|---|---|
| U-01 | Instagram | ссылка в шапке профиля | `instagram` | `social` | `trial_jan_2027` | `bio` | `index.html` |
| U-02 | Instagram | автоответ под Reel (ManyChat) | `instagram` | `social` | `trial_jan_2027` | `reel_phrases_01` | `phrases.html` |
| U-03 | Instagram | автоответ, ветка «КИТАЙСКИЙ» | `instagram` | `social` | `chinese_jan_2027` | `reel_phrases_01_cn` | `courses.html#chinese` |
| U-04 | Instagram | ссылка-стикер в Stories «Узнай уровень» | `instagram` | `social` | `trial_jan_2027` | `stories_01` | `level-test.html` |
| U-05 | ВКонтакте | пост в сообществе | `vk` | `social` | `trial_jan_2027` | `post_01` | `index.html` |
| U-06 | ВКонтакте | ссылка в статье «Как выбрать курс» | `vk` | `social` | `trial_jan_2027` | `article_01` | `courses.html` |
| U-07 | Telegram | пост в канале «Слово дня» | `telegram` | `social` | `trial_jan_2027` | `word_of_day` | `level-test.html` |
| U-08 | Telegram | закреплённое сообщение | `telegram` | `social` | `trial_jan_2027` | `pinned` | `index.html` |
| U-09 | YouTube | описание видео «Разбор ошибок в произношении» | `youtube` | `social` | `trial_jan_2027` | `video_pronunciation_01` | `level-test.html` |
| U-10 | Блогер 1 | ссылка у партнёра (сторис) | `blogger_one` | `affiliate` | `trial_jan_2027` | `stories_01` | `level-test.html` |
| U-11 | Блогер 2 | ссылка у партнёра (пост) | `blogger_two` | `affiliate` | `trial_jan_2027` | `post_01` | `index.html` |
| U-12 | Визитки | QR-код на визитке преподавателя | `card_qr` | `qr` | `trial_jan_2027` | `teacher_card` | `level-test.html` |

**Ячейки, которые заполнил исполнитель:**
- U-04 `stories_01`: первая сторис со стикером.
- U-06 `article_01`: первая статья в сообществе.
- U-08 `trial_jan_2027`: закреп ведёт на ту же январскую кампанию.
- U-09 `video_pronunciation_01`: тема видео.
- U-10/U-11: `utm_source` — ник партнёра латиницей; `utm_content` — формат размещения.

> ⚠️ `blogger_one` и `blogger_two` — временные значения. Когда два студента группы согласятся разместить ссылку, замените их на ники партнёров латиницей (например, `ivanov_blog`) и в CSV, и в таблице.

## Полные ссылки

Собраны формулой в Google Таблице (лист `utm`, столбец I):

```
=СЦЕПИТЬ("https://portlingva.vercel.app/"; ЛЕВСИМВ(H2; ЕСЛИОШИБКА(НАЙТИ("#"; H2)-1; ДЛСТР(H2)));
 "?utm_source="; D2; "&utm_medium="; E2; "&utm_campaign="; F2; "&utm_content="; G2;
 ЕСЛИОШИБКА(ПСТР(H2; НАЙТИ("#"; H2); 100); ""))
```

| № | Ссылка |
|---|---|
| U-01 | `https://portlingva.vercel.app/index.html?utm_source=instagram&utm_medium=social&utm_campaign=trial_jan_2027&utm_content=bio` |
| U-02 | `https://portlingva.vercel.app/phrases.html?utm_source=instagram&utm_medium=social&utm_campaign=trial_jan_2027&utm_content=reel_phrases_01` |
| U-03 | `https://portlingva.vercel.app/courses.html?utm_source=instagram&utm_medium=social&utm_campaign=chinese_jan_2027&utm_content=reel_phrases_01_cn#chinese` |
| U-04 | `https://portlingva.vercel.app/level-test.html?utm_source=instagram&utm_medium=social&utm_campaign=trial_jan_2027&utm_content=stories_01` |
| U-05 | `https://portlingva.vercel.app/index.html?utm_source=vk&utm_medium=social&utm_campaign=trial_jan_2027&utm_content=post_01` |
| U-06 | `https://portlingva.vercel.app/courses.html?utm_source=vk&utm_medium=social&utm_campaign=trial_jan_2027&utm_content=article_01` |
| U-07 | `https://portlingva.vercel.app/level-test.html?utm_source=telegram&utm_medium=social&utm_campaign=trial_jan_2027&utm_content=word_of_day` |
| U-08 | `https://portlingva.vercel.app/index.html?utm_source=telegram&utm_medium=social&utm_campaign=trial_jan_2027&utm_content=pinned` |
| U-09 | `https://portlingva.vercel.app/level-test.html?utm_source=youtube&utm_medium=social&utm_campaign=trial_jan_2027&utm_content=video_pronunciation_01` |
| U-10 | `https://portlingva.vercel.app/level-test.html?utm_source=blogger_one&utm_medium=affiliate&utm_campaign=trial_jan_2027&utm_content=stories_01` |
| U-11 | `https://portlingva.vercel.app/index.html?utm_source=blogger_two&utm_medium=affiliate&utm_campaign=trial_jan_2027&utm_content=post_01` |
| U-12 | `https://portlingva.vercel.app/level-test.html?utm_source=card_qr&utm_medium=qr&utm_campaign=trial_jan_2027&utm_content=teacher_card` |

## Короткие ссылки, QR-код, афиша

- ВКонтакте (U-05, U-06): сократить через **vk.cc** (vk.com/cc), Telegram (U-07, U-08) — через **clck.ru**. После перехода по короткой ссылке в адресной строке должны остаться все пять меток. Снимок: `screens/utm/short-link-u-05.png`.
- QR-код для U-12: [`qr-u-12.png`](qr-u-12.png), закодирована полная ссылка U-12. Афиша A4: [`afisha.pdf`](afisha.pdf).

## Отработка ссылок (ТЗ 5.5)

Для каждой строки:
1. Открыть публикацию с другого устройства или в окне инкогнито и нажать ссылку (вставка в адресную строку проверкой не считается).
2. Сделать снимок адресной строки с метками: `screens/utm/u-01.png` … `u-12.png`.
3. GA4 → Realtime: карточка `First user source` / `Session source` показывает `utm_source`.
4. Для U-01, U-05, U-07, U-09, U-10, U-11, U-12 отправить заявку с именем «Тест U-01» и т. д. и сверить метки в листе `leads`.

Через 24–48 часов: Reports → Acquisition → Traffic acquisition, группировка `Session source / medium`. Нужно не меньше 6 пар источника и канала. Снимок: `screens/utm/traffic-acquisition.png`.
