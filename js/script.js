/**
 * STAR ART WORKS — INTERACTIVE LOGIC & LIVSPACE SLIDER ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HERO SLIDER ENGINE (LIVSPACE CAROUSEL)
     ========================================================================== */
  const slides = document.querySelectorAll('.hero-slider-wrap .slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const sliderWrap = document.querySelector('.hero-slider-wrap');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval = null;

  function showSlide(index) {
    if (index >= totalSlides) currentSlide = 0;
    else if (index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;

    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
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
    slideInterval = setInterval(nextSlide, 5000);
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

      // Touch swipe support
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
     2. INTERACTIVE RENOVATION COST ESTIMATOR
     ========================================================================== */
  const estTypeBtns = document.querySelectorAll('.est-btn[data-bhk]');
  const estCheckboxes = document.querySelectorAll('.est-checkbox-card input');
  const priceDisplay = document.getElementById('priceDisplay');
  const estBhkLabel = document.getElementById('estBhkLabel');
  const estItemsList = document.getElementById('estItemsList');

  let selectedBHK = '2bhk';
  const basePrices = {
    '1bhk': { min: 2.2, max: 3.8, title: '1 BHK Apartment' },
    '2bhk': { min: 3.5, max: 5.8, title: '2 BHK Apartment' },
    '3bhk': { min: 5.2, max: 8.5, title: '3 BHK Apartment' },
    'kitchen': { min: 1.2, max: 2.2, title: 'Modular Kitchen Only' }
  };

  const featureAddons = {
    'ceiling': { min: 0.4, max: 0.8, name: 'Gypsum POP Ceiling & Lights' },
    'kitchen': { min: 1.1, max: 2.0, name: 'Acrylic Modular Kitchen' },
    'wardrobes': { min: 0.8, max: 1.5, name: 'Custom Wardrobes & Storage' },
    'electrical': { min: 0.3, max: 0.6, name: 'Full Electrical & Plumbing' },
    'painting': { min: 0.3, max: 0.7, name: 'Interior & Exterior Painting' }
  };

  function updateEstimator() {
    if (!priceDisplay) return;

    let base = basePrices[selectedBHK] || basePrices['2bhk'];
    let totalMin = base.min;
    let totalMax = base.max;
    let selectedAddons = [];

    estCheckboxes.forEach(cb => {
      const card = cb.closest('.est-checkbox-card');
      if (cb.checked) {
        if (card) card.classList.add('active');
        const addonKey = cb.value;
        if (featureAddons[addonKey]) {
          totalMin += featureAddons[addonKey].min;
          totalMax += featureAddons[addonKey].max;
          selectedAddons.push(featureAddons[addonKey].name);
        }
      } else {
        if (card) card.classList.remove('active');
      }
    });

    priceDisplay.textContent = `Approx. ₹${totalMin.toFixed(1)}L - ₹${totalMax.toFixed(1)}L`;
    if (estBhkLabel) estBhkLabel.textContent = base.title;

    if (estItemsList) {
      estItemsList.innerHTML = `
        <li><span>Base Package</span><strong>Included</strong></li>
        ${selectedAddons.map(name => `<li><span>${name}</span><strong>Included</strong></li>`).join('')}
      `;
    }
  }

  estTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      estTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedBHK = btn.getAttribute('data-bhk');
      updateEstimator();
    });
  });

  estCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateEstimator);
  });

  updateEstimator();


  /* ==========================================================================
     3. FEATURED PROJECTS FILTERABLE GALLERY
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
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
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
     4. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close other items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            const otherAns = other.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = '0px';
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          answer.style.maxHeight = '0px';
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });


  /* ==========================================================================
     5. HEADER SCROLL, BACK TO TOP & MOBILE MENU TOGGLE
     ========================================================================== */
  const header = document.querySelector('header');
  const menuToggle = document.getElementById('mobileToggle');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('header-scrolled');
    } else {
      header?.classList.remove('header-scrolled');
    }

    if (window.scrollY > 300) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.body.classList.toggle('mobile-menu-open');
    });
  }


  /* ==========================================================================
     6. SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ==========================================================================
     7. DIRECT WHATSAPP ENQUIRY REDIRECT
     ========================================================================== */
  const consultForms = document.querySelectorAll('form');

  consultForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('input[name="name"], input[placeholder*="Name"], input[type="text"]');
      const phoneInput = form.querySelector('input[name="phone"], input[type="tel"]');
      const serviceSelect = form.querySelector('select');
      const messageInput = form.querySelector('textarea, input[name="message"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const service = serviceSelect ? serviceSelect.value : '';
      const message = messageInput ? messageInput.value.trim() : '';

      let text = `Hello Star Art Works,\n\nI would like to inquire about interior & civil contracting services.`;
      if (name) text += `\n- *Name:* ${name}`;
      if (phone) text += `\n- *Phone:* ${phone}`;
      if (service) text += `\n- *Service:* ${service}`;
      if (message) text += `\n- *Requirements:* ${message}`;

      const waUrl = `https://wa.me/917738406563?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  });

});