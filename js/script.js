/**
 * SIMÓN FITNESS - MAIN APPLICATION LOGIC & INTERSECTION OBSERVER (v3.0)
 * Transiciones suaves de entrada estilo Apple, validación e inicialización.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Inicializar Motor 3D Acotado
  if (window.SimonFitness3D) {
    window.SimonFitness3D.init();
  }

  // 2. Intersection Observer para Animaciones Fade-In-Up suaves estilo Apple
  setupFadeInObserver();

  // 3. Animación de Contadores de Métricas
  setupMetricsCountUp();

  // 4. Header & Formulario
  setupHeaderScroll();
  setupContactForm();
});

/* ==========================================================================
   INTERSECTION OBSERVER PARA ANIMACIONES DE ENTRADA (FADE-IN-UP)
   ========================================================================== */

function setupFadeInObserver() {
  const elements = document.querySelectorAll('.fade-in-up, .bounded-3d-card, .why-us-card, .review-card');
  
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
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => {
    el.classList.add('fade-in-up');
    observer.observe(el);
  });
}

/* ==========================================================================
   ANIMACIÓN DE CONTADORES DE MÉTRICAS (Count-Up)
   ========================================================================== */

function setupMetricsCountUp() {
  const metricElements = document.querySelectorAll('.metric-number[data-target]');
  if (!metricElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';

        let current = 0;
        const duration = 1800; // ms
        const stepTime = 20;
        const increment = target / (duration / stepTime);

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = `${target}${suffix}`;
            clearInterval(timer);
          } else {
            el.textContent = `${Math.floor(current)}${suffix}`;
          }
        }, stepTime);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  metricElements.forEach(el => observer.observe(el));
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
