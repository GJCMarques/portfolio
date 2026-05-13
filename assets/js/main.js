/* assets/js/main.js */
// Main scripts like mobile menu

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if(menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('is-open');
    });
  }
  
  // Custom Dropdown Logic
  const customDropdowns = document.querySelectorAll('.custom-dropdown');
  
  if (customDropdowns.length > 0) {
    customDropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          // Prevent body click from firing
          e.stopPropagation(); 
          
          // Close any other open dropdowns
          customDropdowns.forEach(d => {
            if (d !== dropdown) d.classList.remove('open');
          });
          
          // Toggle current
          dropdown.classList.toggle('open');
        });
      }
    });
    
    // Close dropdowns when clicking anywhere outside
    document.addEventListener('click', (e) => {
      customDropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
        }
      });
    });
  }
});
