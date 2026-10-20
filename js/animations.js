// animations.js — revela secciones al hacer scroll

const elementos = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elementos.forEach(el => observer.observe(el));
} else {
  // Navegadores muy viejos: mostrar todo sin animación
  elementos.forEach(el => el.classList.add('visible'));
}
