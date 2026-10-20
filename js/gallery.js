// gallery.js — lightbox: toca una foto para verla grande

const fotos = document.querySelectorAll('[data-foto]');

if (fotos.length) {
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Foto ampliada');
  overlay.innerHTML = '<button type="button" class="lightbox-cerrar" aria-label="Cerrar">✕</button><img alt="">';
  document.body.appendChild(overlay);

  const img = overlay.querySelector('img');
  const botonCerrar = overlay.querySelector('button');
  let origen = null;

  function abrir(foto) {
    origen = foto;
    img.src = foto.dataset.foto;
    img.alt = foto.getAttribute('aria-label') || 'Foto';
    overlay.hidden = false;
    document.documentElement.classList.add('bloqueado');
    botonCerrar.focus();
  }

  function cerrar() {
    overlay.hidden = true;
    img.removeAttribute('src');
    document.documentElement.classList.remove('bloqueado');
    if (origen) origen.focus();
  }

  fotos.forEach(foto => foto.addEventListener('click', () => abrir(foto)));
  overlay.addEventListener('click', cerrar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) cerrar();
  });
}
