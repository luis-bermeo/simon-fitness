/**
 * SIMÓN FITNESS - MAIN APPLICATION LOGIC & GSAP SCROLLTRIGGER ENGINE
 * Coordinación de Scrollytelling, animación de métricas y validación interactiva.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Inicializar la escena WebGL 3D
  if (window.SimonFitness3D) {
    window.SimonFitness3D.init();
  }

  // 2. Registrar GSAP y ScrollTrigger si están disponibles
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    setupScrollytelling();
    setupMetricsCountUp();
  } else {
    console.warn('GSAP o ScrollTrigger no cargados. Utilizando fallback CSS.');
    setupFallbackScroll();
  }

  // 3. Inicializar funcionalidades interactivas (Formulario, Header, WhatsApp)
  setupHeaderScroll();
  setupContactForm();
});

/* ==========================================================================
   GSAP SCROLLTRIGGER SCROLLYTELLING LOGIC
   ========================================================================== */

function setupScrollytelling() {
  // Sincronización del canvas 3D con el Scroll total del documento
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const progress = self.progress;
      // Calcular la sección activa (0 a 4)
      const sectionIndex = Math.floor(progress * 5);
      if (window.SimonFitness3D) {
        window.SimonFitness3D.setScrollProgress(progress, sectionIndex);
      }
    }
  });

  // ANIMACIÓN HERO SCROLL (Escalado de Título e Revelado de Subtítulo SEO)
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
      pin: false
    }
  });

  heroTl
    .to('.hero-title-wrapper', {
      scale: 0.82,
      opacity: 0.9,
      ease: 'power1.out'
    }, 0)
    .to('.hero-subtitle-seo', {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.1)
    .to('.hero-cta-group', {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.2);

  // ANIMACIÓN DE REVELADO DE TARJETAS DE SERVICIO POR SCROLL
  gsap.utils.toArray('.service-card-apple').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.15,
      ease: 'power3.out'
    });
  });

  // ANIMACIÓN DE REVELADO SECCIÓN "POR QUÉ ELEGIRNOS"
  gsap.utils.toArray('.why-us-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none reverse'
      },
      scale: 0.92,
      opacity: 0,
      duration: 0.6,
      delay: (index % 3) * 0.1,
      ease: 'back.out(1.4)'
    });
  });
}

/* ==========================================================================
   ANIMACIÓN DE CONTADORES DE MÉTRICAS (Count-Up)
   ========================================================================== */

function setupMetricsCountUp() {
  const metricElements = document.querySelectorAll('.metric-number[data-target]');
  
  metricElements.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        let countObj = { val: 0 };
        gsap.to(countObj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${Math.floor(countObj.val)}${suffix}`;
          }
        });
      }
    });
  });
}

/* Fallback si GSAP no se carga */
function setupFallbackScroll() {
  const heroSub = document.querySelector('.hero-subtitle-seo');
  const heroCta = document.querySelector('.hero-cta-group');
  if (heroSub) heroSub.style.opacity = '1';
  if (heroCta) heroCta.style.opacity = '1';
}

/* ==========================================================================
   ESTADO DEL HEADER AL HACER SCROLL
   ========================================================================== */

function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   FORMULARIO DE CONTACTO CON VALIDACIÓN EN TIEMPO REAL
   ========================================================================== */

function setupContactForm() {
  const form = document.getElementById('simon-contact-form');
  const successMsg = document.getElementById('form-success-msg');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación básica de campos requeridos
    const nameInput = form.querySelector('[name="nombre"]');
    const phoneInput = form.querySelector('[name="telefono"]');
    const emailInput = form.querySelector('[name="email"]');
    const messageInput = form.querySelector('[name="mensaje"]');

    let isValid = true;

    [nameInput, phoneInput, emailInput, messageInput].forEach(input => {
      if (input && !input.value.trim()) {
        input.style.borderColor = '#E30613';
        isValid = false;
      } else if (input) {
        input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }
    });

    if (!isValid) return;

    // Simulación de envío exitoso futurista
    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) {
        successMsg.style.display = 'block';
      }
    }, 1200);
  });
}
