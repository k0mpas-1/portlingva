# Тест уровня английского: правило определения уровня

Файл логики: `js/level-test.js`. 12 вопросов, по 3 на каждый уровень:

| № | Уровень | Вопрос | Верный ответ | Что проверяет |
|---|---|---|---|---|
| 1 | A1 | My sister ___ a doctor. | is | to be, 3-е лицо |
| 2 | A1 | There ___ two cats in the garden. | are | there is / there are |
| 3 | A1 | I ___ coffee every morning. | drink | Present Simple |
| 4 | A2 | We ___ to the cinema last Saturday. | went | Past Simple, неправильный глагол |
| 5 | A2 | How ___ sugar do you want in your tea? | much | much / many |
| 6 | A2 | This suitcase is ___ than that one. | heavier | сравнительная степень |
| 7 | B1 | I have lived in this city ___ 2019. | since | Present Perfect + since/for |
| 8 | B1 | If it rains tomorrow, we ___ at home. | will stay | First Conditional |
| 9 | B1 | The meeting was ___ until Friday because the manager was ill. | put off | фразовый глагол (лексика) |
| 10 | B2 | If I ___ about the traffic, I would have left earlier. | had known | Third Conditional |
| 11 | B2 | She is used to ___ up early for work. | getting | be used to + -ing |
| 12 | B2 | By the time you arrive, the report ___. | will have been finished | Future Perfect Passive |

## Правило

1. Уровень **засчитан**, если на нём верно **2 или 3 ответа из 3**.
2. Проверка идёт снизу вверх: A1 → A2 → B1 → B2.
3. Результат — **самый высокий уровень из засчитанных подряд**, начиная с A1. Как только уровень не засчитан, проверка останавливается.
4. Если не засчитан даже A1, результат — **A1** (начинать с первого уровня).

Пример: A1 — 3/3, A2 — 2/3, B1 — 1/3, B2 — 2/3 → результат **A2** (B2 не учитывается, потому что B1 не засчитан).

## Что происходит с результатом

- Сохраняется в `sessionStorage` под ключом `level` (`a1`, `a2`, `b1`, `b2`) и подставляется в поле «Уровень» формы на `contacts.html`.
- Отправляется событие `level_test_complete` с параметрами `level` и `score` (число верных ответов из 12).
- Проверка (испытание И-13): пройти тест → «Записаться на пробный урок» → в форме выбран уровень из теста, в DebugView пришло `level_test_complete`.
