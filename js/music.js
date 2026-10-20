// music.js — música de fondo (arranca tras el toque en el sello)

const audio = document.getElementById('musica-fondo');
const boton = document.getElementById('toggle-musica');
let sonando = false;
let reanudar = false;

function actualizar() {
  if (!boton) return;
  boton.classList.toggle('pausada', !sonando);
  boton.setAttribute('aria-pressed', String(sonando));
  boton.setAttribute('aria-label', sonando ? 'Pausar música' : 'Activar música');
}

function reproducir() {
  if (!audio) return;
  audio.play()
    .then(() => { sonando = true; actualizar(); })
    .catch(() => { sonando = false; actualizar(); });
}

window.iniciarMusica = reproducir;

if (boton && audio) {
  boton.addEventListener('click', () => {
    if (audio.paused) {
      reproducir();
    } else {
      audio.pause();
      sonando = false;
      actualizar();
    }
  });

  // En móvil: pausa al cambiar de app o apagar pantalla, y reanuda al volver
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && sonando) {
      audio.pause();
      reanudar = true;
    } else if (!document.hidden && reanudar) {
      reanudar = false;
      reproducir();
    }
  });
}
