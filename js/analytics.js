/* =====================================================================
   Портлингва — отправка событий в Google Analytics 4
   ---------------------------------------------------------------------
   Все вызовы gtag('event', …) сайта находятся только в этом файле.
   Тег gtag.js с ID ресурса стоит в <head> каждой страницы.

   Как это работает:
   1. Кнопки и ссылки в HTML описаны атрибутами, например
      data-event="cta_click" data-button-name="hero_trial" data-page-section="hero".
      Один общий обработчик кликов находит такие элементы и отправляет событие.
   2. События, которые зависят от логики (заявка, ошибка формы, результат теста),
      другие скрипты сообщают через собственные DOM-события "pl:*",
      а этот файл переводит их в события GA4.
   3. В GA4 не передаются имя, телефон и e-mail посетителя.
   ===================================================================== */
(function () {
  'use strict';

  // Если gtag.js заблокирован (например, блокировщиком рекламы), сайт продолжает работать.
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  // Режим отладки для DebugView: открыть любую страницу с ?ga_debug=1 (выключить — ?ga_debug=0).
  // По умолчанию выключен, в коде для сдачи отладка не включена.
  var params = new URLSearchParams(location.search);
  if (params.get('ga_debug') === '1') document.cookie = 'ga_debug=1; path=/; max-age=7200; SameSite=Lax';
  if (params.get('ga_debug') === '0') document.cookie = 'ga_debug=; path=/; max-age=0; SameSite=Lax';
  var DEBUG = /(?:^|;\s*)ga_debug=1/.test(document.cookie);

  // Разрешённые параметры: только эти data-атрибуты уходят в GA4 (никаких персональных данных).
  var ALLOWED = [
    'button_name', 'page_section', 'language', 'course_format', 'teacher_id',
    'tariff_name', 'tariff_price', 'contact_type', 'messenger', 'network', 'promo_code'
  ];

  // Приводит значения к требованиям ТЗ 4.3: строка не длиннее 100 символов, пустые не отправляем.
  // Важно: для gtag.js имя "language" — служебное поле (язык браузера, в запросе ul=…),
  // поэтому параметр с таким именем не доходит до GA4 как параметр события.
  // Сайт отправляет его как "lang", а правило Admin → Events → Modify event
  // «Параметр language = [[lang]]» восстанавливает имя language на стороне GA4.
  var RENAME = { language: 'lang' };
  function clean(raw) {
    var out = {};
    Object.keys(raw || {}).forEach(function (key) {
      var value = raw[key];
      if (value === undefined || value === null || value === '') return;
      var keepAsIs = typeof value === 'number' || typeof value === 'function';
      out[RENAME[key] || key] = keepAsIs ? value : String(value).slice(0, 100);
    });
    if (DEBUG) out.debug_mode = true;
    return out;
  }

  // Единственная точка отправки событий сайта.
  function send(eventName, eventParams) {
    window.gtag('event', eventName, clean(eventParams));
  }

  // data-button-name → button_name
  function toSnake(camel) {
    return camel.replace(/[A-Z]/g, function (m) { return '_' + m.toLowerCase(); });
  }

  // ---------- 1. Клики по размеченным элементам ----------
  // cta_click, language_filter, view_course, level_test_start, teacher_view,
  // select_tariff, contact_click, messenger_click, social_click, promo_copy
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-event]');
    if (!el) return;
    var eventParams = {};
    Object.keys(el.dataset).forEach(function (key) {
      if (key === 'event') return;
      var snake = toSnake(key);
      if (ALLOWED.indexOf(snake) !== -1) eventParams[snake] = el.dataset[key];
    });
    if (eventParams.tariff_price) eventParams.tariff_price = Number(eventParams.tariff_price);
    send(el.dataset.event, eventParams);
  });

  // ---------- 2. Видео с урока: video_play один раз за просмотр страницы ----------
  document.querySelectorAll('video[data-video-title]').forEach(function (video) {
    var sent = false;
    video.addEventListener('play', function () {
      if (sent) return;
      sent = true;
      send('video_play', { video_title: video.dataset.videoTitle });
    });
  });

  // ---------- 3. События из логики страниц ----------
  // Тест уровня завершён (js/level-test.js)
  document.addEventListener('pl:test-complete', function (e) {
    send('level_test_complete', { level: e.detail.level, score: e.detail.score });
  });

  // Приёмник заявок ответил {"ok": true} (js/form.js)
  document.addEventListener('pl:lead-sent', function (e) {
    window.gtag('event', 'generate_lead', clean({
      lead_language: e.detail.language,
      lead_level: e.detail.level,
      lead_source: e.detail.source,
      event_callback: e.detail.done,
      event_timeout: 1500
    }));
  });

  // Форма не отправлена из-за ошибки поля или сервера (js/form.js)
  document.addEventListener('pl:form-error', function (e) {
    send('form_error', { field_name: e.detail.field, error_type: e.detail.type });
  });
})();
