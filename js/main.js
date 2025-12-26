// ===== DORACHANN PORTFOLIO - MAIN JS =====
// Bridging Vietnamese tradition with digital art

// ===== PAGE LOADER =====
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.page-loader');
  
  // Hide loader after page is fully loaded
  window.addEventListener('load', () => {
    if (loader) {
      setTimeout(() => {
        loader.classList.add('loaded');
      }, 300);
    }
  });
  
  // Page transition on link click
  initPageTransition(loader);
  
  // Initialize all animations and features
  initNavigation();
  initLanguageToggle();
  initScrollReveal();
  initParallax();
  initSmoothScroll();
  initActiveNavLink();
  initCustomCursor();
  
  // Console welcome message
  console.log('%c🐉 Welcome to DoraChann Portfolio! 🐉', 'font-size: 20px; color: #fd5594; font-weight: bold;');
  console.log('%cBridging Vietnamese tradition with digital art', 'font-size: 14px; color: #9B4DCA;');
  console.log('%c💡 Tip: Click the flower on the right to switch languages!', 'font-size: 12px; color: #ADFF2F;');
});

// ===== PAGE TRANSITION =====
function initPageTransition(loader) {
  // Add transition effect when navigating to internal links
  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    
    // Only apply to internal links (not external, not anchors, not javascript)
    if (href && 
        !href.startsWith('http') && 
        !href.startsWith('#') && 
        !href.startsWith('mailto:') && 
        !href.startsWith('tel:') &&
        !href.startsWith('javascript:')) {
      
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Show loader with transition
        if (loader) {
          loader.classList.remove('loaded');
          loader.classList.add('transitioning');
        }
        
        // Navigate after short delay for smooth transition
        setTimeout(() => {
          window.location.href = href;
        }, 250);
      });
    }
  });
}


// ===== NAVIGATION =====
function initNavigation() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  // Toggle mobile menu
  hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header?.classList.add('header--scrolled');
    } else {
      header?.classList.remove('header--scrolled');
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
      navMenu?.classList.remove('active');
      hamburger?.classList.remove('active');
    }
  });
}


// ===== LANGUAGE TOGGLE =====
function initLanguageToggle() {
  const langToggle = document.getElementById('langToggle');
  let currentLang = localStorage.getItem('preferredLang') || 'vi';

  // Load saved language preference on init
  if (currentLang !== 'vi') {
    updateLanguage(currentLang);
  }

  langToggle?.addEventListener('click', () => {
    currentLang = currentLang === 'vi' ? 'en' : 'vi';
    updateLanguage(currentLang);
    
    // Add visual feedback - rotate flower
    langToggle.style.transform = 'translateY(-50%) rotate(360deg) scale(1.2)';
    setTimeout(() => {
      langToggle.style.transform = 'translateY(-50%)';
    }, 500);
    
    // Save preference
    localStorage.setItem('preferredLang', currentLang);
    console.log(`🌐 Language switched to: ${currentLang === 'vi' ? 'Vietnamese' : 'English'}`);
  });

  function updateLanguage(lang) {
    const elements = document.querySelectorAll('[data-vi][data-en]');
    elements.forEach(el => {
      el.textContent = lang === 'vi' ? el.dataset.vi : el.dataset.en;
    });
    
    if (langToggle) {
      langToggle.title = lang === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt';
    }
  }
}


// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
  // Create Intersection Observer for reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Optional: unobserve after revealing (for performance)
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  });

  // Observe all elements with reveal classes
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  revealElements.forEach(el => revealObserver.observe(el));

  // Auto-add reveal classes to common elements if not already present
  const autoRevealSelectors = [
    '.philosophy__content',
    '.philosophy__dragon',
    '.gallery-preview__project',
    '.gallery__item',
    '.project__description',
    '.project__tools',
    '.project__storyboard',
    '.project__cta',
    '.about-hero__content',
    '.about-me__content',
    '.about-contact'
  ];

  autoRevealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (!el.classList.contains('reveal') && 
          !el.classList.contains('reveal-left') && 
          !el.classList.contains('reveal-right')) {
        el.classList.add('reveal');
        el.classList.add(`stagger-${Math.min(index + 1, 6)}`);
        revealObserver.observe(el);
      }
    });
  });

  // Add stagger effect to gallery items
  document.querySelectorAll('.gallery-preview__project').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.15}s`;
  });
}


// ===== PARALLAX EFFECTS =====
function initParallax() {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  });

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;

    // Hero lotus parallax
    document.querySelectorAll('.hero__lotus').forEach((lotus, index) => {
      const speed = 0.15 + (index * 0.05);
      lotus.style.transform = `translateY(${scrolled * speed}px)`;
    });

    // Dragon parallax with boundary check
    const dragon = document.querySelector('.philosophy__dragon');
    if (dragon) {
      const section = document.querySelector('.philosophy');
      const rect = section?.getBoundingClientRect();
      if (rect && rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        dragon.style.transform = `translateY(${progress * 30}px)`;
      }
    }

    // Lanterns - FIXED, no parallax
    // Removed parallax effect to keep lanterns stationary

    // Parallax for elements with parallax classes
    document.querySelectorAll('.parallax-slow').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        el.style.transform = `translateY(${progress * 20}px)`;
      }
    });

    document.querySelectorAll('.parallax-medium').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        el.style.transform = `translateY(${progress * 40}px)`;
      }
    });

    document.querySelectorAll('.parallax-fast').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        el.style.transform = `translateY(${progress * 60}px)`;
      }
    });
  }
}


// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return; // Skip empty anchors
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}


// ===== ACTIVE NAVIGATION LINK =====
function initActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    const linkPage = href?.split('/').pop();
    
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });
}


// ===== CUSTOM CURSOR EFFECT =====
function initCustomCursor() {
  // Don't init on touch devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return;
  }

  // Create cursor elements
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover effect on interactive elements
  const hoverElements = document.querySelectorAll('a, button, .gallery-preview__project, .gallery__item, .project__tool');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor--hover'));
  });

  // Click effect
  document.addEventListener('mousedown', () => cursor.classList.add('cursor--click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('cursor--click'));

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '0.6';
  });

  // Animate cursor
  function animateCursor() {
    // Main cursor follows with slight delay
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    // Dot follows with more delay for trail effect
    dotX += (mouseX - dotX) * 0.08;
    dotY += (mouseY - dotY) * 0.08;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}


// ===== TEXT TYPING EFFECT =====
function typeText(element, text, speed = 50) {
  let index = 0;
  element.textContent = '';
  
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }
  
  type();
}


// ===== IMAGE LAZY LOADING WITH FADE =====
function initLazyImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));
}


// ===== HOVER SOUND EFFECTS (Optional) =====
function initHoverSounds() {
  const hoverSound = new Audio('/assets/sounds/hover.mp3');
  const clickSound = new Audio('/assets/sounds/click.mp3');
  
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      hoverSound.currentTime = 0;
      hoverSound.volume = 0.1;
      hoverSound.play().catch(() => {});
    });
    
    el.addEventListener('click', () => {
      clickSound.currentTime = 0;
      clickSound.volume = 0.2;
      clickSound.play().catch(() => {});
    });
  });
}


// ===== BACK BUTTON FUNCTIONALITY =====
document.querySelector('.back-button')?.addEventListener('click', () => {
  window.history.back();
});


// ===== GALLERY SLIDER =====
function initGallerySlider() {
  const slides = document.querySelectorAll('.gallery-preview__slide');
  const prevBtn = document.querySelector('.gallery-preview__arrow--prev');
  const nextBtn = document.querySelector('.gallery-preview__arrow--next');
  
  if (!slides.length || !prevBtn || !nextBtn) return;
  
  let currentIndex = 1; // Start with middle slide active
  
  function showSlide(index) {
    // Handle wrap around
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentIndex = index;
    
    slides.forEach((slide, i) => {
      slide.classList.remove('gallery-preview__slide--active');
      if (i === currentIndex) {
        slide.classList.add('gallery-preview__slide--active');
      }
    });
  }
  
  prevBtn.addEventListener('click', () => {
    showSlide(currentIndex - 1);
  });
  
  nextBtn.addEventListener('click', () => {
    showSlide(currentIndex + 1);
  });
  
  // Auto-slide every 5 seconds
  setInterval(() => {
    showSlide(currentIndex + 1);
  }, 5000);
}

// Initialize slider when DOM is ready
document.addEventListener('DOMContentLoaded', initGallerySlider);
