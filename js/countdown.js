// countdown.js — cuenta regresiva hasta el evento.
// La fecha sale de data-fecha en .regresiva (index.html): una sola fuente de verdad.
// Antes apuntaba al 15-dic-2026 20:00 (valor de plantilla); el evento es el 28-nov-2026 19:30 (Cozumel, -05:00).

(() => {
  const contenedor = document.querySelector('.regresiva');
  const elDias = document.getElementById('cnt-dias');
  const elHrs = document.getElementById('cnt-hrs');
  const elMin = document.getElementById('cnt-min');
  const elSeg = document.getElementById('cnt-seg');
  if (!elDias) return;

  let fecha = new Date((contenedor && contenedor.dataset.fecha) || '2026-11-28T19:30:00-05:00');
  if (isNaN(fecha)) fecha = new Date('2026-11-28T19:30:00-05:00');

  const dos = n => String(n).padStart(2, '0');

  function actualizar() {
    const diferencia = Math.max(0, fecha - new Date());
    const dias = Math.floor(diferencia / 864e5);
    const horas = Math.floor((diferencia / 36e5) % 24);
    const minutos = Math.floor((diferencia / 6e4) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    elDias.textContent = dos(dias);
    if (elHrs) elHrs.textContent = dos(horas);
    if (elMin) elMin.textContent = dos(minutos);
    if (elSeg) elSeg.textContent = dos(segundos);
  }

  actualizar();
  setInterval(actualizar, 1000);
})();
