/* =====================================================================
   Портлингва — форма заявки на пробный урок (contacts.html)
   ---------------------------------------------------------------------
   1. Заполняет скрытые поля: request_id (REQ- + UUID) и четыре UTM-метки
      из sessionStorage (их туда кладёт js/main.js при входе на сайт).
   2. Подставляет уровень из теста и язык из карточки курса.
   3. Проверяет поля, подсвечивает ошибку и сообщает о ней (form_error).
   4. Отправляет заявку fetch-запросом в Google Apps Script без перезагрузки.
   5. Только после ответа {"ok": true} сообщает о заявке (generate_lead)
      и переводит посетителя на thanks.html.
   ===================================================================== */
(function () {
  'use strict';

  // Адрес веб-приложения Apps Script (Развернуть → Веб-приложение → URL, оканчивается на /exec).
  var LEADS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx3i_CPDQorKrFjSPwUCPimpWlNNUp3j1z0SDAE8PFANyXaME-K5-zokeLfjoz9WmMfNw/exec';

  var form = document.querySelector('#lead-form');
  if (!form) return;

  var store = window.PLStore || { get: function () { return null; }, set: function () {} };
  var submitBtn = form.querySelector('[type="submit"]');
  var alertBox = form.querySelector('#form-alert');
  var UTM_DEFAULTS = { utm_source: 'direct', utm_medium: 'none', utm_campaign: 'not_set', utm_content: 'not_set' };

  // Сообщить analytics.js о событии (сам этот файл gtag не вызывает).
  function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  // ---------- Идентификатор заявки ----------
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
  function newRequestId() { form.elements.request_id.value = 'REQ-' + uuid(); }
  newRequestId();

  // ---------- Скрытые поля UTM ----------
  Object.keys(UTM_DEFAULTS).forEach(function (key) {
    form.elements[key].value = store.get(key) || UTM_DEFAULTS[key];
  });

  // ---------- Подстановка уровня из теста и языка из карточки ----------
  var savedLevel = store.get('level');
  if (savedLevel && form.elements.level.querySelector('option[value="' + savedLevel + '"]')) {
    form.elements.level.value = savedLevel;
    var hint = document.querySelector('#level-hint');
    if (hint) hint.textContent = 'Уровень подставлен из теста: ' + savedLevel.toUpperCase();
  }
  var savedLang = store.get('preferred_language');
  if (savedLang && form.elements.language.querySelector('option[value="' + savedLang + '"]')) {
    form.elements.language.value = savedLang;
  }

  // ---------- Маска телефона: всегда +7 и 10 цифр ----------
  var phone = form.elements.phone;
  function phoneDigits(value) {
    var d = value.replace(/\D/g, '');
    if (d.charAt(0) === '8' || d.charAt(0) === '7') d = d.slice(1);
    return d.slice(0, 10);
  }
  function formatPhone(d) {
    var out = '+7';
    if (d.length) out += ' (' + d.slice(0, 3);
    if (d.length >= 3) out += ')';
    if (d.length > 3) out += ' ' + d.slice(3, 6);
    if (d.length > 6) out += '-' + d.slice(6, 8);
    if (d.length > 8) out += '-' + d.slice(8, 10);
    return out;
  }
  phone.addEventListener('input', function () {
    var d = phoneDigits(phone.value);
    phone.value = d.length ? formatPhone(d) : '';
  });

  // ---------- Проверка полей ----------
  var RULES = {
    name: function (v) {
      v = v.trim();
      if (!v) return ['required', 'Введите имя'];
      if (v.length < 2 || v.length > 60) return ['length', 'Имя — от 2 до 60 символов'];
      return null;
    },
    phone: function (v) {
      var d = phoneDigits(v);
      if (!d.length) return ['required', 'Введите номер телефона'];
      if (d.length !== 10) return ['format', 'Номер должен быть в формате +7 и 10 цифр'];
      return null;
    },
    email: function (v) {
      v = v.trim();
      if (!v) return null; // необязательное поле
      if (v.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return ['format', 'Проверьте адрес e-mail'];
      return null;
    },
    language: function (v) { return v ? null : ['required', 'Выберите язык']; },
    level: function (v) { return v ? null : ['required', 'Выберите уровень']; },
    consent: function (v, el) { return el.checked ? null : ['required', 'Нужно согласие на обработку данных']; }
  };

  function setError(name, message) {
    var el = form.elements[name];
    var wrap = el.closest('.field, .consent');
    var msg = form.querySelector('#' + name + '-error');
    wrap.classList.toggle('has-error', Boolean(message));
    el.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (msg) msg.textContent = message || '';
  }

  function validate() {
    var firstBad = null;
    Object.keys(RULES).forEach(function (name) {
      var el = form.elements[name];
      var problem = RULES[name](el.value, el);
      setError(name, problem && problem[1]);
      if (problem && !firstBad) firstBad = { name: name, type: problem[0] };
    });
    return firstBad;
  }

  // Убираем ошибку, как только поле исправлено.
  Object.keys(RULES).forEach(function (name) {
    var el = form.elements[name];
    el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'blur', function () {
      if (!el.closest('.has-error')) return;
      var problem = RULES[name](el.value, el);
      setError(name, problem && problem[1]);
    });
  });

  function showAlert(text) { alertBox.textContent = text; alertBox.hidden = false; }

  // ---------- Отправка ----------
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alertBox.hidden = true;

    var bad = validate();
    if (bad) {
      form.elements[bad.name].focus();
      emit('pl:form-error', { field: bad.name, type: bad.type });
      return;
    }

    var data = {
      request_id: form.elements.request_id.value,
      name: form.elements.name.value.trim(),
      phone: '+7' + phoneDigits(phone.value),
      email: form.elements.email.value.trim(),
      language: form.elements.language.value,
      level: form.elements.level.value,
      utm_source: form.elements.utm_source.value,
      utm_medium: form.elements.utm_medium.value,
      utm_campaign: form.elements.utm_campaign.value,
      utm_content: form.elements.utm_content.value
    };

    submitBtn.disabled = true;
    submitBtn.dataset.label = submitBtn.textContent;
    submitBtn.textContent = 'Отправляем…';

    // text/plain — «простой» запрос: браузер не делает предварительный CORS-запрос,
    // который Apps Script не умеет обрабатывать.
    fetch(LEADS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.json(); })
      .then(function (result) {
        if (!result || result.ok !== true) throw new Error((result && result.error) || 'server');
        store.set('last_request_id', data.request_id);
        var go = function () { location.href = 'thanks.html'; };
        var left = false;
        var leave = function () { if (!left) { left = true; go(); } };
        emit('pl:lead-sent', { language: data.language, level: data.level, source: data.utm_source, done: leave });
        setTimeout(leave, 1600); // если GA4 заблокирован, всё равно переходим
      })
      .catch(function (err) {
        var reason = String(err && err.message || '');
        var text = reason === 'duplicate_request_id'
          ? 'Эта заявка уже отправлена. Обновите страницу, чтобы отправить новую.'
          : 'Не удалось отправить заявку. Проверьте интернет и попробуйте ещё раз или позвоните нам: +7 (900) 505-50-55.';
        showAlert(text);
        emit('pl:form-error', { field: 'server', type: 'server' });
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.label;
      });
  });
})();
