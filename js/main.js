/* =====================================================================
   Портлингва — общее поведение страниц
   Меню, сохранение UTM-меток, фильтр языков, карточки, промокод, тарифы.
   Событий GA4 здесь нет: их отправляет js/analytics.js по data-атрибутам.
   ===================================================================== */
(function () {
  'use strict';

  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

  // Безопасная работа с sessionStorage (в приватном режиме может быть недоступен).
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* без хранения */ } }
  };
  window.PLStore = store;

  // ---------- UTM: метки из адреса сохраняются на всю сессию ----------
  // Если посетитель пришёл по ссылке с метками, запоминаем все четыре;
  // при переходах по страницам сайта они не теряются (ТЗ 6.3).
  (function saveUtm() {
    var params = new URLSearchParams(location.search);
    var hasUtm = UTM_KEYS.some(function (k) { return params.has(k); });
    if (!hasUtm) return;
    UTM_KEYS.forEach(function (k) { store.set(k, (params.get(k) || '').trim().toLowerCase()); });
  })();

  // ---------- Мобильное меню ----------
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // ---------- Уведомление внизу экрана ----------
  function toast(text) {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.classList.add('is-visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(function () { el.classList.remove('is-visible'); }, 2400);
  }

  // ---------- Фильтр по языку (главная и курсы) ----------
  var chips = document.querySelectorAll('[data-filter-group] .chip');
  function applyFilter(lang) {
    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.dataset.language === lang));
    });
    document.querySelectorAll('[data-filter-item]').forEach(function (item) {
      var match = lang === 'all' || item.dataset.language === lang;
      if (item.dataset.filterMode === 'dim') item.classList.toggle('is-dimmed', !match);
      else item.hidden = !match;
    });
  }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () { applyFilter(chip.dataset.language); });
  });
  // courses.html#chinese — ссылка U-03 из Instagram сразу открывает китайский.
  var hashLang = location.hash.replace('#', '');
  if (chips.length && ['english', 'chinese', 'spanish', 'korean'].indexOf(hashLang) !== -1) {
    applyFilter(hashLang);
  }

  // ---------- Карточки курсов и преподавателей раскрываются по клику ----------
  document.querySelectorAll('.course-card, .teacher-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return; // кнопка «Записаться» ведёт на форму
      var open = card.classList.toggle('is-open');
      card.setAttribute('aria-expanded', String(open));
    });
  });

  // Язык, выбранный в карточке, подставится в форму заявки.
  document.querySelectorAll('[data-preselect-language]').forEach(function (link) {
    link.addEventListener('click', function () { store.set('preferred_language', link.dataset.preselectLanguage); });
  });

  // ---------- Тарифы: запоминаем выбор и ведём на форму ----------
  document.querySelectorAll('[data-event="select_tariff"]').forEach(function (btn) {
    btn.addEventListener('click', function () { store.set('selected_tariff', btn.dataset.tariffName); });
  });

  // ---------- Промокод ----------
  var promoBtn = document.querySelector('#copy-promo');
  if (promoBtn) {
    promoBtn.addEventListener('click', function () {
      var code = promoBtn.dataset.promoCode;
      var done = function () { promoBtn.textContent = 'Скопировано ✓'; toast('Промокод ' + code + ' скопирован'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, function () { toast('Промокод: ' + code); });
      } else {
        toast('Промокод: ' + code);
      }
    });
  }

  // ---------- Страница «Спасибо»: номер заявки ----------
  var idBox = document.querySelector('#request-id');
  if (idBox) {
    var id = store.get('last_request_id');
    if (id) idBox.textContent = id;
    else idBox.closest('.request-box').hidden = true;
  }

  // ---------- Год в подвале ----------
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
