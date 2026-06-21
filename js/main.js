// ===== NAVBAR HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// ===== SMOOTH ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => navObserver.observe(section));

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.layanan-card, .slide, .harga-card, .team-card, .stat');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

// ===== FORM SUBMIT =====
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = '✓ Pesan Terkirim!';
  btn.style.background = '#10B981';
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

// ===== STICKY NAVBAR SHADOW =====
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// ===== MOBILE NAV LINKS STYLES =====
const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
  @media (max-width: 768px) {
    .nav-links.open {
      display: flex !important;
      flex-direction: column;
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      background: white;
      border-bottom: 1px solid #E5E7EB;
      padding: 12px 24px 16px;
      gap: 4px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      z-index: 99;
    }
  }
`;
document.head.appendChild(mobileStyle);

// ===== PORTOFOLIO SLIDER =====
(function initSlider() {
  const track = document.getElementById('sliderTrack');
  const viewport = document.getElementById('sliderViewport');
  const btnPrev = document.getElementById('sliderPrev');
  const btnNext = document.getElementById('sliderNext');
  const dotsWrap = document.getElementById('sliderDots');

  if (!track || !viewport || !btnPrev || !btnNext) return;

  const slides = Array.from(track.querySelectorAll('.slide'));
  const GAP = 24; // px — matches CSS gap
  let currentIndex = 0;
  let autoTimer;

  // Responsive: how many slides visible?
  function visibleCount() {
    const w = viewport.clientWidth;
    if (w < 500) return 1;
    if (w < 860) return 2;
    return 3;
  }

  // Slide width calculation
  function slideWidth() {
    const count = visibleCount();
    const totalGap = GAP * (count - 1);
    return (viewport.clientWidth - totalGap) / count;
  }

  // Apply widths to all slides
  function applyWidths() {
    const w = slideWidth();
    slides.forEach(s => {
      s.style.width = w + 'px';
      s.style.flexShrink = '0';
    });
  }

  // Max index
  function maxIndex() {
    return Math.max(0, slides.length - visibleCount());
  }

  // Translate track
  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));
    const offset = currentIndex * (slideWidth() + GAP);
    track.style.transform = `translateX(-${offset}px)`;
    updateButtons();
    updateDots();
  }

  // Button states
  function updateButtons() {
    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex >= maxIndex();
  }

  // Build dots
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => { 
        goTo(i); 
        resetAuto(); 
      });
      dotsWrap.appendChild(dot);
    }
  }

  // Update dots
  function updateDots() {
    if (!dotsWrap) return;
    const dots = dotsWrap.querySelectorAll('.dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  // Auto-play (every 4 seconds)
  function startAuto() {
    autoTimer = setInterval(() => {
      if (currentIndex >= maxIndex()) goTo(0);
      else goTo(currentIndex + 1);
    }, 4000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // Button events
  btnPrev.addEventListener('click', () => { 
    goTo(currentIndex - 1); 
    resetAuto(); 
  });
  
  btnNext.addEventListener('click', () => { 
    goTo(currentIndex + 1); 
    resetAuto(); 
  });

  // Touch / swipe support
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  
  viewport.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
      resetAuto();
    }
  }, { passive: true });

  // Keyboard support
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { 
      goTo(currentIndex - 1); 
      resetAuto(); 
    }
    if (e.key === 'ArrowRight') { 
      goTo(currentIndex + 1); 
      resetAuto(); 
    }
  });

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      applyWidths();
      buildDots();
      goTo(Math.min(currentIndex, maxIndex()));
    }, 150);
  });

  // Initialize slider
  applyWidths();
  buildDots();
  goTo(0);
  startAuto();
})();

// ===== PROMOTION SLIDER (AUTO SLIDE LEFT) =====
(function initPromoSlider() {
  const track = document.getElementById('promoTrack');
  const dotsWrap = document.getElementById('promoDots');
  
  if (!track || !dotsWrap) return;
  
  const slides = Array.from(track.querySelectorAll('.promo-slide'));
  let currentIndex = 0;
  let autoTimer;
  let slideWidth = 0;
  
  // Update slide width based on container
  function updateSlideWidth() {
    const container = track.parentElement;
    slideWidth = container.clientWidth;
    slides.forEach(slide => {
      slide.style.width = slideWidth + 'px';
    });
  }
  
  // Go to specific slide
  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    updateDots();
  }
  
  // Next slide
  function nextSlide() {
    goTo(currentIndex + 1);
  }
  
  // Previous slide
  function prevSlide() {
    goTo(currentIndex - 1);
  }
  
  // Update dots indicator
  function updateDots() {
    const dots = dotsWrap.querySelectorAll('.promo-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }
  
  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('button');
      dot.className = 'promo-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Promo Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goTo(i);
        resetAuto();
      });
      dotsWrap.appendChild(dot);
    }
  }
  
  // Start auto-play (every 5 seconds)
  function startAuto() {
    autoTimer = setInterval(() => {
      nextSlide();
    }, 5000);
  }
  
  // Reset auto-play timer
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }
  
  // Initialize
  updateSlideWidth();
  buildDots();
  goTo(0);
  startAuto();
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSlideWidth();
      goTo(currentIndex);
    }, 150);
  });
  
  // Touch support for mobile
  let touchStartX = 0;
  const container = track.parentElement;
  
  container.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  
  container.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      resetAuto();
    }
  }, { passive: true });
  
  // Optional: Add hover pause for desktop
  container.addEventListener('mouseenter', () => {
    clearInterval(autoTimer);
  });
  
  container.addEventListener('mouseleave', () => {
    startAuto();
  });
})();

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Close mobile menu if open
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    }
  });
});

// ===== BACK TO TOP BUTTON (Optional) =====
// Create back to top button if it doesn't exist
let backToTop = document.querySelector('.back-to-top');

if (!backToTop) {
  backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '↑';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--blue, #1A6BFF);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    z-index: 99;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
  `;
  document.body.appendChild(backToTop);
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Show/hide back to top button
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.style.display = 'flex';
  } else {
    backToTop.style.display = 'none';
  }
});

// ===== LOADING ANIMATION (Optional) =====
// Add loading class to body initially
document.body.classList.add('loading');

window.addEventListener('load', () => {
  document.body.classList.remove('loading');
  
  // Add loaded class for any initial animations
  document.body.classList.add('loaded');
  
  // Trigger any additional initialization
  console.log('Website loaded successfully!');
});

// ===== FIX FOR IOS VH BUG =====
function setVH() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVH);
setVH();

// ===== LAZY LOAD IMAGES (if any) =====
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      observer.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ===== PREVENT DOUBLE SUBMIT ON FORMS =====
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  let submitted = false;
  form.addEventListener('submit', (e) => {
    if (submitted) {
      e.preventDefault();
      return false;
    }
    submitted = true;
    setTimeout(() => {
      submitted = false;
    }, 3000);
  });
});

// ===== ADD ACTIVE CLASS TO NAV ON SCROLL WITH OFFSET =====
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        const currentId = section.getAttribute('id');
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, 50);
});

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.handleSubmit = handleSubmit;
window.initSlider = initSlider;
window.initPromoSlider = initPromoSlider;

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c🚀 WebPro - Jasa Pembuatan Website Profesional', 'color: #1A6BFF; font-size: 16px; font-weight: bold;');
console.log('%cWebsite siap digunakan!', 'color: #10B981; font-size: 12px;');