/* ==========================================================================
   CS ASESORÍA — Main JavaScript (Enhanced Interactive Behaviors)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. Navbar Scroll Effect ───
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── 2. Mobile Menu Toggle ───
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking link
    document.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
      }
    });
  }

  // ─── 3. Active Nav Link on Scroll ───
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ─── 4. Smooth Scrolling for Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.offsetTop - navHeight;
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── 5. Scroll Reveal Animations ───
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ─── 6. Metric Numbers Counter Animation ───
  const metricValues = document.querySelectorAll('.metric-item__value');
  let metricsAnimated = false;

  const animateMetrics = () => {
    metricValues.forEach(item => {
      const text = item.textContent.trim();
      
      // Match pattern like "+15", "99.8%", "+250", "< 24h"
      if (text.includes('+15')) {
        counterRoll(item, 0, 15, '+', '', 1500);
      } else if (text.includes('99.8%')) {
        counterRollDecimal(item, 80, 99.8, '', '%', 1800);
      } else if (text.includes('+250')) {
        counterRoll(item, 50, 250, '+', '', 1800);
      } else if (text.includes('24h')) {
        counterRoll(item, 48, 24, '< ', 'h', 1400, true);
      }
    });
  };

  function counterRoll(el, start, end, prefix, suffix, duration, countdown = false) {
    const range = Math.abs(end - start);
    const stepTime = Math.max(Math.floor(duration / range), 20);
    let current = start;

    const timer = setInterval(() => {
      if (countdown) {
        current -= 1;
        if (current <= end) {
          current = end;
          clearInterval(timer);
        }
      } else {
        current += Math.ceil(range / (duration / stepTime));
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
      }
      el.textContent = `${prefix}${current}${suffix}`;
    }, stepTime);
  }

  function counterRollDecimal(el, start, end, prefix, suffix, duration) {
    const steps = 40;
    const stepTime = duration / steps;
    let current = start;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      el.textContent = `${prefix}${current.toFixed(1)}${suffix}`;
    }, stepTime);
  }

  const metricsSection = document.querySelector('.section-metrics');
  if (metricsSection) {
    const metricsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metricsAnimated) {
          metricsAnimated = true;
          animateMetrics();
          metricsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    metricsObserver.observe(metricsSection);
  }

  // ─── 7. Hero Quick Form Redirect to Contact Form ───
  const heroQuickForm = document.getElementById('heroQuickForm');
  if (heroQuickForm) {
    heroQuickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = heroQuickForm.querySelector('input[type="email"]');
      const emailVal = input ? input.value : '';
      
      const targetEmailField = document.getElementById('email');
      if (targetEmailField && emailVal) {
        targetEmailField.value = emailVal;
      }

      // Scroll to contact form smoothly
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        const navHeight = navbar ? navbar.offsetHeight : 0;
        window.scrollTo({
          top: contactSection.offsetTop - navHeight,
          behavior: 'smooth'
        });

        // Highlight input
        if (targetEmailField) {
          setTimeout(() => {
            targetEmailField.focus();
          }, 800);
        }
      }
    });
  }

  // ─── 8. Showcase Video / Presentation Modal ───
  const openVideoBtn = document.getElementById('openVideoModal');
  const videoModal = document.getElementById('videoModal');
  const closeVideoBtn = document.getElementById('closeVideoModal');
  const modalCta = document.getElementById('modalCta');

  if (openVideoBtn && videoModal && closeVideoBtn) {
    openVideoBtn.addEventListener('click', () => {
      videoModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
      videoModal.classList.remove('open');
      document.body.style.overflow = '';
    };

    closeVideoBtn.addEventListener('click', closeModal);
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeModal();
    });

    if (modalCta) {
      modalCta.addEventListener('click', closeModal);
    }
  }

  // ─── 9. Contact Form Submission Handler ───
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submitBtn');
      const originalText = submitBtn.innerHTML;

      // Loading state
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10"/>
        </svg>
        Enviando solicitud...
      `;
      submitBtn.disabled = true;

      setTimeout(() => {
        if (formMessage) {
          formMessage.textContent = '¡Gracias por tu mensaje! Carmen revisará tu caso y te responderá en menos de 24 horas.';
          formMessage.className = 'form-message success';
        }
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        setTimeout(() => {
          if (formMessage) formMessage.className = 'form-message';
        }, 6000);
      }, 1200);
    });
  }

  // ─── 10. Keyframes Helper for Button Spin ───
  if (!document.getElementById('spinStyle')) {
    const style = document.createElement('style');
    style.id = 'spinStyle';
    style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
  }

});
