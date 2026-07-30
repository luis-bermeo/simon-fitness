/**
 * SIMÓN FITNESS - MAIN APPLICATION LOGIC & GSAP SCROLLTRIGGER ENGINE (v3.2)
 * Sincronización perfecta del scroll con las 3 escenas 3D (Mancuerna, Cinta, Bicicleta).
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Inicializar escena 3D WebGL
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

  // 3. Intersection Observer para animaciones de entrada Apple
  setupFadeInObserver();

  // 4. Header y Formulario
  setupHeaderScroll();
  setupContactForm();
});

/* ==========================================================================
   GSAP SCROLLTRIGGER SCROLLYTELLING LOGIC
   ========================================================================== */

function setupScrollytelling() {
  // Sincronización global del progreso de scroll con Three.js
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

  // Animaciones sutiles de la tarjetas al entrar
  gsap.utils.toArray('.service-card-box').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.15,
      ease: 'power3.out'
    });
  });
}

function setupFadeInObserver() {
  const elements = document.querySelectorAll('.fade-in-up, .why-us-card, .review-card');
  
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

function setupMetricsCountUp() {
  const metricElements = document.querySelectorAll('.metric-number[data-target]');
  if (!metricElements.length) return;

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
