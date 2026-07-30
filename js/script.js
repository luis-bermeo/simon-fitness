/**
 * SIMÓN FITNESS - MAIN APPLICATION LOGIC (v4.0 100% Visible & Robust)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Inicializar Motor 3D Multi-Canvas
  if (window.SimonFitness3D) {
    window.SimonFitness3D.init();
  }

  // 2. Animaciones de métricas
  setupMetricsCountUp();

  // 3. Header y Formulario
  setupHeaderScroll();
  setupContactForm();
});

function setupMetricsCountUp() {
  const metricElements = document.querySelectorAll('.metric-number[data-target]');
  if (!metricElements.length) return;

  metricElements.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';

    let current = 0;
    const duration = 1500;
    const stepTime = 30;
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
  });
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
