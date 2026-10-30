/* =====================================================================
   Портлингва — тест уровня английского (level-test.html)
   12 вопросов: по 3 на уровни A1, A2, B1, B2.
   Правило определения уровня описано в docs/level-test.md:
   уровень засчитан, если на нём верно 2 или 3 ответа из 3;
   результат — самый высокий уровень из подряд засчитанных, начиная с A1.
   ===================================================================== */
(function () {
  'use strict';

  var QUESTIONS = [
    // ----- A1 -----
    { level: 'A1', q: 'My sister ___ a doctor.', options: ['am', 'is', 'are', 'be'], answer: 1 },
    { level: 'A1', q: 'There ___ two cats in the garden.', options: ['is', 'be', 'are', 'am'], answer: 2 },
    { level: 'A1', q: 'I ___ coffee every morning.', options: ['drinks', 'drink', 'drinking', 'am drink'], answer: 1 },
    // ----- A2 -----
    { level: 'A2', q: 'We ___ to the cinema last Saturday.', options: ['go', 'goes', 'have gone', 'went'], answer: 3 },
    { level: 'A2', q: 'How ___ sugar do you want in your tea?', options: ['much', 'many', 'few', 'lot'], answer: 0 },
    { level: 'A2', q: 'This suitcase is ___ than that one.', options: ['heavy', 'heaviest', 'heavier', 'more heavy'], answer: 2 },
    // ----- B1 -----
    { level: 'B1', q: 'I have lived in this city ___ 2019.', options: ['for', 'since', 'from', 'during'], answer: 1 },
    { level: 'B1', q: 'If it rains tomorrow, we ___ at home.', options: ['will stay', 'would stay', 'stayed', 'stay'], answer: 0 },
    { level: 'B1', q: 'The meeting was ___ until Friday because the manager was ill.', options: ['put on', 'put up', 'put out', 'put off'], answer: 3 },
    // ----- B2 -----
    { level: 'B2', q: 'If I ___ about the traffic, I would have left earlier.', options: ['knew', 'had known', 'have known', 'would know'], answer: 1 },
    { level: 'B2', q: 'She is used to ___ up early for work.', options: ['get', 'got', 'getting', 'have got'], answer: 2 },
    { level: 'B2', q: 'By the time you arrive, the report ___.', options: ['will finish', 'is finishing', 'has finished', 'will have been finished'], answer: 3 }
  ];
  var LEVELS = ['A1', 'A2', 'B1', 'B2'];
  var ADVICE = {
    A1: 'Начните с курса английского A1 в группе: 2 занятия в неделю по 90 минут. В среднем на уровень уходит 64 занятия.',
    A2: 'Подойдёт группа A2: закрепим прошедшие времена, сравнения и бытовую лексику для поездок.',
    B1: 'Ваш уровень — B1. Группа B1 или разговорный клуб помогут говорить свободнее и увереннее.',
    B2: 'Уровень B2 — отличная база. Дальше — группа B2 → C1 или индивидуальные занятия под экзамен.'
  };

  var root = document.querySelector('#quiz');
  if (!root) return;

  var screens = {
    intro: root.querySelector('[data-screen="intro"]'),
    question: root.querySelector('[data-screen="question"]'),
    result: root.querySelector('[data-screen="result"]')
  };
  var el = {
    counter: root.querySelector('#q-counter'),
    stage: root.querySelector('#q-stage'),
    bar: root.querySelector('#q-progress'),
    text: root.querySelector('#q-text'),
    answers: root.querySelector('#q-answers'),
    next: root.querySelector('#q-next'),
    error: root.querySelector('#q-error'),
    level: root.querySelector('#r-level'),
    score: root.querySelector('#r-score'),
    advice: root.querySelector('#r-advice'),
    scale: root.querySelectorAll('.level-scale div')
  };

  var index = 0;
  var correct = [];

  function show(name) {
    Object.keys(screens).forEach(function (key) { screens[key].hidden = key !== name; });
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function render() {
    var item = QUESTIONS[index];
    el.counter.textContent = 'Вопрос ' + (index + 1) + ' из ' + QUESTIONS.length;
    el.stage.textContent = 'Уровень ' + item.level;
    el.bar.style.width = (index / QUESTIONS.length * 100) + '%';
    el.text.textContent = item.q;
    el.answers.innerHTML = '';
    item.options.forEach(function (option, i) {
      var label = document.createElement('label');
      label.className = 'answer';
      var input = document.createElement('input');
      input.type = 'radio';
      input.name = 'answer';
      input.value = String(i);
      var span = document.createElement('span');
      span.textContent = option;
      span.lang = 'en';
      label.appendChild(input);
      label.appendChild(span);
      el.answers.appendChild(label);
    });
    el.error.hidden = true;
    el.next.textContent = index === QUESTIONS.length - 1 ? 'Узнать результат' : 'Дальше →';
  }

  // Правило уровня: идём от A1 вверх, пока уровень засчитан (≥ 2 верных из 3).
  function calcLevel() {
    var result = 'A1';
    for (var s = 0; s < LEVELS.length; s++) {
      var right = 0;
      QUESTIONS.forEach(function (q, i) { if (q.level === LEVELS[s] && correct[i]) right++; });
      if (right >= 2) result = LEVELS[s];
      else break;
    }
    return result;
  }

  function finish() {
    var score = correct.filter(Boolean).length;
    var level = calcLevel();
    var code = level.toLowerCase();

    // Результат сохраняется в sessionStorage и подставится в поле level формы заявки.
    if (window.PLStore) window.PLStore.set('level', code);

    el.bar.style.width = '100%';
    el.level.textContent = level;
    el.level.style.setProperty('--p', Math.round(score / QUESTIONS.length * 100) + '%');
    el.score.textContent = score + ' из ' + QUESTIONS.length;
    el.advice.textContent = ADVICE[level];
    el.scale.forEach(function (div) { div.classList.toggle('is-active', div.dataset.level === level); });
    show('result');

    document.dispatchEvent(new CustomEvent('pl:test-complete', { detail: { level: code, score: score } }));
  }

  root.querySelector('#q-start').addEventListener('click', function () {
    index = 0;
    correct = [];
    render();
    show('question');
  });

  el.next.addEventListener('click', function () {
    var picked = el.answers.querySelector('input:checked');
    if (!picked) { el.error.hidden = false; return; }
    correct[index] = Number(picked.value) === QUESTIONS[index].answer;
    if (index < QUESTIONS.length - 1) { index++; render(); return; }
    finish();
  });

  root.querySelector('#q-restart').addEventListener('click', function () { show('intro'); });
})();
