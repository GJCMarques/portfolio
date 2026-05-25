/* assets/js/animations.js */

// 1. Force manual scroll restoration to prevent browser jumping
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

// 2. Immediate reset
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  // 3. Reset when DOM is ready
  window.scrollTo(0, 0);

  // Observe all entry animations
  const fadeElements = document.querySelectorAll('.fade-up, .slide-right, .zoom-in, .pop-up, .fade-in, .hero-fade-up');
  
  const fadeObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // Remove inline transition delay after entry animation finishes
        // This prevents hover animations (like scaling/colors) from lagging
        setTimeout(() => {
          if (entry.target.style.transitionDelay) {
            entry.target.style.transitionDelay = '0s';
          }
        }, 800);
        
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
