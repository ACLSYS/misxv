// countdown.js — calcula el tiempo restante hasta el evento
// Cambia esta fecha por la fecha y hora real del evento:
const FECHA_EVENTO = new Date('2026-12-15T20:00:00');

const elDias = document.getElementById('cnt-dias');
const elHrs = document.getElementById('cnt-hrs');
const elMin = document.getElementById('cnt-min');
const elSeg = document.getElementById('cnt-seg');

function actualizarRegresiva() {
  const ahora = new Date();
  let diferencia = FECHA_EVENTO - ahora;
  if (diferencia < 0) diferencia = 0;

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
  const segundos = Math.floor((diferencia / 1000) % 60);

  if (elDias) elDias.textContent = String(dias).padStart(2, '0');
  if (elHrs) elHrs.textContent = String(horas).padStart(2, '0');
  if (elMin) elMin.textContent = String(minutos).padStart(2, '0');
  if (elSeg) elSeg.textContent = String(segundos).padStart(2, '0');
}

if (elDias) {
  actualizarRegresiva();
  setInterval(actualizarRegresiva, 1000);
}
