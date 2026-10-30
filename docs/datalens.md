# Дашборд в Yandex DataLens (ТЗ 8.4)

Воркбук **«ПОРТЛИНГВА»**, дашборд **«ПОРТЛИНГВА — trial_jan_2027»**, 3 вкладки. На каждой вкладке закреплён селектор периода, он меняет все виджеты.

## Источники данных

Таблица «Portlingva — Leads» ([ссылка](https://docs.google.com/spreadsheets/d/1B8_DCw0lP4tSj5M1etOccMogSZzZ1N2-YNo8vCztiaw/edit)):

| Лист | Откуда | Столбцы |
|---|---|---|
| `leads` | заявки с сайта (Apps Script) | 12 столбцов ТЗ 6.1 |
| `ga4_traffic` | GA4 Explore «Свободная форма» → Экспорт → Google Таблицы, без служебных строк и строки «Общий итог» | date, session_source, session_medium, session_campaign, sessions, active_users |
| `ga4_leads` | то же исследование, событие `generate_lead` | date, session_source, session_campaign, generate_lead |

Подключение: DataLens → Подключения → **Google Sheets** → вставить ссылку на таблицу → выбрать листы.

## Датасеты и вычисляемые поля

**ds_ga4** (`ga4_traffic` + `ga4_leads` по date, source, campaign):
```
source_norm  = IF([session_source] = "(direct)", "direct", [session_source])
campaign_norm = IF([session_campaign] = "(not set)", "not_set", [session_campaign])
```
**ds_leads** (`leads`): скрыть поля `name`, `phone`, `email` (персональные данные не выводятся).
```
leads_total = COUNTD([request_id])
leads_new   = COUNTD(IF([status] = "new", [request_id], NULL))
leads_paid  = COUNTD(IF([status] = "paid", [request_id], NULL))
lead_date   = DATETRUNC([created_at], "day")
```
**ds_campaigns**: связи только по `source`, `campaign` и дате.
```
leads_per_100_sessions = [leads_total] / [sessions] * 100
```

## Вкладки

| Вкладка | Виджеты |
|---|---|
| Трафик | индикаторы «Сеансы», «Активные пользователи», «generate_lead»; линия сеансов по дням; таблица источников и кампаний; селекторы периода и источника |
| Заявки | индикаторы «Всего заявок», «Новые», «Оплатил курс»; столбцы по статусам; заявки по источникам и по дням; селектор статуса |
| Кампании | таблица: source, campaign, сеансы и generate_lead (GA4), заявки из таблицы, заявки в статусе paid; «заявок на 100 сеансов» |

Доступ: воркбук → Права доступа → e-mail Заказчика → **Просмотр**. Публичную ссылку не создавать. Снимки трёх вкладок: `screens/datalens/traffic.png`, `leads.png`, `campaigns.png`.

**Проверка И-10:** перевести заявку в `paid` → обновить дашборд → «Оплатил курс» +1.
