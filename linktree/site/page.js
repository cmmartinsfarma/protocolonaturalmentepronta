(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };

  /* ---------------------------------------------------------- o retrato --
     As três folhas são a assinatura da página. O engine publica --sc-p no
     ato; aqui ele vira três progressos defasados, um por folha. O atributo
     data-sc-verify-state publica o estado visível para o harness. */

  var portrait = document.getElementById('retrato');
  var portraitStage = portrait && portrait.querySelector('[data-sc-stage]');

  if (portrait && portraitStage) {
    if (reduce) {
      portraitStage.style.setProperty('--reveal', '1');
      portraitStage.setAttribute('data-sc-verify-hold', 'true');
    } else {
      var onScreen = true;
      var lastState = '';
      var io = new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
      }, { rootMargin: '250px 0px' });
      io.observe(portrait);

      var tick = function () {
        if (onScreen && !document.hidden) {
          var p = parseFloat(getComputedStyle(portrait).getPropertyValue('--sc-p')) || 0;
          var r1 = clamp01((p - 0.04) / 0.30);
          var r2 = clamp01((p - 0.30) / 0.32);
          var r3 = clamp01((p - 0.58) / 0.34);

          portraitStage.style.setProperty('--r1', r1.toFixed(3));
          portraitStage.style.setProperty('--r2', r2.toFixed(3));
          portraitStage.style.setProperty('--r3', r3.toFixed(3));
          portraitStage.style.setProperty('--reveal', r3.toFixed(3));

          var state = r1.toFixed(2) + '|' + r2.toFixed(2) + '|' + r3.toFixed(2);
          if (state !== lastState) {
            portraitStage.setAttribute('data-sc-verify-state', state);
            lastState = state;
          }
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ---------------------------------------------------------- o cuidado --
     A linha do tempo se desenha conforme o capítulo atravessa a viewport.
     É apoio, não o pico: não compete com o retrato. */

  var method = document.getElementById('cuidado');
  var lineRaf = 0;

  function updateLine() {
    lineRaf = 0;
    if (!method) return;
    if (reduce) {
      method.style.setProperty('--line', '1');
      return;
    }
    var rect = method.getBoundingClientRect();
    var vh = window.innerHeight || 1;
    var p = clamp01((vh * 0.86 - rect.top) / Math.max(rect.height, 1));
    method.style.setProperty('--line', p.toFixed(3));
  }

  function queueLine() {
    if (!lineRaf) lineRaf = requestAnimationFrame(updateLine);
  }

  window.addEventListener('scroll', queueLine, { passive: true });
  window.addEventListener('resize', queueLine);
  updateLine();

  var onScroll = function () {
    document.body.classList.toggle('is-scrolled', window.scrollY > 80);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------- o folio --
     O capítulo ativo é o que está na faixa central da tela. O folio é a
     navegação, não uma barra de marketing. */

  var links = Array.prototype.slice.call(document.querySelectorAll('.folio a'));
  var sections = links.map(function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);

  function setActive(id) {
    links.forEach(function (a) {
      var active = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', active);
      if (active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var folioIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (section) { folioIO.observe(section); });
  }

  setActive('abertura');
})();
