/* assets/js/animations.js */

// 1. Force manual scroll restoration to prevent browser jumping
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

// 2. Immediate reset
window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

document.addEventListener('DOMContentLoaded', () => {
  // 3. Reset when DOM is ready
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  // Observe all entry animations
  const allFadeElements = document.querySelectorAll('.fade-up, .slide-right, .zoom-in, .pop-up, .fade-in, .hero-fade-up');
  
  // Exclude hero elements from IntersectionObserver IF the preloader is active.
  // The preloader script will manually trigger these when the loading finishes.
  let fadeElements = Array.from(allFadeElements);
  if (document.getElementById('home-preloader')) {
    const heroSelectors = '.split-hero-container, .hero-text-wrapper, .bottom-nav, .floating-card-wrapper';
    fadeElements = fadeElements.filter(el => !el.matches(heroSelectors));
  }
  
  const fadeObserverOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0
  };
  
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Remove inline and CSS variable transition delays after entry animation finishes
        // This prevents hover animations (like scaling/colors) from lagging
        setTimeout(() => {
          entry.target.style.transitionDelay = '0s';
        }, 1500);
        
        observer.unobserve(entry.target);
      }
    });
  }, fadeObserverOptions);
  
  fadeElements.forEach(el => {
    fadeObserver.observe(el);
  });
  
  // Stagger Logic
  const staggerContainers = document.querySelectorAll('.stagger-container');
  staggerContainers.forEach(container => {
    const children = container.querySelectorAll('.fade-up');
    children.forEach((child, index) => {
      child.style.setProperty('--stagger-index', index);
    });
  });
});

// 4. Final reset when everything (images/videos) is fully loaded
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});
