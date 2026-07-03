/* ============================================
   SIMON FITNESS — Interactive JavaScript
   Vanilla JS / No Frameworks
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. SMART NAVBAR — Hide on scroll down,
  //    show with glass effect on scroll up
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNavbar() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 60) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      navbar.classList.add('navbar--hidden');
    } else {
      navbar.classList.remove('navbar--hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. HAMBURGER MENU — Mobile responsive
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('.navbar__mobile-link');

  function toggleMenu() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      toggleMenu();
    }
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. SCROLL REVEAL — Intersection Observer
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. SMOOTH SCROLL — Anchor navigation
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. WHATSAPP FAB — Animated bubble
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const whatsappBubble = document.getElementById('whatsapp-bubble');

  // Show bubble after 4 seconds
  setTimeout(() => {
    if (whatsappBubble) {
      whatsappBubble.style.display = 'block';
    }
  }, 4000);

  // Periodically show the bubble on mobile
  let bubbleInterval;
  function startBubbleCycle() {
    if (window.innerWidth <= 768) {
      bubbleInterval = setInterval(() => {
        if (whatsappBubble) {
          whatsappBubble.style.display = 'block';
          whatsappBubble.style.animation = 'none';
          void whatsappBubble.offsetHeight; // Trigger reflow
          whatsappBubble.style.animation = 'bubble-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

          setTimeout(() => {
            whatsappBubble.style.display = 'none';
          }, 6000);
        }
      }, 15000);
    }
  }

  startBubbleCycle();

  window.addEventListener('resize', () => {
    clearInterval(bubbleInterval);
    startBubbleCycle();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. CONTACT FORM — Focus animations &
  //    EmailJS-ready setup
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const contactForm = document.getElementById('contact-form');
  const formInputs = contactForm ? contactForm.querySelectorAll('input, select, textarea') : [];

  formInputs.forEach(input => {
    // Add floating label effect
    input.addEventListener('focus', () => {
      input.closest('.contact-form__group').classList.add('focused');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.closest('.contact-form__group').classList.remove('focused');
      }
    });

    // Check for pre-filled values
    if (input.value) {
      input.closest('.contact-form__group').classList.add('focused');
    }
  });

  // Form submission handler (EmailJS-ready)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.contact-form__submit');
      const originalText = submitBtn.textContent;

      // Visual feedback
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // EmailJS integration point
      // Uncomment and configure when EmailJS is set up:
      // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
      //   .then(() => { ... })
      //   .catch(() => { ... });

      // Simulated success (replace with EmailJS)
      setTimeout(() => {
        submitBtn.textContent = '✓ Mensaje Enviado';
        submitBtn.style.background = '#12B76A';
        submitBtn.style.boxShadow = '0 4px 14px rgba(18, 183, 106, 0.3)';

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.background = '';
          submitBtn.style.boxShadow = '';
          contactForm.reset();
          formInputs.forEach(input => {
            input.closest('.contact-form__group').classList.remove('focused');
          });
        }, 3000);
      }, 1500);
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 7. DYNAMIC YEAR — Footer copyright
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 8. COUNTER ANIMATION — Stats numbers
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const statNumbers = document.querySelectorAll('.hero__stat-number[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easeOut * target);

      el.textContent = current.toLocaleString('es-ES') + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    }

    requestAnimationFrame(updateCount);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 9. ACTIVE NAV LINK — Highlight on scroll
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

});
