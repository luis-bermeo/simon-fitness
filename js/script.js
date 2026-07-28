/**
 * SIMÓN FITNESS - MAIN APPLICATION LOGIC & GSAP SCROLLTRIGGER ENGINE (v2.1)
 * Coordinación de Scrollytelling 3D, animación de métricas y validación interactiva.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Inicializar la escena WebGL 3D
  if (window.SimonFitness3D) {
    window.SimonFitness3D.init();
  }

  // 2. Registrar GSAP y ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    setupScrollytelling();
    setupMetricsCountUp();
  } else {
    setupFallbackScroll();
  }

  // 3. Header & Formulario
  setupHeaderScroll();
  setupContactForm();
});

/* ==========================================================================
   GSAP SCROLLTRIGGER SCROLLYTELLING LOGIC
   ========================================================================== */

function setupScrollytelling() {
  // Enlace del scroll global con la escena 3D en Three.js
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      if (window.SimonFitness3D) {
        window.SimonFitness3D.setScrollProgress(self.progress);
      }
    }
  });

  // Animaciones de revelado de tarjetas de servicio
  gsap.utils.toArray('.service-card-apple').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      delay: index * 0.12,
      ease: 'power3.out'
    });
  });

  // Animaciones de la sección "¿Por Qué Elegirnos?"
  gsap.utils.toArray('.why-us-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      scale: 0.95,
      opacity: 0,
      duration: 0.5,
      delay: (index % 3) * 0.08,
      ease: 'back.out(1.3)'
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
    const suffix = el.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        let countObj = { val: 0 };
        gsap.to(countObj, {
          val: target,
          duration: 2.0,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.floor(countObj.val)}${suffix}`;
          }
        });
      }
    });
  });
}

function setupFallbackScroll() {
  const heroSub = document.querySelector('.hero-subtitle-seo');
  if (heroSub) heroSub.style.opacity = '1';
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

    const submitBtn = form.querySelector('.form-submit-btn');
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) {
        successMsg.style.display = 'block';
      }
    }, 1000);
  });
}
