// rsvp.js — arma el mensaje y abre WhatsApp (no se guarda nada en ningún servidor)
// Cambia este número por el WhatsApp real (con código de país, sin + ni espacios):
const WHATSAPP_NUMERO = '5210000000000';

const form = document.getElementById('rsvp-form');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputNombre = document.getElementById('rsvp-nombre');
    const nombre = inputNombre.value.trim();
    const asiste = form.querySelector('input[name="asiste"]:checked');
    const asistentes = document.getElementById('rsvp-pases').value;

    if (!nombre) { inputNombre.focus(); return; }
    if (!asiste) return;

    const datos = window.invitacion || {};
    let mensaje = 'Hola, confirmo mi respuesta para los XV.\n\n';
    mensaje += `Nombre: ${nombre}\n`;

    if (asiste.value === 'si') {
      mensaje += `Asistencia: Sí\nAsistentes: ${asistentes}`;
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
