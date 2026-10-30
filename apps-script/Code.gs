/**
 * Портлингва — приёмник заявок (Google Apps Script Web App)
 * ТЗ-05/2026, раздел 6.2. За основу взят приёмник из темы 7 курса.
 *
 * Таблица: «Portlingva — Leads», лист leads.
 * Развёртывание: Начать развёртывание → Веб-приложение →
 *   «Выполнять как: я», «У кого есть доступ: все» → URL …/exec вставить в js/form.js.
 * После любого изменения кода: Управление развёртываниями → Изменить → Новая версия.
 *
 * Идентификатор таблицы в коде допускается ТЗ; паролей и ключей здесь нет.
 */

const SPREADSHEET_ID = '1B8_DCw0lP4tSj5M1etOccMogSZzZ1N2-YNo8vCztiaw';
const SHEET_NAME = 'leads';

// Порядок столбцов — строго как в ТЗ 6.1.
const HEADERS = [
  'request_id', 'created_at', 'name', 'phone', 'email', 'language', 'level',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'status'
];
const LANGUAGES = ['english', 'chinese', 'spanish', 'korean'];
const LEVELS = ['unknown', 'a1', 'a2', 'b1', 'b2'];
const STATUSES = ['new', 'contacted', 'trial_booked', 'trial_done', 'paid', 'lost'];
const UTM_DEFAULTS = { utm_source: 'direct', utm_medium: 'none', utm_campaign: 'not_set', utm_content: 'not_set' };
const MAX_LEN = 200;

/** Приём заявки с сайта. Отвечает {"ok": true} или {"ok": false, "error": "..."}. */
function doPost(e) {
  let data;
  try {
    data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return reply({ ok: false, error: 'bad_json' });
  }

  const error = validate(data);
  if (error) return reply({ ok: false, error: error });

  // Блокировка: две одновременные заявки не перепишут одна другую.
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const sheet = getSheet();

    // Повторная отправка с тем же request_id не создаёт вторую строку.
    const found = sheet.getRange('A:A').createTextFinder(String(data.request_id)).matchEntireCell(true).findNext();
    if (found) return reply({ ok: false, error: 'duplicate_request_id' });

    const row = [
      data.request_id,
      new Date(),                      // created_at ставит приёмник
      data.name,
      data.phone,
      data.email || '',
      data.language,
      data.level,
      utm(data, 'utm_source'),
      utm(data, 'utm_medium'),
      utm(data, 'utm_campaign'),
      utm(data, 'utm_content'),
      'new'                            // статус из браузера игнорируется
    ].map(safe);

    sheet.appendRow(row);
    return reply({ ok: true, request_id: data.request_id });
  } catch (err) {
    return reply({ ok: false, error: 'server: ' + String(err && err.message || err).slice(0, 100) });
  } finally {
    lock.releaseLock();
  }
}

/** Проверка в браузере: открыть URL …/exec — должен вернуться {"ok":true,"service":"portlingva-leads"}. */
function doGet() {
  return reply({ ok: true, service: 'portlingva-leads' });
}

/** Проверка полей заявки. Возвращает код ошибки или null. */
function validate(d) {
  if (!d || typeof d !== 'object') return 'empty';
  const required = ['request_id', 'name', 'phone', 'language', 'level'];
  for (let i = 0; i < required.length; i++) {
    if (!String(d[required[i]] || '').trim()) return 'missing_' + required[i];
  }
  const fields = ['request_id', 'name', 'phone', 'email', 'language', 'level',
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  for (let i = 0; i < fields.length; i++) {
    if (d[fields[i]] !== undefined && String(d[fields[i]]).length > MAX_LEN) return 'too_long_' + fields[i];
  }
  d.name = String(d.name).trim();
  d.phone = String(d.phone).replace(/[\s()-]/g, '');
  d.email = String(d.email || '').trim();

  if (!/^REQ-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(d.request_id)) return 'invalid_request_id';
  if (d.name.length < 2 || d.name.length > 60) return 'invalid_name';
  if (!/^\+7\d{10}$/.test(d.phone)) return 'invalid_phone';
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return 'invalid_email';
  if (LANGUAGES.indexOf(d.language) === -1) return 'invalid_language';
  if (LEVELS.indexOf(d.level) === -1) return 'invalid_level';
  return null;
}

/** Пустая метка → значение по умолчанию (direct / none / not_set). */
function utm(d, key) {
  const v = String(d[key] || '').trim().toLowerCase();
  return v || UTM_DEFAULTS[key];
}

/** Текст, начинающийся с = + - @, не должен выполниться в таблице как формула. */
function safe(value) {
  if (typeof value === 'string' && /^[=+\-@]/.test(value)) return "'" + value;
  return value;
}

function getSheet() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('sheet_not_found');
  return sheet;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Разовая настройка листа (запустить вручную из редактора): заголовки, форматы,
 * выпадающие списки, подсветка пустых обязательных ячеек и повторов request_id.
 */
function setupSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  const rows = 1000;

  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#1C1A2B').setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
  sheet.getRange('B2:B').setNumberFormat('dd.mm.yyyy hh:mm:ss');
  sheet.getRange('D2:D').setNumberFormat('@');

  const list = (values) => SpreadsheetApp.newDataValidation()
    .requireValueInList(values, true).setAllowInvalid(false).build();
  sheet.getRange(2, 6, rows, 1).setDataValidation(list(LANGUAGES));   // language
  sheet.getRange(2, 7, rows, 1).setDataValidation(list(LEVELS));      // level
  sheet.getRange(2, 12, rows, 1).setDataValidation(list(STATUSES));   // status

  // Условное форматирование: пустые обязательные ячейки (кроме email) и повторы request_id.
  const rules = [];
  [['A', 'D'], ['F', 'L']].forEach(function (cols) {
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND(COUNTA($A2:$L2)>0, ' + cols[0] + '2="")')
      .setBackground('#FDE2E7')
      .setRanges([sheet.getRange(cols[0] + '2:' + cols[1] + (rows + 1))]).build());
  });
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($A2<>"", COUNTIF($A:$A, $A2)>1)')
    .setBackground('#FFD966').setFontColor('#7A1F00').setRanges([sheet.getRange('A2:A' + (rows + 1))]).build());
  // Цвет статуса — для удобства менеджера.
  const colors = { new: '#ECE8FA', contacted: '#E3F2FD', trial_booked: '#FFF4D6', trial_done: '#DDF7F0', paid: '#B7EBC6', lost: '#EEEEEE' };
  Object.keys(colors).forEach(function (s) {
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(s)
      .setBackground(colors[s]).setRanges([sheet.getRange('L2:L' + (rows + 1))]).build());
  });
  sheet.setConditionalFormatRules(rules);
  sheet.autoResizeColumns(1, HEADERS.length);
}

/** Самопроверка без сайта: две одинаковые заявки — вторая должна вернуть duplicate_request_id. */
function testDoPost() {
  const id = 'REQ-' + Utilities.getUuid();
  const body = { request_id: id, name: 'Тест Apps Script', phone: '+79001234567', email: '', language: 'english', level: 'a2',
    utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '', status: 'paid' };
  const first = doPost({ postData: { contents: JSON.stringify(body) } }).getContent();
  const second = doPost({ postData: { contents: JSON.stringify(body) } }).getContent();
  Logger.log(first);
  Logger.log(second);
}
