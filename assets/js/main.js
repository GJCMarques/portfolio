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
    
    // Close dropdowns on scroll for better UX
    window.addEventListener('scroll', () => {
      customDropdowns.forEach(dropdown => {
        if (dropdown.classList.contains('open')) {
          dropdown.classList.remove('open');
        }
      });
    }, { passive: true });
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
  
  // Projects Filtering Logic
  if (projectsContainer && customDropdowns.length > 0) {
    const filters = {
      type: 'all',
      service: 'all',
      industry: 'all'
    };

    const projectItems = projectsContainer.querySelectorAll('.dir-project-item');

    customDropdowns.forEach(dropdown => {
      const group = dropdown.getAttribute('data-filter-group');
      const label = dropdown.querySelector('.dropdown-label');
      const items = dropdown.querySelectorAll('.dropdown-item');

      items.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // Update active class
          items.forEach(i => i.classList.remove('active'));
          item.classList.add('active');
          
          // Update label text based on group
          const valText = item.textContent;
          const groupLabels = {
            type: 'Tipo',
            service: 'Serviços',
            industry: 'Indústria'
          };
          
          // Only update prefix if it exists in our mapping
          if(groupLabels[group]) {
             label.textContent = `${groupLabels[group]}: ${valText}`;
          }
          
          // Update filter state
          filters[group] = item.getAttribute('data-value');
          
          // Close dropdown
          dropdown.classList.remove('open');
          
          // Apply filters
          applyFilters();
        });
      });
    });

    function applyFilters() {
      // Fade out for transition effect
      projectsContainer.style.transition = 'opacity 0.2s ease-out';
      projectsContainer.style.opacity = '0';
      
      setTimeout(() => {
        let visibleCount = 0;
        
        projectItems.forEach(card => {
          // Get all tags text in lowercase
          const tags = Array.from(card.querySelectorAll('.dir-tag')).map(t => t.textContent.toLowerCase().trim());
          
          // Check Type
          let typeMatch = true;
          if (filters.type === 'real' && !tags.includes('caso real')) typeMatch = false;
          if (filters.type === 'pessoal' && !tags.includes('pessoal')) typeMatch = false;
          
          // Check Service
          let serviceMatch = true;
          if (filters.service === 'design' && !tags.includes('design')) serviceMatch = false;
          if (filters.service === 'frontend' && !tags.includes('frontend') && !tags.includes('front end')) serviceMatch = false;
          if (filters.service === 'fullstack' && !tags.includes('full stack')) serviceMatch = false;
          
          // Check Industry
          let industryMatch = true;
          if (filters.industry === 'financa' && !tags.includes('finança')) industryMatch = false;
          if (filters.industry === 'imobiliario' && !tags.includes('imobiliário')) industryMatch = false;
          if (filters.industry === 'moda' && !tags.includes('moda & loja')) industryMatch = false;
          if (filters.industry === 'agencia' && !tags.includes('agência')) industryMatch = false;
          
          // If all active filters match, show card
          if (typeMatch && serviceMatch && industryMatch) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });
        
        // Update header count if it exists
        const countDisplay = document.querySelector('.filter-left .count');
        if(countDisplay) {
          // Format as (N)
          countDisplay.textContent = `(${visibleCount})`;
        }
        
        // Fade back in
        projectsContainer.style.opacity = '1';
      }, 200);
    }
  }
});
