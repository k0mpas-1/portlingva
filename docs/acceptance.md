# Сценарий приёмки (ТЗ 10)

Перед приёмкой открыть: GA4 (DebugView + Realtime), таблицу `leads`, ManyChat, DataLens. На своём телефоне включить отладку: открыть сайт с `?ga_debug=1`.

| № | Что | Как показать | Ожидаемо |
|---|---|---|---|
| И-01 | Сайт | все страницы на телефоне (375 px), меню-бургер | без горизонтальной прокрутки |
| И-02 | Тег | `view-source:` любой страницы → первые строки `<head>` | `gtag/js?id=G-2CZ494QV10` |
| И-03 | Контрольная заявка | Заказчик берёт ссылку из [utm.md](utm.md), отправляет «Приёмка ТЗ-05/2026» | строка в `leads` с метками строки ≤ 2 мин, `generate_lead` в DebugView/Realtime |
| И-04 | Ошибки формы | пустой телефон, затем «123» | ошибка под полем, `form_error` (`field_name=phone`, `error_type=required` / `format`) |
| И-05 | Повтор | в консоли страницы contacts.html выполнить fetch с `request_id` уже записанной заявки (ниже) | ответ `{"ok":false,"error":"duplicate_request_id"}`, новой строки нет |
| И-06 | События | вызвать любые 5 событий из [events.md](events.md) | видны в DebugView с параметрами |
| И-07 | Instagram | комментарий с ключевым словом под Reel | ответ + Direct с кнопкой U-02 |
| И-08 | Короткая ссылка | короткая ссылка vk.cc из реестра | в адресе все 5 меток |
| И-09 | DataLens | сменить период на вкладке «Кампании» | меняются все виджеты |
| И-10 | Статус | заявку И-03 → `paid`, обновить дашборд | «Оплатил курс» +1 |
| И-11 | Отчёты | вопрос по данным | ответ из Reports/Explore за 5 минут |
| И-12 | Воронка | открытая → закрытая | числа меняются (см. подсказку в report.md) |
| И-13 | Тест уровня | пройти тест → «Записаться» | в форме уровень из теста, `level_test_complete` с `level` |

**И-05 — запрос для консоли** (подставить `request_id` из таблицы):
```js
fetch('https://script.google.com/macros/s/AKfycbx3i_CPDQorKrFjSPwUCPimpWlNNUp3j1z0SDAE8PFANyXaME-K5-zokeLfjoz9WmMfNw/exec', {
  method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'},
  body: JSON.stringify({request_id: 'REQ-…', name: 'Повтор', phone: '+79001234567', language: 'english', level: 'a1'})
}).then(r => r.json()).then(console.log)
```
