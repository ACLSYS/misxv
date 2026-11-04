// main.js — arranque: lee la URL (?invitado=...&pases=...&mesa=...) y abre la bienvenida

const PASES_DEFAULT = 1;   // pases si el link no trae ?pases= (links generales = 1 pase)
const PASES_MAXIMO = 10;   // tope de seguridad por si hay un error al escribir el link

const params = new URLSearchParams(window.location.search);
const invitado = (params.get('invitado') || '').trim().slice(0, 60);
const mesa = (params.get('mesa') || '').trim().slice(0, 12);

// Link general para amigos: ?invitado=amigos (cada quien escribe su nombre en el pase)
const esAmigos = invitado.toLowerCase() === 'amigos';

let pases = parseInt(params.get('pases'), 10);
if (!Number.isInteger(pases) || pases < 1) pases = PASES_DEFAULT;
pases = Math.min(pases, PASES_MAXIMO);

// Datos compartidos con rsvp.js
window.invitacion = {
  invitado: esAmigos ? '' : invitado,
  pases,
  pasesDesdeUrl: params.has('pases'),
  mesa,
  esAmigos
};

// Texto que se muestra en el sobre y en el pase (textContent: seguro contra inyección)
const textoInvitado = esAmigos ? 'amig@' : (invitado || 'Querido invitado');
document.querySelectorAll('[data-invitado]').forEach(el => {
  el.textContent = textoInvitado;
});

// Bienvenida: mientras está abierta, no se puede hacer scroll
const bienvenida = document.getElementById('bienvenida');
if (bienvenida) {
  document.documentElement.classList.add('bloqueado');
  bienvenida.addEventListener('click', () => {
    bienvenida.classList.add('oculta');
    document.documentElement.classList.remove('bloqueado');
    window.scrollTo(0, 0);
    // El toque del usuario permite iniciar la música
    if (window.iniciarMusica) window.iniciarMusica();
  }, { once: true });
}