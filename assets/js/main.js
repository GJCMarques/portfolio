/* assets/js/main.js */
// Main scripts like mobile menu

window.reinitMain = function() {
  // ==========================================
  // EVENT DELEGATION: AJAX SAFE
  // Estes listeners estão no document, por isso
  // sobrevivem a mudanças de DOM via AJAX.
  // ==========================================
  if (!window.__mainDelegatedListenersAttached) {
    
    // Filtros Globais Estado
    window._globalProjectsFilters = { type: 'all', service: 'all', industry: 'all' };

    document.addEventListener('click', (e) => {
      
      // 1. Mobile Menu Toggle
      const menuToggle = e.target.closest('.mobile-menu-toggle');
      if (menuToggle) {
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
          const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
          menuToggle.setAttribute('aria-expanded', !isExpanded);
          mainNav.classList.toggle('is-open');
        }
        return;
      }

      // 2. Custom Dropdown Triggers (Abrir/Fechar)
      const dropdownTrigger = e.target.closest('.dropdown-trigger');
      if (dropdownTrigger) {
        const dropdown = dropdownTrigger.closest('.custom-dropdown');
        if (dropdown) {
          e.stopPropagation();
          document.querySelectorAll('.custom-dropdown').forEach(d => {
            if (d !== dropdown) d.classList.remove('open');
          });
          dropdown.classList.toggle('open');
        }
        return;
      }

      // 3. Custom Dropdown Items (Selecionar Filtro)
      const filterItem = e.target.closest('.dropdown-item');
      if (filterItem) {
        e.stopPropagation();
        const dropdown = filterItem.closest('.custom-dropdown');
        if (!dropdown) return;
        
        dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
        filterItem.classList.add('active');

        const group = dropdown.getAttribute('data-filter-group');
        const label = dropdown.querySelector('.dropdown-label');
        const valText = filterItem.textContent;
        const groupLabels = { type: 'Tipo', service: 'Serviços', industry: 'Indústria' };
        
        if(groupLabels[group] && label) {
           label.textContent = `${groupLabels[group]}: ${valText}`;
        }
        
        window._globalProjectsFilters[group] = filterItem.getAttribute('data-value');
        dropdown.classList.remove('open');
        applyGlobalFilters(window._globalProjectsFilters);
        return;
      }

      // 4. View Toggles (Grid vs List)
      const viewBtn = e.target.closest('.view-btn');
      if (viewBtn) {
        if (viewBtn.classList.contains('active')) return;
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        viewBtn.classList.add('active');
        
        const viewType = viewBtn.getAttribute('data-view');
        const container = document.getElementById('projectsContainer');
        if (!container) return;
        
        container.style.transition = 'opacity 0.2s ease-out';
        container.style.opacity = '0';
        setTimeout(() => {
          container.classList.remove('list-view', 'grid-view');
          container.classList.add(`${viewType}-view`);
          container.style.opacity = '1';
        }, 200);
        return;
      }

      // 5. Close Dropdowns if clicked outside
      if (!e.target.closest('.custom-dropdown')) {
        document.querySelectorAll('.custom-dropdown.open').forEach(dropdown => {
          dropdown.classList.remove('open');
        });
      }
    });

    window.addEventListener('scroll', () => {
      document.querySelectorAll('.custom-dropdown.open').forEach(dropdown => {
        dropdown.classList.remove('open');
      });
    }, { passive: true });

    window.__mainDelegatedListenersAttached = true;
  }

  // Função Global de Aplicação de Filtros
  function applyGlobalFilters(currentFilters) {
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
