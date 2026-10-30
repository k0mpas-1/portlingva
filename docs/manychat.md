# Автоответы в Instagram через ManyChat (ТЗ 7)

## Подготовка (делает исполнитель сам)
1. Instagram → Настройки → Тип аккаунта → **Профессиональный** (Автор или Бизнес). Аккаунт школы, например `portlingva_school`.
2. Настройки → Сообщения → «Разрешить доступ к сообщениям» для подключённых сервисов — **включить**.
3. Опубликовать Reel «5 фраз, по которым в Лондоне узнают русского». В подписи: «Напишите ФРАЗЫ — пришлём 50 фраз для поездки».
4. manychat.com → войти → Add channel → Instagram → войти через Instagram.

## Автоматизация `IG · Trial Jan 2027 · Phrases Reel`

| Параметр | Значение |
|---|---|
| Триггер | Comments → **Specific Post or Reel** → выбрать Reel → ключевое слово **ФРАЗЫ** |
| Ответ в комментариях | включён, 3 варианта (ManyChat выбирает случайный): «Отправили 50 фраз в личные сообщения ✈️» · «Проверьте директ — список уже там» · «Готово! Фразы и промокод в сообщениях» |
| Сообщение в Direct | «Hi! Это школа «Портлингва». Держите 50 фраз для поездки с переводом, а после — короткий тест уровня.» |
| Кнопка | «Получить фразы» → URL **U-02**: `https://portlingva.vercel.app/phrases.html?utm_source=instagram&utm_medium=social&utm_campaign=trial_jan_2027&utm_content=reel_phrases_01` |

### Вторая ветка — `КИТАЙСКИЙ`
В той же автоматизации (или второй, на тот же Reel): ключевое слово **КИТАЙСКИЙ** → сообщение «Курсы китайского с нуля, расписание групп и бесплатный пробный урок — по кнопке ниже.» → кнопка «Китайский язык» → **U-03**:
`https://portlingva.vercel.app/courses.html?utm_source=instagram&utm_medium=social&utm_campaign=chinese_jan_2027&utm_content=reel_phrases_01_cn#chinese`

## Проверка (7.2) → снимки в `screens/instagram/`
1. Автоматизация в режиме **Live** → `manychat-live.png`.
2. Со **второго** аккаунта Instagram — комментарий «ФРАЗЫ» → `comment-reply.png`, сообщение в Direct (может прийти в «Запросы») → `dm-button.png`.
3. Нажать кнопку → адрес страницы с метками → `link-utm.png`.
4. Отправить заявку → строка в `leads` с `utm_source=instagram`, `utm_content=reel_phrases_01` → `lead-instagram.png`; в GA4 Realtime `generate_lead` → `realtime-lead.png`.
5. То же для «КИТАЙСКИЙ» → `branch-chinese.png`.

Между тестовыми комментариями — пауза не меньше 2 минут. Если ответа нет: проверить ключевое слово, выбранный Reel, статус Live и подключение Instagram.
