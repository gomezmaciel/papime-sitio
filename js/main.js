/* =============================================
   PAPIME PE101825 — main.js
   Utilidades compartidas por todas las páginas
   ============================================= */

/* ── Carrusel genérico ──────────────────────
   Uso:
     initCarousel('track-e1', 'dots-e1', 'counter-e1')
   Expone globalmente:
     Carousel.move('track-e1',  1)   → siguiente
     Carousel.move('track-e1', -1)   → anterior
──────────────────────────────────────────── */
const Carousel = (() => {
  const state = {};   // { trackId: { idx, total } }

  function init(trackId, dotsId, counterId) {
    const track   = document.getElementById(trackId);
    const dotsEl  = document.getElementById(dotsId);
    const counter = document.getElementById(counterId);
    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    const total  = slides.length;
    state[trackId] = { idx: 0, total };

    // Generar puntos
    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Foto ' + (i + 1));
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => goTo(trackId, i, dotsEl, counter, track));
      dotsEl.appendChild(btn);
    }
  }

  function goTo(trackId, n, dotsEl, counter, track) {
    const s   = state[trackId];
    s.idx     = (n + s.total) % s.total;
    track.style.transform = `translateX(-${s.idx * 100}%)`;
    if (counter) counter.textContent = `${s.idx + 1} / ${s.total}`;
    dotsEl.querySelectorAll('button').forEach((d, i) =>
      d.classList.toggle('active', i === s.idx)
    );
  }

  function move(trackId, dir) {
    const s = state[trackId];
    if (!s) return;
    const track   = document.getElementById(trackId);
    const dotsEl  = track.closest('.carousel').querySelector('.carousel-dots');
    const counter = track.closest('.carousel').querySelector('.carousel-counter');
    goTo(trackId, s.idx + dir, dotsEl, counter, track);
  }

  return { init, move };
})();


/* ── Marcar enlace activo en la navbar ───── */
function markActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) link.classList.add('active');
  });
}
document.addEventListener('DOMContentLoaded', markActiveNav);


/* ── Resaltar estación en el índice al hacer scroll ── */
function initStationObserver() {
  const pills    = document.querySelectorAll('.station-pill');
  const sections = document.querySelectorAll('section[id^="estacion"]');
  if (!sections.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        pills.forEach(p => p.classList.remove('active'));
        const active = document.querySelector(`.station-pill[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
}
document.addEventListener('DOMContentLoaded', initStationObserver);
