// rsvp.js — pase de entrada: arma el mensaje y abre WhatsApp (no se guarda nada en ningún servidor)

const form = document.getElementById('rsvp-form');

if (form) {
  const $ = id => document.getElementById(id);
  const WHATSAPP_NUMERO = form.dataset.whatsapp || '529871163233';
  const datos = window.invitacion || { invitado: '', pases: 4, pasesDesdeUrl: false, mesa: '' };
  const maxPases = datos.pases;

  // ---------- Datos del encabezado ----------
  if (datos.pasesDesdeUrl) {
    $('dato-pases').textContent = maxPases;
    $('dato-pases-txt').textContent = maxPases === 1 ? 'persona' : 'personas';
    $('dato-pases-wrap').hidden = false;
  }
  if (datos.mesa) {
    $('dato-mesa').textContent = datos.mesa;
    $('dato-mesa-wrap').hidden = false;
  }
  // Link sin ?invitado=: se pide el nombre
  if (!datos.invitado) $('campo-nombre').hidden = false;

  // ---------- Días para confirmar ----------
  const limite = new Date((form.dataset.limite || '2026-11-18') + 'T23:59:59-05:00');
  const dias = Math.ceil((limite - new Date()) / 864e5);
  $('limite-txt').textContent =
    dias > 1 ? `Quedan ${dias} días para confirmar` :
    dias === 1 ? 'Último día para confirmar' : 'Confirma a la brevedad';

  // ---------- Contador de asistentes ----------
  const btn = $('enviar'), nota = $('nota'), bloque = $('bloque-pases');
  const num = $('num'), menos = $('menos'), mas = $('mas');
  let n = maxPases;                                  // por defecto, todos los pases
  $('max-txt').textContent = maxPases === 1 ? 'de 1 pase' : `de ${maxPases} pases`;

  function pinta(animar) {
    num.textContent = n;
    menos.disabled = n <= 1;
    mas.disabled = n >= maxPases;
    if (animar) { num.classList.remove('sube'); void num.offsetWidth; num.classList.add('sube'); }
  }
  pinta(false);
  menos.addEventListener('click', () => { if (n > 1) { n--; pinta(true); } });
  mas.addEventListener('click', () => { if (n < maxPases) { n++; pinta(true); } });

  // Sí / No: si no asisten, se pliega el contador
  form.querySelectorAll('input[name="asiste"]').forEach(radio => {
    radio.addEventListener('change', () => {
      bloque.classList.toggle('cerrado', radio.value === 'no');
      btn.disabled = false;
      nota.style.visibility = 'hidden';
    });
  });

  // ---------- Enviar ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputNombre = $('rsvp-nombre');
    const nombre = datos.invitado || inputNombre.value.trim();
    const asiste = form.querySelector('input[name="asiste"]:checked');

    if (!nombre) { inputNombre.focus(); return; }
    if (!asiste) return;

    const si = asiste.value === 'si';
    const mensajeExtra = $('mensaje').value.trim();

    let mensaje = 'Hola, confirmo mi respuesta para los XV años de Ana Regina y Zoe Natalia (28 de noviembre).\n\n';
    mensaje += `Nombre: ${nombre}\n`;
    mensaje += si ? `Asistencia: Sí, ahí estaré\nAsistentes: ${n}` : 'Asistencia: No podré asistir';
    if (mensajeExtra) mensaje += `\nMensaje: ${mensajeExtra}`;
    if (datos.pasesDesdeUrl) mensaje += `\n(Pases de la invitación: ${maxPases})`;
    if (datos.mesa) mensaje += `\n(Mesa: ${datos.mesa})`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    $('wa').href = url;

    // Pantalla de gracias
    $('gracias-titulo').textContent = si ? '¡Gracias, te esperamos!' : 'Gracias por avisarnos';
    $('gracias-texto').textContent = si
      ? `Confirmaste ${n} ${n === 1 ? 'lugar' : 'lugares'}. Si WhatsApp no se abrió, toca el botón verde.`
      : 'Lamentamos que no puedas acompañarnos. Si WhatsApp no se abrió, toca el botón verde.';
    $('cal').hidden = !si;
    form.classList.add('listo');

    // Confeti dorado (viene de effects.js; si no está, simplemente no hay confeti)
    if (window.efectos) {
      const r = btn.getBoundingClientRect();
      window.efectos.chispas(r.left + r.width / 2, r.top + r.height / 2, 30, 'petalos');
    }

    // En móvil abre la app de WhatsApp; si el navegador bloquea la ventana, navega directo
    const ventana = window.open(url, '_blank');
    if (!ventana) window.location.href = url;
  });

  $('cambiar').addEventListener('click', () => form.classList.remove('listo'));

  // ---------- Agregar al calendario (.ics) ----------
  $('cal').addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//XV Ana y Zoe//ES', 'BEGIN:VEVENT',
      'UID:xv-ana-zoe-2026@aclsys', 'DTSTAMP:20261001T000000Z',
      'DTSTART:20261129T003000Z', 'DTEND:20261129T070000Z',
      'SUMMARY:XV años de Ana Regina y Zoe Natalia', 'LOCATION:Cozumel\\, Q. Roo',
      'DESCRIPTION:Ceremonia 7:30 PM · Recepción 9:00 PM · Código de vestimenta: Casual',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'xv-ana-y-zoe.ics';
    document.body.appendChild(a); a.click(); a.remove();
  });

  // ---------- Inclinación 3D + reflejo al tocar el encabezado (el scroll vertical sigue libre) ----------
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const cab = $('pase-cabeza');
    let abajo = false;
    const reset = () => {
      abajo = false; form.classList.remove('toca');
      form.style.setProperty('--rx', '0deg'); form.style.setProperty('--ry', '0deg');
      form.style.setProperty('--go', '0');
    };
    const mueve = e => {
      const r = form.getBoundingClientRect();
      const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
      const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
      form.style.setProperty('--ry', ((px - .5) * 18).toFixed(1) + 'deg');
      form.style.setProperty('--rx', ((.5 - py) * 22).toFixed(1) + 'deg');
      const c = cab.getBoundingClientRect();
      form.style.setProperty('--gx', (((e.clientX - c.left) / c.width) * 100).toFixed(0) + '%');
      form.style.setProperty('--gy', (((e.clientY - c.top) / c.height) * 100).toFixed(0) + '%');
      form.style.setProperty('--go', '1');
    };
    cab.addEventListener('pointerdown', e => { abajo = true; form.classList.add('toca'); mueve(e); });
    cab.addEventListener('pointermove', e => {
      if (abajo || e.pointerType === 'mouse') { form.classList.add('toca'); mueve(e); }
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => cab.addEventListener(ev, reset));
  }
}
