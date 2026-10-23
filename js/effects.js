// effects.js — efectos para móvil (iPhone first)
// Cargar al final, después de los demás scripts.

(() => {
  'use strict';

  // Si el usuario pidió menos movimiento, no se activa nada (todo queda visible y estático)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const hayWAAPI = typeof Element.prototype.animate === 'function';
  const hero = $('.hero');

  /* ---------- 1. Nombre del hero: una <span> por letra ---------- */
  const nombre = $('.hero .nombre');
  if (nombre) {
    const etiqueta = Array.from(nombre.childNodes)
      .map(n => n.textContent.trim()).filter(Boolean).join(' ');
    nombre.setAttribute('aria-label', etiqueta);

    const frag = document.createDocumentFragment();
    let i = 0;
    Array.from(nombre.childNodes).forEach(nodo => {
      if (nodo.nodeType !== 3) { frag.appendChild(nodo.cloneNode(true)); return; }   // <br>
      nodo.textContent.split(/(\s+)/).forEach(trozo => {
        if (!trozo) return;
        if (/^\s+$/.test(trozo)) { frag.appendChild(document.createTextNode(' ')); return; }
        const pal = document.createElement('span');
        pal.className = 'pal';
        pal.setAttribute('aria-hidden', 'true');
        Array.from(trozo).forEach(ch => {
          const l = document.createElement('span');
          l.className = 'letra';
          l.style.setProperty('--i', i++);
          l.textContent = ch;
          pal.appendChild(l);
        });
        frag.appendChild(pal);
      });
    });
    nombre.textContent = '';
    nombre.appendChild(frag);
  }

  /* ---------- 2. Títulos de sección: una <span> por palabra ---------- */
  $$('.titulo-seccion').forEach(t => {
    const palabras = t.textContent.trim().split(/\s+/);
    t.textContent = '';
    palabras.forEach((p, i) => {
      const s = document.createElement('span');
      s.className = 'p';
      s.style.setProperty('--i', i);
      s.textContent = p;
      t.appendChild(s);
      if (i < palabras.length - 1) t.appendChild(document.createTextNode(' '));
    });
  });

  /* ---------- 3. Cuenta regresiva: giro al cambiar ---------- */
  $$('.regresiva .num').forEach(n => {
    let ultimo = n.textContent;
    new MutationObserver(() => {
      const t = n.textContent;
      if (t === ultimo) return;
      ultimo = t;
      n.classList.remove('flip');
      void n.offsetWidth;                 // reinicia la animación
      n.classList.add('flip');
    }).observe(n, { childList: true, characterData: true, subtree: true });
  });

  /* ---------- Pausar animaciones infinitas fuera de pantalla (ahorra batería) ---------- */
  const pausador = new IntersectionObserver(es => {
    es.forEach(e => e.target.classList.toggle('fuera', !e.isIntersecting));
  }, { rootMargin: '60px' });
  if (hero) pausador.observe(hero);

  /* ---------- 4. Ornamentos que se dibujan ---------- */
  // pathLength=1 permite animar el trazo sin medir cada figura
  $$('svg defs symbol').forEach(sym =>
    $$('path, ellipse, circle, rect', sym).forEach(e => e.setAttribute('pathLength', '1')));
  $$('#laurel text').forEach(t => t.classList.add('xv'));

  const trazables = $$('.laurel, .esq, .ico');
  trazables.forEach(el => el.classList.add('dibujar'));

  function trazar(el, retardo = 0) {
    if (!el.classList.contains('dibujar')) return;
    el.style.setProperty('--ret', retardo + 's');
    el.classList.add('trazado');
    if (el.classList.contains('laurel')) {
      setTimeout(() => el.style.setProperty('--xv', '1'), (retardo + 1.2) * 1000);
    }
    el.addEventListener('animationend', () => {
      el.classList.remove('dibujar', 'trazado');
      el.classList.add('vivo');
      pausador.observe(el);
    }, { once: true });
  }

  const ioTrazo = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      trazar(e.target);
      ioTrazo.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  trazables.filter(el => !(hero && hero.contains(el))).forEach(el => ioTrazo.observe(el));

  // Divisores: se abren desde el centro
  const divisores = $$('.divisor');
  divisores.forEach(d => d.classList.add('abrir'));
  const ioDiv = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('abierto');
      ioDiv.unobserve(e.target);
    });
  }, { threshold: 0.8 });
  divisores.forEach(d => ioDiv.observe(d));

  /* ---------- Chispas y pétalos (Web Animations API) ---------- */
  function chispas(x, y, n, tipo) {
    if (!hayWAAPI) return;
    const petalos = tipo === 'petalos';
    const colores = petalos ? ['#ffffff', '#e6d6f7', '#c9b2eb', '#e8c97a'] : ['#f3d98c', '#e8c97a', '#ffffff'];
    for (let k = 0; k < n; k++) {
      const s = document.createElement('span');
      const esPetalo = petalos && k % 2 === 0;
      s.className = 'chispa' + (esPetalo ? ' petalo' : '');
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.background = colores[k % colores.length];
      document.body.appendChild(s);

      const ang = Math.random() * Math.PI * 2;
      const dist = (petalos ? 60 : 30) + Math.random() * (petalos ? 110 : 40);
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const caida = petalos ? 90 + Math.random() * 120 : 0;
      const rot = Math.random() * 360 - 180;
      const dur = (petalos ? 1400 : 700) + Math.random() * 500;

      s.animate([
        { transform: 'translate(-50%,-50%) translate3d(0,0,0) scale(.4) rotate(0deg)', opacity: 1 },
        { transform: `translate(-50%,-50%) translate3d(${dx}px,${dy}px,0) scale(1) rotate(${rot / 2}deg)`, opacity: 1, offset: .45 },
        { transform: `translate(-50%,-50%) translate3d(${dx * 1.1}px,${dy + caida}px,0) scale(.6) rotate(${rot}deg)`, opacity: 0 }
      ], { duration: dur, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' })
        .onfinish = () => s.remove();
    }
  }

  window.efectos = { chispas };   // lo usa rsvp.js para el confeti

  // Toque en cualquier ícono: rebote + destello
  document.addEventListener('pointerdown', e => {
    const ico = e.target.closest && e.target.closest('.ico');
    if (!ico || ico.classList.contains('dibujar')) return;
    ico.classList.remove('toque');
    void ico.getBoundingClientRect();
    ico.classList.add('toque');
    ico.addEventListener('animationend', () => ico.classList.remove('toque'), { once: true });
    chispas(e.clientX, e.clientY, 7, 'dorado');
  }, { passive: true });

  /* ---------- 5. Sello y apertura de la invitación ---------- */
  const bienvenida = $('#bienvenida');
  const sello = $('.sello');

  if (sello) {
    sello.addEventListener('pointerdown', () => {
      const o = document.createElement('span');
      o.className = 'onda';
      sello.appendChild(o);
      o.addEventListener('animationend', () => o.remove());
    }, { passive: true });
  }

  // Polvo dorado del hero
  function polvo() {
    if (!hero) return;
    hero.style.setProperty('--alto', hero.offsetHeight + 'px');
    for (let k = 0; k < 14; k++) {
      const p = document.createElement('span');
      p.className = 'polvo';
      p.setAttribute('aria-hidden', 'true');
      p.style.setProperty('--x', (Math.random() * 100).toFixed(1) + '%');
      p.style.setProperty('--t', (2 + Math.random() * 3).toFixed(1) + 'px');
      p.style.setProperty('--d', (8 + Math.random() * 6).toFixed(1) + 's');
      p.style.setProperty('--r', (-Math.random() * 12).toFixed(1) + 's');
      p.style.setProperty('--dx', (Math.random() * 60 - 30).toFixed(0) + 'px');
      hero.appendChild(p);
    }
  }

  function abrirHero() {
    if (!hero || hero.classList.contains('listo')) return;
    hero.classList.add('listo');
    $$('.dibujar', hero).forEach((el, i) => trazar(el, 0.4 + i * 0.3));
    polvo();
  }

  if (bienvenida) {
    bienvenida.addEventListener('click', () => {
      if (sello) {
        const r = sello.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        chispas(cx, cy, 26, 'petalos');
        chispas(cx, cy, 10, 'dorado');
      }
      setTimeout(abrirHero, 350);
    }, { once: true });
  } else {
    abrirHero();
  }

  /* ---------- Destellos dorados por toda la invitación ---------- */
  $$('main section.reveal').forEach((sec, k) => {
    const cantidad = sec.id === 'rsvp' ? 2 : 3;
    for (let j = 0; j < cantidad; j++) {
      const e = document.createElement('i');
      e.className = 'est est-sec';
      e.setAttribute('aria-hidden', 'true');
      const izq = (j + k) % 2 === 0;
      e.style.setProperty('--x', (izq ? 2 + Math.random() * 9 : 89 + Math.random() * 9).toFixed(0) + '%');
      e.style.setProperty('--y', (6 + j * 30 + Math.random() * 20).toFixed(0) + '%');
      e.style.setProperty('--s', (8 + Math.random() * 8).toFixed(0) + 'px');
      e.style.setProperty('--d', (2.8 + Math.random() * 2).toFixed(1) + 's');
      e.style.setProperty('--r', (Math.random() * 3).toFixed(1) + 's');
      sec.appendChild(e);
    }
    pausador.observe(sec);
  });

  /* ---------- 6. Parallax suave de las flores ---------- */
  const paralelos = [['.flores-top', 0.12], ['.flores-lado', 0.08]]
    .map(([sel, f]) => ({ el: $(sel), f }))
    .filter(o => o.el && o.el.parentElement);

  let pendiente = false;
  function mover() {
    pendiente = false;
    const vh = window.innerHeight;
    paralelos.forEach(({ el, f }) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const c = (r.top + r.height / 2) - vh / 2;
      el.style.transform = `translate3d(0, ${(-c * f).toFixed(1)}px, 0)`;
    });
  }
  if (paralelos.length) {
    window.addEventListener('scroll', () => {
      if (!pendiente) { pendiente = true; requestAnimationFrame(mover); }
    }, { passive: true });
    window.addEventListener('resize', mover, { passive: true });
    mover();
  }
})();
