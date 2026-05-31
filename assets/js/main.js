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
      let target = e.target;
      if (target && target.nodeType === 3) target = target.parentNode;
      if (!target || typeof target.closest !== 'function') return;

      // 1. Mobile Menu Toggle
      const menuToggle = target.closest('.mobile-menu-toggle');
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
      const dropdownTrigger = target.closest('.dropdown-trigger');
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
      const filterItem = target.closest('.dropdown-item');
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
      const viewBtn = target.closest('.view-btn');
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

      // 5. Accordion (Serviços)
      const accordionHeader = target.closest('.accordion-header');
      if (accordionHeader) {
        const item = accordionHeader.closest('.accordion-item');
        if (item) {
          const isActive = item.classList.contains('active');
          if (!isActive) {
            document.querySelectorAll('.accordion-item').forEach(other => other.classList.remove('active'));
            item.classList.add('active');
          }
        }
        return;
      }
      // 7. Clear Filters
      const clearBtn = target.closest('#clearFiltersBtn');
      if (clearBtn) {
        window._globalProjectsFilters = { type: 'all', service: 'all', industry: 'all' };
        
        document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
          dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('active'));
          const allItem = dropdown.querySelector('.dropdown-item[data-value="all"]');
          if (allItem) {
            allItem.classList.add('active');
            const label = dropdown.querySelector('.dropdown-label');
            const group = dropdown.getAttribute('data-filter-group');
            const groupLabels = { type: 'Tipo', service: 'Serviços', industry: 'Indústria' };
            if (groupLabels[group] && label) {
               label.textContent = `${groupLabels[group]}: ${allItem.textContent}`;
            }
          }
        });
        
        applyGlobalFilters(window._globalProjectsFilters);
        return;
      }

      // 6. Close Dropdowns if clicked outside
      if (!target.closest('.custom-dropdown')) {
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
    
    container.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
    container.style.opacity = '0';
    container.style.transform = 'translateY(15px)';
    
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
        if (currentFilters.industry === 'financas' && !tags.includes('finanças')) industryMatch = false;
        if (currentFilters.industry === 'educacao' && !tags.includes('educação')) industryMatch = false;
        if (currentFilters.industry === 'retalho' && !tags.includes('retalho')) industryMatch = false;
        if (currentFilters.industry === 'eventos' && !tags.includes('eventos')) industryMatch = false;
        if (currentFilters.industry === 'portfolio' && !tags.includes('portfólio')) industryMatch = false;
        if (currentFilters.industry === 'alojamento' && !tags.includes('alojamento')) industryMatch = false;
        if (currentFilters.industry === 'politica' && !tags.includes('política')) industryMatch = false;
        
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
      
      const noResultsState = document.getElementById('noResultsState');
      if (noResultsState) {
        noResultsState.style.display = visibleCount === 0 ? 'flex' : 'none';
      }
      requestAnimationFrame(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
      });
    }, 250);
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
        if (i === index) slide.classList.add('active');
        else slide.classList.remove('active');
      });
      
      const currentIndicators = document.querySelectorAll('.indicator');
      if (currentIndicators.length > 0) {
        currentIndicators.forEach((indicator, i) => {
          if (i === index) indicator.classList.add('active');
          else indicator.classList.remove('active');
        });
      }
      currentIndex = index;
    };

    if (nextBtn) {
      nextBtn.onclick = () => {
        let index = currentIndex + 1;
        if (index >= document.querySelectorAll('.carousel-slide').length) index = 0;
        updateCarousel(index);
      };
    }
    
    if (prevBtn) {
      prevBtn.onclick = () => {
        let index = currentIndex - 1;
        const total = document.querySelectorAll('.carousel-slide').length;
        if (index < 0) index = total - 1;
        updateCarousel(index);
      };
    }
    
    if (indicators.length > 0) {
      indicators.forEach((indicator, i) => {
        indicator.onclick = () => {
          updateCarousel(i);
        };
      });
    }
    
    if (!window.__mainCarouselResizeAttached) {
      window.addEventListener('resize', () => {
        updateCarousel(currentIndex);
      });
      window.__mainCarouselResizeAttached = true;
    }
  }

  // ==========================================
  // MODAL LOGIC: EVENT DELEGATION
  // ==========================================
  if (!window.__mainModalDelegatedAttached) {
    const modalMap = {
      'open-english-cert': 'cert-modal',
      'open-gaia-cert': 'gaia-cert-modal',
      'open-juventude-cert': 'juventude-cert-modal',
      'open-euroscola-cert': 'euroscola-cert-modal',
      'open-monserrate-cert': 'monserrate-cert-modal',
      'open-ai-org-cert': 'ai-org-cert-modal',
      'open-ibm-genai-cert': 'ibm-genai-cert-modal',
      'open-ibm-ds-cert': 'ibm-ds-cert-modal',
      'open-columbia-fe-cert': 'columbia-fe-cert-modal',
      'open-google-da-cert': 'google-da-cert-modal'
    };

    document.addEventListener('click', (e) => {
      let target = e.target;
      if (target && target.nodeType === 3) target = target.parentNode;
      if (!target || typeof target.closest !== 'function') return;

      // 1. Check if we clicked a trigger to OPEN a modal
      const triggerEl = target.closest('[id^="open-"]');
      if (triggerEl && modalMap[triggerEl.id]) {
        e.preventDefault();
        const modalId = modalMap[triggerEl.id];
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
        return;
      }

      // 2. Check if we clicked to CLOSE a modal
      if (target.closest('.modal-close') || target.classList.contains('modal-backdrop')) {
        const modal = target.closest('.modal'); // Fixed selector from .modal-overlay to .modal
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          activeModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });

    window.__mainModalDelegatedAttached = true;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.reinitMain);
} else {
  window.reinitMain();
}
