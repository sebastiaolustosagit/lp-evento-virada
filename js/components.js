/**
 * Components
 * Inicialização de componentes interativos
 * 
 * O ticker carousel agora usa CSS puro (ver components.css)
 * Accordion usa <details> nativo do HTML5
 */

/**
 * Smooth scroll para links de âncora
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
