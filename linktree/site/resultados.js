// Comparador antes/depois: arraste (ou use as setas do teclado) para revelar.
(function () {
  'use strict';

  function init(ba) {
    var handle = ba.querySelector('.ba__handle');
    var x = 50;

    function set(v) {
      x = Math.max(0, Math.min(100, v));
      ba.style.setProperty('--x', x + '%');
      if (handle) handle.setAttribute('aria-valuenow', String(Math.round(x)));
    }

    function fromEvent(e) {
      var rect = ba.getBoundingClientRect();
      return ((e.clientX - rect.left) / rect.width) * 100;
    }

    var dragging = false;

    ba.addEventListener('pointerdown', function (e) {
      dragging = true;
      if (ba.setPointerCapture) {
        try { ba.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
      set(fromEvent(e));
    });
    ba.addEventListener('pointermove', function (e) {
      if (dragging) set(fromEvent(e));
    });
    ba.addEventListener('pointerup', function () { dragging = false; });
    ba.addEventListener('pointercancel', function () { dragging = false; });

    if (handle) {
      handle.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { set(x - 5); e.preventDefault(); }
        else if (e.key === 'ArrowRight') { set(x + 5); e.preventDefault(); }
        else if (e.key === 'Home') { set(0); e.preventDefault(); }
        else if (e.key === 'End') { set(100); e.preventDefault(); }
      });
    }

    set(50);
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-ba]'), init);
})();
