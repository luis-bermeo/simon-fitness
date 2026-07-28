/* ============================================
   SIMON FITNESS — Cinematic Interactive Engine
   Vanilla JS / Apple-Grade Animations / 60fps
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
  // 3. CINEMATIC SCROLL REVEAL — Advanced
  //    Intersection Observer with staggering
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Auto-inject reveal-element class to key elements
  function injectRevealClasses() {
    // Section headers
    document.querySelectorAll('.section-header').forEach(el => {
      el.classList.add('reveal-element');
    });

    // Service cards with stagger
    document.querySelectorAll('.service-card').forEach((el, i) => {
      el.classList.add('reveal-element');
      el.setAttribute('data-delay', String(i + 1));
    });

    // Advantage cards with stagger
    document.querySelectorAll('.advantage-card').forEach((el, i) => {
      el.classList.add('reveal-element');
      el.setAttribute('data-delay', String((i % 3) + 1));
    });

    // Testimonial cards with stagger
    document.querySelectorAll('.testimonial-card').forEach((el, i) => {
      el.classList.add('reveal-element');
      el.setAttribute('data-delay', String(i + 1));
    });

    // Hero elements
    const heroBadge = document.querySelector('.hero__badge');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    const heroActions = document.querySelector('.hero__actions');
    const heroStats = document.querySelector('.hero__stats');
    const heroVisual = document.querySelector('.hero__visual');

    if (heroBadge) { heroBadge.classList.add('reveal-element'); }
    if (heroSubtitle) { heroSubtitle.classList.add('reveal-element'); heroSubtitle.setAttribute('data-delay', '2'); }
    if (heroActions) { heroActions.classList.add('reveal-element'); heroActions.setAttribute('data-delay', '3'); }
    if (heroStats) { heroStats.classList.add('reveal-element'); heroStats.setAttribute('data-delay', '4'); }
    if (heroVisual) { heroVisual.classList.add('reveal-element'); heroVisual.setAttribute('data-delay', '2'); }

    // Brands section
    const brandsLabel = document.querySelector('.brands__label');
    const brandsGrid = document.querySelector('.brands__grid');
    if (brandsLabel) { brandsLabel.classList.add('reveal-element'); }
    if (brandsGrid) { brandsGrid.classList.add('reveal-element'); brandsGrid.setAttribute('data-delay', '1'); }

    // CTA section
    const ctaContent = document.querySelector('.cta-section__content');
    const ctaForm = document.querySelector('.contact-form');
    if (ctaContent) { ctaContent.classList.add('reveal-element'); }
    if (ctaForm) { ctaForm.classList.add('reveal-element'); ctaForm.setAttribute('data-delay', '2'); }
  }

  injectRevealClasses();

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create the cinematic observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Small delay for orchestrated feel
        requestAnimationFrame(() => {
          entry.target.classList.add('is-visible');
        });
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  });

  // Also keep legacy reveal observer for compatibility
  const legacyRevealElements = document.querySelectorAll('.reveal:not(.reveal-element)');
  const legacyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        legacyObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  if (!prefersReducedMotion) {
    document.querySelectorAll('.reveal-element').forEach(el => revealObserver.observe(el));
    legacyRevealElements.forEach(el => legacyObserver.observe(el));
  } else {
    // Instantly show all elements if reduced motion preferred
    document.querySelectorAll('.reveal-element').forEach(el => el.classList.add('is-visible'));
    legacyRevealElements.forEach(el => el.classList.add('revealed'));
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. HERO TITLE — Word-by-Word Cinematic
  //    Entry Animation (Apple-style)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initHeroWordAnimation() {
    const heroTitle = document.querySelector('.hero__title');
    if (!heroTitle || prefersReducedMotion) return;

    // Save the original HTML to preserve the <span> accent
    const originalHTML = heroTitle.innerHTML;

    // Parse into words while preserving the <span> tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML.trim();

    const fragment = document.createDocumentFragment();
    let wordIndex = 0;

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim() === '') {
            // Whitespace — just add a text node
            fragment.appendChild(document.createTextNode(word));
          } else {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;
            span.style.transitionDelay = `${wordIndex * 80 + 200}ms`;
            fragment.appendChild(span);
            wordIndex++;
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Clone the element (e.g. <span class="hero__title-accent">)
        const clone = node.cloneNode(false);
        // Process its children
        const innerFragment = document.createDocumentFragment();
        node.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            const words = child.textContent.split(/(\s+)/);
            words.forEach(word => {
              if (word.trim() === '') {
                innerFragment.appendChild(document.createTextNode(word));
              } else {
                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = word;
                span.style.transitionDelay = `${wordIndex * 80 + 200}ms`;
                innerFragment.appendChild(span);
                wordIndex++;
              }
            });
          }
        });
        clone.appendChild(innerFragment);
        fragment.appendChild(clone);
      }
    }

    tempDiv.childNodes.forEach(processNode);

    // Replace hero title content
    heroTitle.innerHTML = '';
    heroTitle.appendChild(fragment);

    // Trigger the animation after a short delay for the page to settle
    setTimeout(() => {
      heroTitle.querySelectorAll('.word').forEach(word => {
        word.classList.add('is-visible');
      });
    }, 300);
  }

  initHeroWordAnimation();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. SMOOTH SCROLL — Anchor navigation
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
  // 6. WHATSAPP FAB — Cinematic Entrance
  //    + Periodic Attention Ping (no bubble)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const whatsappFab = document.getElementById('whatsapp-fab');
  const whatsappBtn = document.getElementById('whatsapp-btn');

  // Cinematic entrance after 2 seconds
  setTimeout(() => {
    if (whatsappFab) {
      whatsappFab.classList.add('is-entered');
    }
  }, 2000);

  // Periodic attention ping every 5 seconds
  let pingInterval;
  function startPingCycle() {
    pingInterval = setInterval(() => {
      if (whatsappBtn && whatsappFab && whatsappFab.classList.contains('is-entered')) {
        whatsappBtn.classList.add('ping');
        setTimeout(() => {
          whatsappBtn.classList.remove('ping');
        }, 700);
      }
    }, 5000);
  }

  // Start pinging after the FAB has entered
  setTimeout(startPingCycle, 3000);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 7. CONTACT FORM — Premium Focus Animations
  //    with elevated labels & red glow flash
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const contactForm = document.getElementById('contact-form');
  const formInputs = contactForm ? contactForm.querySelectorAll('input, select, textarea') : [];

  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.contact-form__group').classList.add('focused');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.closest('.contact-form__group').classList.remove('focused');
      }
    });

    if (input.value) {
      input.closest('.contact-form__group').classList.add('focused');
    }
  });

  // Form submission handler (EmailJS-ready → gestion@simonfitness.com)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('.contact-form__submit');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // EmailJS integration — configure with your IDs:
      // Target email: gestion@simonfitness.com
      // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
      //   .then(() => { /* success */ })
      //   .catch(() => { /* error */ });

      // Simulated success (replace with EmailJS)
      setTimeout(() => {
        submitBtn.textContent = '✓ Mensaje Enviado';
        submitBtn.style.background = '#12B76A';
        submitBtn.style.boxShadow = '0 0 20px rgba(18, 183, 106, 0.3), 0 0 60px rgba(18, 183, 106, 0.15)';

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
  // 8. DYNAMIC YEAR — Footer copyright
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 9. COUNTER ANIMATION — Stats numbers
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
  // 10. ACTIVE NAV LINK — Highlight on scroll
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
