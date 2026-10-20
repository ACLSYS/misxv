// main.js — arranque: lee la URL (?invitado=...&pases=...) y abre la bienvenida

const PASES_DEFAULT = 4;   // máximo si el link no trae ?pases=
const PASES_MAXIMO = 20;   // tope de seguridad por si hay un error al escribir el link

const params = new URLSearchParams(window.location.search);
const invitado = (params.get('invitado') || '').trim();

let pases = parseInt(params.get('pases'), 10);
if (!Number.isInteger(pases) || pases < 1) pases = PASES_DEFAULT;
pases = Math.min(pases, PASES_MAXIMO);

// Datos compartidos con rsvp.js
window.invitacion = { invitado, pases, pasesDesdeUrl: params.has('pases') };

// Nombre del invitado donde corresponda (textContent: seguro contra inyección)
document.querySelectorAll('[data-invitado]').forEach(el => {
  el.textContent = invitado || 'Querido invitado';
});

// Nombre precargado en el formulario
const inputNombre = document.getElementById('rsvp-nombre');
if (inputNombre && invitado) inputNombre.value = invitado;

// Select de asistentes: de 1 hasta el máximo permitido
const selectPases = document.getElementById('rsvp-pases');
if (selectPases) {
  for (let i = 1; i <= pases; i++) {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = i;
    selectPases.appendChild(opt);
  }
}

// Bienvenida: mientras está abierta, no se puede hacer scroll
const bienvenida = document.getElementById('bienvenida');
if (bienvenida) {
  document.documentElement.classList.add('bloqueado');
  bienvenida.addEventListener('click', () => {
    bienvenida.classList.add('oculta');
    document.documentElement.classList.remove('bloqueado');
    window.scrollTo(0, 0);
    // El click del usuario permite iniciar música y video
    if (window.iniciarMusica) window.iniciarMusica();
    if (window.iniciarVideo) window.iniciarVideo();
  }, { once: true });
}

