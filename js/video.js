// video.js — video de fondo del hero, pensado para ahorrar datos y batería

const video = document.getElementById('video-hero');
const hero = document.querySelector('.hero');
const ahorroDeDatos = navigator.connection && navigator.connection.saveData;
let iniciado = false;

window.iniciarVideo = function () {
  if (!video || ahorroDeDatos) return;  // con "ahorro de datos" se queda el póster/fondo
  iniciado = true;
  video.muted = true;
  video.play().catch(() => { /* si el navegador lo bloquea, queda el fondo */ });
};

// Pausa el video cuando el hero sale de pantalla (ahorra batería)
if (video && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    if (!iniciado) return;
    if (entry.isIntersecting) video.play().catch(() => {});
    else video.pause();
  }, { threshold: 0.1 }).observe(hero);
}
