// rsvp.js — arma el mensaje y abre WhatsApp (no se guarda nada en ningún servidor)

const form = document.getElementById('rsvp-form');

if (form) {
  // El número viene del HTML: <form ... data-whatsapp="529871163233">
  const WHATSAPP_NUMERO = form.dataset.whatsapp || '529871163233';

  const selectPases = document.getElementById('rsvp-pases');
  const bloquePases = selectPases ? selectPases.closest('div') : null;

  // Si no asisten, se oculta el número de asistentes
  form.querySelectorAll('input[name="asiste"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (bloquePases) bloquePases.hidden = (radio.value === 'no' && radio.checked);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputNombre = document.getElementById('rsvp-nombre');
    const nombre = inputNombre.value.trim();
    const asiste = form.querySelector('input[name="asiste"]:checked');

    if (!nombre) { inputNombre.focus(); return; }
    if (!asiste) return;

    const datos = window.invitacion || {};
    let mensaje = 'Hola, confirmo mi respuesta para los XV años de Ana Regina y Zoe Natalia (28 de noviembre).\n\n';
    mensaje += `Nombre: ${nombre}\n`;

    if (asiste.value === 'si') {
      mensaje += `Asistencia: Sí, ahí estaré\nAsistentes: ${selectPases.value}`;
    } else {
      mensaje += 'Asistencia: No podré asistir';
    }
    // Referencia para quien organiza: cuántos pases traía el link
    if (datos.pasesDesdeUrl) mensaje += `\n(Pases de la invitación: ${datos.pases})`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    // En móvil abre la app de WhatsApp; si el navegador bloquea la ventana, navega directo
    const ventana = window.open(url, '_blank');
    if (!ventana) window.location.href = url;
  });
}