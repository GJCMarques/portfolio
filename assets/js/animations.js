/* assets/js/animations.js */

document.addEventListener('DOMContentLoaded', () => {
  const fadeElements = document.querySelectorAll('.fade-up');
  
  const fadeObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optional: stop observing once visible
        observer.unobserve(entry.target);
      }
    });
  }, fadeObserverOptions);
  
  fadeElements.forEach(el => {
    fadeObserver.observe(el);
  });
  
  // Stagger indices for container children
  const staggerContainers = document.querySelectorAll('.stagger-container');
  staggerContainers.forEach(container => {
    const children = container.querySelectorAll('.fade-up');
    children.forEach((child, index) => {
      child.style.setProperty('--stagger-index', index);
    });
  });
});
