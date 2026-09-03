/* =========================================================
   El agua que no vemos — interacciones
   Sin dependencias propias salvo AOS (cargado por CDN).
   ========================================================= */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- AOS: animaciones al hacer scroll ---------- */
  if (window.AOS) {
    AOS.init({ duration: reduce ? 0 : 750, easing: 'ease-out-cubic',
               once: true, offset: 60, disable: reduce,
               startEvent: 'DOMContentLoaded' });
    // un unico refresco tras cargar imagenes y fuentes: recalcula posiciones sin
    // reiniciar las animaciones ya completadas
    window.addEventListener('load', function () { AOS.refresh(); });
  } else {
    // RED DE SEGURIDAD: si el CDN de AOS no carga, el contenido debe verse igual
    document.body.classList.add('sin-aos');
  }

  /* ---------- barra de progreso de lectura ---------- */
  var barra = document.getElementById('progreso');
  var nav = document.getElementById('nav');
  var arriba = document.getElementById('arriba');

  function alScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (barra) barra.style.width = p + '%';
    if (nav) nav.classList.toggle('fija', h.scrollTop > 40);
    if (arriba) arriba.classList.toggle('ver', h.scrollTop > 600);
    document.body.classList.toggle('bajo', h.scrollTop > 160);
  }
  window.addEventListener('scroll', alScroll, { passive: true });
  alScroll();

  if (arriba) {
    arriba.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---------- menú móvil ---------- */
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      menu.classList.toggle('abierto');
      btn.textContent = menu.classList.contains('abierto') ? '✕' : '☰';
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { menu.classList.remove('abierto'); btn.textContent = '☰'; }
    });
  }

  /* ---------- contadores animados ---------- */
  var nums = document.querySelectorAll('[data-contar]');
  if (nums.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting || en.target.dataset.listo) return;
        en.target.dataset.listo = '1';
        var fin = parseInt(en.target.dataset.contar, 10);
        if (reduce) { en.target.textContent = fin.toLocaleString('es-PE'); return; }
        var t0 = null, dur = 1600;
        function paso(t) {
          if (!t0) t0 = t;
          var k = Math.min((t - t0) / dur, 1);
          // easing suave al final
          var val = Math.round(fin * (1 - Math.pow(1 - k, 3)));
          en.target.textContent = val.toLocaleString('es-PE');
          if (k < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { obs.observe(n); });
  }

  /* ---------- lluvia de fondo en la portada ---------- */
  var cv = document.getElementById('lluvia');
  if (cv && !reduce) {
    var ctx = cv.getContext('2d');
    var gotas = [], W = 0, H = 0, raf = null;

    function medir() {
      var r = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * r; cv.height = H * r;
      ctx.setTransform(r, 0, 0, r, 0, 0);
      var n = Math.round((W * H) / 16000);   // densidad proporcional al área
      gotas = [];
      for (var i = 0; i < n; i++) gotas.push(nueva(true));
    }
    function nueva(inicial) {
      return { x: Math.random() * W,
               y: inicial ? Math.random() * H : -20,
               v: 1.6 + Math.random() * 3.4,
               l: 8 + Math.random() * 16,
               o: 0.10 + Math.random() * 0.30,
               w: Math.random() < 0.25 ? 1.4 : 0.8 };
    }
    function pinta() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = '#BFEAFB'; ctx.lineCap = 'round';
      for (var i = 0; i < gotas.length; i++) {
        var g = gotas[i];
        ctx.globalAlpha = g.o; ctx.lineWidth = g.w;
        ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.lineTo(g.x, g.y + g.l); ctx.stroke();
        g.y += g.v;
        if (g.y > H) gotas[i] = nueva(false);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(pinta);
    }
    function arranca() { if (raf === null) raf = requestAnimationFrame(pinta); }
    function detiene() { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }

    medir();
    window.addEventListener('resize', medir);

    // Un unico bucle: el observer es el unico que arranca y detiene la animacion.
    // Si se llamara pinta() aqui ademas del observer quedarian DOS bucles vivos y
    // la pagina nunca quedaria inactiva (consumo de bateria y CPU permanente).
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) arranca(); else detiene();
      }, { threshold: 0 }).observe(cv);
    } else {
      arranca();
    }
    // tambien se detiene si la pestana pasa a segundo plano
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) detiene();
      else if (cv.getBoundingClientRect().bottom > 0) arranca();
    });
  }
})();
