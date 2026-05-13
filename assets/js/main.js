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
  
  // View Toggle Logic (List vs Grid)
  const viewBtns = document.querySelectorAll('.view-btn');
  const projectsContainer = document.getElementById('projectsContainer');
  
  if (viewBtns.length > 0 && projectsContainer) {
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Don't do anything if it's already active
        if (btn.classList.contains('active')) return;
        
        // Remove active class from all
        viewBtns.forEach(b => b.classList.remove('active'));
        
        // Add to clicked
        btn.classList.add('active');
        
        // Determine intended view
        const viewType = btn.getAttribute('data-view');
        
        // Quick fade out
        projectsContainer.style.transition = 'opacity 0.2s ease-out';
        projectsContainer.style.opacity = '0';
        
        setTimeout(() => {
          // Swap classes
          projectsContainer.classList.remove('list-view', 'grid-view');
          projectsContainer.classList.add(`${viewType}-view`);
          
          // Fade back in
          projectsContainer.style.opacity = '1';
        }, 200);
      });
    });
  }
});
