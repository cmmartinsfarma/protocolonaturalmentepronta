// ============================================================================
// Editor de vídeos — abra a página com ?edit para aparecer o painel.
//   http://localhost:4500/?edit
// Clique num vídeo (ou no botão do painel) para selecionar, depois use as
// setas, o zoom e o tamanho da caixa. No fim, clique em "Copiar" e cole o
// valor no videos.js.
// ============================================================================
(function () {
  'use strict';
  if (!/[\?&]edit/.test(location.search)) return;

  var cfg = window.VIDEOS || {};
  var slots = [];
  var active = -1;

  function collect() {
    slots = [];
    var fronts = document.querySelectorAll('.area__media video');
    var steps = document.querySelectorAll('.method__media video');
    (cfg.frentes || []).forEach(function (item, i) {
      if (fronts[i]) slots.push({ label: 'Frente ' + (i + 1), item: item, video: fronts[i] });
    });
    (cfg.metodo || []).forEach(function (item, i) {
      if (steps[i]) slots.push({ label: 'Etapa ' + (i + 1) + (item.label ? ' · ' + item.label : ''), item: item, video: steps[i] });
    });
    slots.forEach(function (s) {
      var m = String(s.item.pos || '50% 50%').trim().split(/\s+/);
      s.x = clampNum(parseFloat(m[0]) || 50, 0, 100);
      s.y = clampNum(parseFloat(m[1]) || 50, 0, 100);
      s.zoom = clampNum(parseFloat(s.item.zoom) || 1, 1, 4);
      s.w = s.item.w ? parseFloat(s.item.w) : null;
      s.h = s.item.h ? parseFloat(s.item.h) : null;
      s.box = s.video.closest('.area__media') || s.video.closest('.method__media') || s.video.closest('.bastidor-media');
    });
  }

  function clampNum(n, a, b) { return Math.min(b, Math.max(a, n)); }

  function boxApply(slot) {
    if (!slot.box) return;
    slot.box.style.width = slot.w ? slot.w + 'px' : '';
    slot.box.style.height = slot.h ? slot.h + 'px' : '';
    slot.box.style.marginInline = slot.w ? 'auto' : '';
  }

  function apply(slot) {
    var v = slot.video;
    v.style.objectPosition = slot.x + '% ' + slot.y + '%';
    v.style.transformOrigin = slot.x + '% ' + slot.y + '%';
    v.style.transform = slot.zoom !== 1 ? 'scale(' + slot.zoom + ')' : '';
    boxApply(slot);
  }

  function applyAll() { slots.forEach(apply); }

  function readout() {
    if (active < 0) return 'Selecione um vídeo';
    var s = slots[active];
    var size = s.w || s.h ? (s.w ? Math.round(s.w) + 'px' : 'auto') + ' × ' + (s.h ? Math.round(s.h) + 'px' : 'auto') : 'auto';
    return s.label + '  ·  pos ' + Math.round(s.x) + '% ' + Math.round(s.y) + '%  ·  zoom ' + s.zoom.toFixed(1) + '  ·  caixa ' + size;
  }

  /* ------------------------------------------------------------ painel --- */
  var style = document.createElement('style');
  style.textContent = [
    '#vedit{position:fixed;right:16px;bottom:16px;z-index:999;width:270px;background:#201b19;color:#f6ede7;border:1px solid #3a302c;border-radius:14px;font:13px/1.4 sans-serif;box-shadow:0 18px 50px -18px rgba(0,0,0,.5)}',
    '#vedit .h{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid #3a302c;font-weight:700}',
    '#vedit .h button{background:none;border:none;color:#c9a9a2;cursor:pointer;font-size:16px}',
    '#vedit .slots{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px}',
    '#vedit .slot{flex:1 1 auto;padding:6px 8px;border:1px solid #3a302c;border-radius:8px;background:#2a2422;color:#f6ede7;cursor:pointer;font-size:11px}',
    '#vedit .slot.on{background:#9e2f35;border-color:#9e2f35}',
    '#vedit .ctrl{padding:0 12px 12px}',
    '#vedit .readout{font-size:11px;color:#c9a9a2;margin:4px 0 8px;min-height:16px}',
    '#vedit .row{display:flex;gap:6px;justify-content:center;margin-bottom:6px}',
    '#vedit .row button{width:44px;height:34px;border:1px solid #3a302c;border-radius:8px;background:#2a2422;color:#f6ede7;cursor:pointer;font-size:15px}',
    '#vedit .row button:hover{background:#3a302c}',
    '#vedit .lbl{font-size:10px;color:#c9a9a2;align-self:center;padding:0 2px;min-width:22px;text-align:center}',
    '#vedit .copy{width:100%;padding:9px;border:none;border-radius:8px;background:#9e2f35;color:#fff;font-weight:700;cursor:pointer}',
    '#vedit .copy.ok{background:#2e7d4f}',
    '.vedit-sel{outline:3px solid #9e2f35 !important;outline-offset:2px}'
  ].join('\n');
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.id = 'vedit';
  root.innerHTML =
    '<div class="h"><span>Editor de vídeos</span><button data-act="close">×</button></div>' +
    '<div class="slots"></div>' +
    '<div class="ctrl">' +
    '  <div class="readout"></div>' +
    '  <div class="row"><button data-act="up">↑</button></div>' +
    '  <div class="row"><button data-act="left">←</button><button data-act="down">↓</button><button data-act="right">→</button></div>' +
    '  <div class="row"><button data-act="zoomout">−</button><button data-act="reset">reset</button><button data-act="zoomin">+</button></div>' +
    '  <div class="row"><span class="lbl">larg</span><button data-act="wout">−</button><button data-act="win">+</button><span class="lbl">alt</span><button data-act="hout">−</button><button data-act="hin">+</button></div>' +
    '  <button class="copy" data-act="copy">Copiar config</button>' +
    '</div>';
  document.body.appendChild(root);

  var slotsEl = root.querySelector('.slots');
  var readoutEl = root.querySelector('.readout');
  var copyBtn = root.querySelector('.copy');

  function select(i) {
    active = i;
    slots.forEach(function (s, k) {
      if (s.box) s.box.classList.toggle('vedit-sel', k === i);
    });
    Array.prototype.forEach.call(slotsEl.children, function (b, k) {
      b.classList.toggle('on', k === i);
    });
    readoutEl.textContent = readout();
  }

  function renderSlots() {
    slotsEl.innerHTML = '';
    slots.forEach(function (s, i) {
      var b = document.createElement('button');
      b.className = 'slot';
      b.textContent = s.label;
      b.addEventListener('click', function () { select(i); });
      slotsEl.appendChild(b);
    });
  }

  function nudge(dx, dy) {
    if (active < 0) return;
    var s = slots[active];
    s.x = clampNum(s.x + dx, 0, 100);
    s.y = clampNum(s.y + dy, 0, 100);
    s.item.pos = Math.round(s.x) + '% ' + Math.round(s.y) + '%';
    apply(s);
    readoutEl.textContent = readout();
  }

  function setZoom(dz) {
    if (active < 0) return;
    var s = slots[active];
    s.zoom = clampNum(Math.round((s.zoom + dz) * 10) / 10, 1, 4);
    s.item.zoom = s.zoom;
    apply(s);
    readoutEl.textContent = readout();
  }

  function resize(dw, dh) {
    if (active < 0) return;
    var s = slots[active];
    if (!s.box) return;
    if (dw) {
      if (s.w == null) s.w = s.box.offsetWidth;
      s.w = clampNum(Math.round(s.w + dw), 80, 1600);
      s.item.w = s.w;
    }
    if (dh) {
      if (s.h == null) s.h = s.box.offsetHeight;
      s.h = clampNum(Math.round(s.h + dh), 80, 1000);
      s.item.h = s.h;
    }
    boxApply(s);
    readoutEl.textContent = readout();
  }

  root.addEventListener('click', function (e) {
    var act = e.target.getAttribute && e.target.getAttribute('data-act');
    if (!act) return;
    if (act === 'close') { root.remove(); return; }
    if (act === 'up') nudge(0, -2);
    else if (act === 'down') nudge(0, 2);
    else if (act === 'left') nudge(-2, 0);
    else if (act === 'right') nudge(2, 0);
    else if (act === 'zoomin') setZoom(0.1);
    else if (act === 'zoomout') setZoom(-0.1);
    else if (act === 'win') resize(20, 0);
    else if (act === 'wout') resize(-20, 0);
    else if (act === 'hin') resize(0, 20);
    else if (act === 'hout') resize(0, -20);
    else if (act === 'reset') {
      if (active < 0) return;
      var s = slots[active];
      s.x = 50; s.y = 50; s.zoom = 1; s.w = null; s.h = null;
      s.item.pos = '50% 50%'; s.item.zoom = 1; delete s.item.w; delete s.item.h;
      apply(s);
      readoutEl.textContent = readout();
    } else if (act === 'copy') {
      if (active < 0) return;
      var s = slots[active];
      var label = s.item.label ? (', label: ' + JSON.stringify(s.item.label)) : '';
      var wpart = s.item.w ? (', w: ' + Math.round(s.item.w)) : '';
      var hpart = s.item.h ? (', h: ' + Math.round(s.item.h)) : '';
      var out = '{ video: ' + JSON.stringify(s.item.video) + ', poster: ' + JSON.stringify(s.item.poster) +
        label + ', pos: ' + JSON.stringify(s.item.pos) + ', zoom: ' + s.item.zoom + wpart + hpart + ' }';
      navigator.clipboard.writeText(out).then(function () {
        copyBtn.textContent = 'Copiado!';
        copyBtn.classList.add('ok');
        setTimeout(function () { copyBtn.textContent = 'Copiar config'; copyBtn.classList.remove('ok'); }, 1400);
      });
    }
  });

  // clicar no próprio vídeo seleciona o slot
  slots.forEach(function (s, i) {
    if (s.box) {
      s.box.style.cursor = 'pointer';
      s.box.addEventListener('click', function (ev) { ev.preventDefault(); ev.stopPropagation(); select(i); });
    }
  });

  collect();
  renderSlots();
  applyAll();
  readoutEl.textContent = readout();
})();
