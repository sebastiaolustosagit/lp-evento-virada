document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initYear();
  initStickyCta();
});

function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 500,
    once: true,
    offset: 30,
    easing: 'ease-out-cubic',
    anchorPlacement: 'top-bottom',
    disable: false
  });

  /* Override AOS default translate distances to 75% less movement */
  document.querySelectorAll('[data-aos]').forEach(el => {
    const aos = el.getAttribute('data-aos');
    if (aos.includes('fade-up') || aos.includes('fade-down') ||
        aos.includes('fade-left') || aos.includes('fade-right')) {
      el.setAttribute('data-aos-offset', '20');
    }
    if (aos === 'zoom-in' || aos === 'zoom-out') {
      el.setAttribute('data-aos-offset', '20');
    }
  });
}

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

function initStickyCta() {
  const sticky = document.getElementById('stickyCta');
  const trigger = document.getElementById('resultados');
  if (!sticky || !trigger) return;

  const update = () => {
    const rect = trigger.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const shouldShow = midpoint <= window.innerHeight / 2;
    sticky.classList.toggle('is-visible', shouldShow);
    sticky.setAttribute('aria-hidden', !shouldShow);
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}
