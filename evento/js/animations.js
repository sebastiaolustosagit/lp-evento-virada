/**
 * Animations - GSAP + ScrollTrigger + ScrollSmoother
 * 
 * GSAP (GreenSock Animation Platform) é usado para:
 * - Animações suaves e performáticas
 * - ScrollTrigger: animações baseadas em scroll
 * - ScrollSmoother: scroll suave (smooth scrolling)
 * 
 * IMPORTANTE: Desde a aquisição pelo Webflow, GSAP e todos os plugins
 * (incluindo ScrollSmoother, SplitText, etc) são 100% GRATUITOS!
 * 
 * REQUISITOS HTML:
 * Para ScrollSmoother funcionar, sua estrutura deve ser:
 * 
 * <body>
 *   <div id="smooth-wrapper">
 *     <div id="smooth-content">
 *       <!-- Todo o conteúdo da página aqui -->
 *     </div>
 *   </div>
 * </body>
 */

// Aguarda DOM e GSAP carregarem
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se GSAP está disponível
  if (typeof gsap === 'undefined') {
    console.warn('⚠️ GSAP não carregado. Verifique se os scripts estão incluídos.');
    return;
  }

  // Registra plugins
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    console.log('✅ ScrollTrigger registrado');
  }

  // if (typeof ScrollSmoother !== 'undefined') {
  //   gsap.registerPlugin(ScrollSmoother);
  //   initScrollSmoother();
  //   console.log('✅ ScrollSmoother registrado');
  // }

  // Inicializa animações padrão
  initDefaultAnimations();
});

/**
 * Inicializa ScrollSmoother para smooth scrolling
 * Requer estrutura HTML com #smooth-wrapper e #smooth-content
 */
function initScrollSmoother() {
  const wrapper = document.querySelector('#smooth-wrapper');
  const content = document.querySelector('#smooth-content');

  if (!wrapper || !content) {
    console.warn('⚠️ ScrollSmoother: #smooth-wrapper ou #smooth-content não encontrados');
    return null;
  }

  const smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.5,           // Tempo de suavização (segundos)
    effects: true,         // Habilita data-speed e data-lag
    smoothTouch: 0.1,      // Suavização em touch (0 = desabilitado)
  });

  // Expõe globalmente para uso em outros scripts
  window.smoother = smoother;

  return smoother;
}

/**
 * Animações padrão usando ScrollTrigger
 * Adicione data-animate às seções para ativar
 */
function initDefaultAnimations() {
  // Fade in de elementos com data-animate="fade-up"
  gsap.utils.toArray('[data-animate="fade-up"]').forEach(element => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Fade in da esquerda com data-animate="fade-left"
  gsap.utils.toArray('[data-animate="fade-left"]').forEach(element => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Fade in da direita com data-animate="fade-right"
  gsap.utils.toArray('[data-animate="fade-right"]').forEach(element => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      x: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Scale in com data-animate="scale-in"
  gsap.utils.toArray('[data-animate="scale-in"]').forEach(element => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });
  });

  // Stagger para listas com data-animate="stagger"
  gsap.utils.toArray('[data-animate="stagger"]').forEach(container => {
    const items = container.children;
    gsap.from(items, {
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    });
  });
}

/**
 * Helpers expostos globalmente para uso em páginas específicas
 */
window.animations = {
  /**
   * Cria uma timeline de animação com ScrollTrigger
   * @param {string} trigger - Seletor do elemento trigger
   * @param {object} options - Opções do ScrollTrigger
   * @returns {gsap.core.Timeline}
   */
  createScrollTimeline(trigger, options = {}) {
    return gsap.timeline({
      scrollTrigger: {
        trigger,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        ...options
      }
    });
  },

  /**
   * Anima elemento para dentro da viewport
   * @param {string|Element} target - Elemento ou seletor
   * @param {object} fromVars - Propriedades iniciais
   * @param {object} scrollOptions - Opções do ScrollTrigger
   */
  animateIn(target, fromVars = {}, scrollOptions = {}) {
    gsap.from(target, {
      scrollTrigger: {
        trigger: target,
        start: 'top 85%',
        toggleActions: 'play none none none',
        ...scrollOptions
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out',
      ...fromVars
    });
  },

  /**
   * Cria efeito parallax em elemento
   * @param {string|Element} target - Elemento ou seletor
   * @param {number} speed - Velocidade do parallax (0.5 = metade da velocidade)
   */
  parallax(target, speed = 0.5) {
    gsap.to(target, {
      scrollTrigger: {
        trigger: target,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: (i, el) => -el.offsetHeight * speed,
      ease: 'none'
    });
  },

  /**
   * Refresh ScrollTrigger (útil após mudanças no DOM)
   */
  refresh() {
    ScrollTrigger.refresh();
  }
};
