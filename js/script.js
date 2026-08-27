/**
 * STAR ART WORKS — INTERACTIVE LOGIC & SLIDER ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HERO SLIDER ENGINE
     ========================================================================== */
  const slides = document.querySelectorAll('.hero-slider-wrap .slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const sliderWrap = document.querySelector('.hero-slider-wrap');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval = null;

  function loadSlideImage(slide) {
    if (!slide || slide.style.backgroundImage) return;
    const src = slide.getAttribute('data-bg');
    if (src) slide.style.backgroundImage = 'url("' + src + '")';
  }

  function showSlide(index) {
    if (index >= totalSlides) currentSlide = 0;
    else if (index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;

    loadSlideImage(slides[currentSlide]);
    if (totalSlides > 1) {
      loadSlideImage(slides[(currentSlide + 1) % totalSlides]);
    }

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    if (totalSlides > 1) {
      slideInterval = setInterval(nextSlide, 5000);
    }
  }

  function stopAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    showSlide(0);
    startAutoSlide();

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        startAutoSlide();
      });
    });

    if (sliderWrap) {
      sliderWrap.addEventListener('mouseenter', stopAutoSlide);
      sliderWrap.addEventListener('mouseleave', startAutoSlide);

      let touchStartX = 0;
      let touchEndX = 0;

      sliderWrap.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderWrap.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
          nextSlide();
          startAutoSlide();
        } else if (touchEndX - touchStartX > 50) {
          prevSlide();
          startAutoSlide();
        }
      }, { passive: true });
    }
  }


  /* ==========================================================================
     2. FEATURED PROJECTS FILTERABLE GALLERY
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'block';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  /* ==========================================================================
     3. REVIEWS CAROUSEL
     ========================================================================== */
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewsLeft = document.getElementById('reviewsArrowLeft');
  const reviewsRight = document.getElementById('reviewsArrowRight');

  if (reviewsTrack && reviewsLeft && reviewsRight) {
    const getStep = () => {
      const card = reviewsTrack.querySelector('.review-card');
      const styles = window.getComputedStyle(reviewsTrack);
      const gap = parseFloat(styles.columnGap || styles.gap) || 24;
      return card ? card.getBoundingClientRect().width + gap : 320;
    };

    const updateArrows = () => {
      const maxScroll = reviewsTrack.scrollWidth - reviewsTrack.clientWidth;
      reviewsLeft.disabled = reviewsTrack.scrollLeft <= 4;
      reviewsRight.disabled = reviewsTrack.scrollLeft >= maxScroll - 4;
    };

    const scrollByCard = (direction) => {
      const next = reviewsTrack.scrollLeft + direction * getStep();
      if (typeof reviewsTrack.scrollTo === 'function') {
        reviewsTrack.scrollTo({ left: next, behavior: 'smooth' });
      } else {
        reviewsTrack.scrollLeft = next;
      }
      window.setTimeout(updateArrows, 400);
    };

    reviewsLeft.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollByCard(-1);
    });

    reviewsRight.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      scrollByCard(1);
    });

    reviewsTrack.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows, { passive: true });
    updateArrows();
  }


  /* ==========================================================================
     4. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherQ = other.querySelector('.faq-question');
        if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ==========================================================================
     5. HEADER SCROLL, BACK TO TOP & MOBILE MENU TOGGLE
     ========================================================================== */
  const header = document.querySelector('header');
  const menuToggle = document.getElementById('mobileToggle');
  const backToTopBtn = document.getElementById('backToTop');
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header?.classList.toggle('header-scrolled', y > 40);
      backToTopBtn?.classList.toggle('visible', y > 300);
      scrollTicking = false;
    });
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (menuToggle) {
    const topBar = document.querySelector('.top-bar');
    const headerEl = document.querySelector('header');
    const root = document.documentElement;

    const clearMobileMenuLayout = () => {
      root.classList.remove('mobile-menu-open');
      document.body.classList.remove('mobile-menu-open', 'mobile-menu-with-topbar');
      root.style.removeProperty('--mobile-chrome-top');
      root.style.removeProperty('--mobile-menu-top');
      root.style.removeProperty('--mobile-menu-max-height');
      document.body.style.removeProperty('padding-top');
    };

    const measureChrome = () => {
      const headerHeight = headerEl ? (headerEl.offsetHeight || 68) : 68;
      const topBarRect = topBar ? topBar.getBoundingClientRect() : null;
      const topBarVisible = !!(topBarRect && topBarRect.bottom > 1);
      const topBarHeight = topBarVisible ? Math.round(topBarRect.height) : 0;
      const chromeTop = topBarVisible ? topBarHeight : 0;
      const menuTop = chromeTop + headerHeight;
      const viewportH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      return { topBarVisible, chromeTop, menuTop, viewportH };
    };

    const applyMobileMenuLayout = () => {
      const { topBarVisible, chromeTop, menuTop, viewportH } = measureChrome();
      document.body.classList.toggle('mobile-menu-with-topbar', topBarVisible);
      root.style.setProperty('--mobile-chrome-top', chromeTop + 'px');
      root.style.setProperty('--mobile-menu-top', menuTop + 'px');
      root.style.setProperty('--mobile-menu-max-height', Math.max(180, Math.round(viewportH - menuTop)) + 'px');
      document.body.style.paddingTop = menuTop + 'px';
    };

    const closeMobileMenu = () => {
      if (!document.body.classList.contains('mobile-menu-open')) return;
      clearMobileMenuLayout();
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    const openMobileMenu = () => {
      const { topBarVisible, chromeTop, menuTop, viewportH } = measureChrome();

      root.style.setProperty('--mobile-chrome-top', chromeTop + 'px');
      root.style.setProperty('--mobile-menu-top', menuTop + 'px');
      root.style.setProperty('--mobile-menu-max-height', Math.max(180, Math.round(viewportH - menuTop)) + 'px');

      document.body.classList.toggle('mobile-menu-with-topbar', topBarVisible);
      root.classList.add('mobile-menu-open');
      document.body.classList.add('mobile-menu-open');
      document.body.style.paddingTop = menuTop + 'px';
      menuToggle.setAttribute('aria-expanded', 'true');
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.body.classList.contains('mobile-menu-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    document.querySelectorAll('#navMenu .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    document.addEventListener('click', (e) => {
      if (!document.body.classList.contains('mobile-menu-open')) return;
      if (headerEl && !headerEl.contains(e.target) && !(topBar && topBar.contains(e.target))) {
        closeMobileMenu();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    window.addEventListener('resize', () => {
      if (document.body.classList.contains('mobile-menu-open')) {
        applyMobileMenuLayout();
      }
    }, { passive: true });
  }


  /* ==========================================================================
     6. SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length && window.matchMedia('(min-width: 769px)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -12px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in-view'));
  }


  /* ==========================================================================
     7. DIRECT WHATSAPP ENQUIRY REDIRECT
     ========================================================================== */
  const consultForms = document.querySelectorAll('form');

  consultForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="name"], #contactName, input[placeholder*="Name"]');
      const phoneInput = form.querySelector('input[name="phone"], #contactPhone, input[type="tel"]');
      const locationInput = form.querySelector('input[name="location"], #contactLoc');
      const serviceSelect = form.querySelector('select');
      const messageInput = form.querySelector('textarea, input[name="message"], #contactMsg');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const location = locationInput ? locationInput.value.trim() : '';
      const service = serviceSelect ? serviceSelect.value : '';
      const message = messageInput ? messageInput.value.trim() : '';

      let text = `Hello Star Art Works,\n\nI would like to inquire about interior & civil contracting services.`;
      if (name) text += `\n- *Name:* ${name}`;
      if (phone) text += `\n- *Phone:* ${phone}`;
      if (location) text += `\n- *Location:* ${location}`;
      if (service) text += `\n- *Service:* ${service}`;
      if (message) text += `\n- *Requirements:* ${message}`;

      const waUrl = `https://wa.me/918318375165?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  });

});
