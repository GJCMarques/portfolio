/* assets/js/main.js */
// Main scripts like mobile menu

window.reinitMain = function() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if(menuToggle && mainNav) {
    // Clean up old listeners by cloning
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    newMenuToggle.addEventListener('click', () => {
      const isExpanded = newMenuToggle.getAttribute('aria-expanded') === 'true';
      newMenuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('is-open');
    });
  }
  
  // Custom Dropdown Logic
  const customDropdowns = document.querySelectorAll('.custom-dropdown');
  
  if (customDropdowns.length > 0) {
    customDropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      if (trigger) {
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        newTrigger.addEventListener('click', (e) => {
          e.stopPropagation(); 
          customDropdowns.forEach(d => {
            if (d !== dropdown) d.classList.remove('open');
          });
          dropdown.classList.toggle('open');
        });
      }
    });
    
    if (!window.__mainDropdownDocListenersAttached) {
      document.addEventListener('click', (e) => {
        document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
          if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
          }
        });
      });
      window.addEventListener('scroll', () => {
        document.querySelectorAll('.custom-dropdown.open').forEach(dropdown => {
          dropdown.classList.remove('open');
        });
      }, { passive: true });
      window.__mainDropdownDocListenersAttached = true;
    }
  }
  
  // View Toggle Logic (List vs Grid)
  const viewBtns = document.querySelectorAll('.view-btn');
  const projectsContainer = document.getElementById('projectsContainer');
  
  if (viewBtns.length > 0 && projectsContainer) {
    viewBtns.forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', () => {
        if (newBtn.classList.contains('active')) return;
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        newBtn.classList.add('active');
        const viewType = newBtn.getAttribute('data-view');
        
        const container = document.getElementById('projectsContainer');
        if (!container) return;
        container.style.transition = 'opacity 0.2s ease-out';
        container.style.opacity = '0';
        setTimeout(() => {
          container.classList.remove('list-view', 'grid-view');
          container.classList.add(`${viewType}-view`);
          container.style.opacity = '1';
        }, 200);
      });
    });
  }
  
  // Projects Filtering Logic
  if (projectsContainer && customDropdowns.length > 0) {
    const filters = { type: 'all', service: 'all', industry: 'all' };

    customDropdowns.forEach(dropdown => {
      const group = dropdown.getAttribute('data-filter-group');
      const label = dropdown.querySelector('.dropdown-label');
      const items = dropdown.querySelectorAll('.dropdown-item');

      items.forEach(item => {
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        newItem.addEventListener('click', (e) => {
          e.stopPropagation();
          
          dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
          newItem.classList.add('active');
          
          const valText = newItem.textContent;
          const groupLabels = { type: 'Tipo', service: 'Serviços', industry: 'Indústria' };
          
          if(groupLabels[group] && label) {
             label.textContent = `${groupLabels[group]}: ${valText}`;
          }
          
          filters[group] = newItem.getAttribute('data-value');
          dropdown.classList.remove('open');
          applyFilters(filters);
        });
      });
    });

    function applyFilters(currentFilters) {
      const container = document.getElementById('projectsContainer');
      if (!container) return;
      const projectItems = container.querySelectorAll('.dir-project-item');
      
      container.style.transition = 'opacity 0.2s ease-out';
      container.style.opacity = '0';
      
      setTimeout(() => {
        let visibleCount = 0;
        
        projectItems.forEach(card => {
          const tags = Array.from(card.querySelectorAll('.dir-tag')).map(t => t.textContent.toLowerCase().trim());
          
          let typeMatch = true;
          if (currentFilters.type === 'real' && !tags.includes('caso real')) typeMatch = false;
          if (currentFilters.type === 'pessoal' && !tags.includes('pessoal')) typeMatch = false;
          
          let serviceMatch = true;
          if (currentFilters.service === 'design' && !tags.includes('design')) serviceMatch = false;
          if (currentFilters.service === 'frontend' && !tags.includes('frontend') && !tags.includes('front end')) serviceMatch = false;
          if (currentFilters.service === 'fullstack' && !tags.includes('full stack')) serviceMatch = false;
          
          let industryMatch = true;
          if (currentFilters.industry === 'financa' && !tags.includes('finança')) industryMatch = false;
          if (currentFilters.industry === 'imobiliario' && !tags.includes('imobiliário')) industryMatch = false;
          if (currentFilters.industry === 'moda' && !tags.includes('moda & loja')) industryMatch = false;
          if (currentFilters.industry === 'agencia' && !tags.includes('agência')) industryMatch = false;
          
          if (typeMatch && serviceMatch && industryMatch) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });
        
        const countDisplay = document.querySelector('.filter-left .count');
        if(countDisplay) {
          countDisplay.textContent = `(${visibleCount})`;
        }
        
        container.style.opacity = '1';
      }, 200);
    }
  }

  // Recommendations Carousel Logic
  const carouselTrack = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextBtn = document.querySelector('.carousel-btn.next');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const indicators = Array.from(document.querySelectorAll('.indicator'));
  
  if (carouselTrack && slides.length > 0) {
    let currentIndex = 0;
    
    const updateCarousel = (index) => {
      const track = document.querySelector('.carousel-track');
      if (track) track.style.transform = `translateX(-${index * 100}%)`;
      
      document.querySelectorAll('.carousel-slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });

      document.querySelectorAll('.indicator').forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });
      
      currentIndex = index;
    };

    updateCarousel(0);
    
    if (nextBtn) {
      const newNextBtn = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
      newNextBtn.addEventListener('click', () => {
        let index = currentIndex + 1;
        if (index >= document.querySelectorAll('.carousel-slide').length) index = 0;
        updateCarousel(index);
      });
    }
    
    if (prevBtn) {
      const newPrevBtn = prevBtn.cloneNode(true);
      prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
      newPrevBtn.addEventListener('click', () => {
        let index = currentIndex - 1;
        const total = document.querySelectorAll('.carousel-slide').length;
        if (index < 0) index = total - 1;
        updateCarousel(index);
      });
    }
    
    if (indicators.length > 0) {
      indicators.forEach((indicator, i) => {
        const newIndicator = indicator.cloneNode(true);
        indicator.parentNode.replaceChild(newIndicator, indicator);
        newIndicator.addEventListener('click', () => {
          updateCarousel(i);
        });
      });
    }
    
    if (!window.__mainCarouselResizeAttached) {
      window.addEventListener('resize', () => {
        updateCarousel(currentIndex);
      });
      window.__mainCarouselResizeAttached = true;
    }
  }

  // Reusable Modal Handler Setup
  const setupModal = (triggerId, modalId, closeBtnId) => {
    const trigger = document.getElementById(triggerId);
    if (!trigger) return;

    const newTrigger = trigger.cloneNode(true);
    trigger.parentNode.replaceChild(newTrigger, trigger);

    const openModal = (e) => {
      e.preventDefault();
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };

    newTrigger.addEventListener('click', openModal);
  };

  setupModal('open-english-cert', 'cert-modal', 'close-modal');
  setupModal('open-gaia-cert', 'gaia-cert-modal', 'close-gaia-modal');
  setupModal('open-juventude-cert', 'juventude-cert-modal', 'close-juventude-modal');
  setupModal('open-euroscola-cert', 'euroscola-cert-modal', 'close-euroscola-modal');
  setupModal('open-monserrate-cert', 'monserrate-cert-modal', 'close-monserrate-modal');
  setupModal('open-ai-org-cert', 'ai-org-cert-modal', 'close-ai-org-modal');
  setupModal('open-ibm-genai-cert', 'ibm-genai-cert-modal', 'close-ibm-genai-modal');
  setupModal('open-ibm-ds-cert', 'ibm-ds-cert-modal', 'close-ibm-ds-modal');
  setupModal('open-columbia-fe-cert', 'columbia-fe-cert-modal', 'close-columbia-fe-modal');
  setupModal('open-google-da-cert', 'google-da-cert-modal', 'close-google-da-modal');

  // Handle modal closing globally (only once)
  if (!window.__mainModalDocListenersAttached) {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.modal-close') || e.target.classList.contains('modal-backdrop')) {
        const modal = e.target.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
          activeModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
    window.__mainModalDocListenersAttached = true;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.reinitMain);
} else {
  window.reinitMain();
}
