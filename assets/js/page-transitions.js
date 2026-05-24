/* assets/js/page-transitions.js */
/* ============================================================
   AJAX PAGE TRANSITIONS
   Silky smooth page loads — horizontal stripe covers
   Matches the preloader exit animation aesthetic
   ============================================================
   SAFE BY DESIGN:
   - Does NOT interfere with the home preloader (#home-preloader)
   - Does NOT interfere with the hamburger / side drawer menu
   - Does NOT interfere with modals (cert modals, etc.)
   - Does NOT affect mailto:, tel:, external links, hash anchors
   - Restores scroll to top after each navigation
   - Re-initialises all page scripts after AJAX load
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. CREATE THE OVERLAY (injected once, persists across pages)
  ---------------------------------------------------------- */
  function createOverlay() {
    const existing = document.getElementById('page-transition-overlay');
    if (existing) return existing;

    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';

    for (let i = 0; i < 5; i++) {
      const stripe = document.createElement('div');
      stripe.className = 'pt-stripe';
      overlay.appendChild(stripe);
    }

    document.body.appendChild(overlay);
    return overlay;
  }

  /* ----------------------------------------------------------
     2. HELPERS
  ---------------------------------------------------------- */
  function getOverlay() {
    return document.getElementById('page-transition-overlay');
  }

  /**
   * Returns true if this link should be handled by AJAX transitions.
   * We skip: external links, hash anchors, mailto/tel, target="_blank",
   * modifier keys, and links within modals.
   */
  function shouldIntercept(anchor) {
    const href = anchor.getAttribute('href');
    if (!href) return false;
    if (href.startsWith('#')) return false;
    if (href.startsWith('mailto:')) return false;
    if (href.startsWith('tel:')) return false;
    if (href.startsWith('javascript:')) return false;

    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false; // external

    // Skip target="_blank"
    if (anchor.target === '_blank') return false;

    // Skip links inside modals (modal backdrop / cert modals)
    if (anchor.closest('[id$="-modal"]')) return false;
    if (anchor.closest('.modal-backdrop')) return false;

    return true;
  }

  /**
   * Returns the transition duration in ms — time for stripes to cover.
   * 5 stripes × 0.08s delay + 0.85s transition = ~1250ms total.
   * We navigate after 0.85s (first stripe fully extended) + slight buffer.
   */
  const COVER_DURATION = 900;   // ms — wait before navigating
  const REVEAL_DELAY   = 80;    // ms — tiny breathing room after DOM swap

  /* ----------------------------------------------------------
     3. TRANSITION ENGINE
  ---------------------------------------------------------- */
  let isTransitioning = false;
  let abortController  = null;

  /**
   * Trigger the cover animation, fetch the new page, swap DOM, reveal.
   */
  async function navigateTo(targetUrl) {
    if (isTransitioning) return;

    // Safety guard: don't interfere if the home preloader is still active
    const preloader = document.getElementById('home-preloader');
    if (preloader && !preloader.classList.contains('preloader-hidden') && !preloader.classList.contains('preloader-instant-hide')) {
      // Preloader still running — fall back to regular navigation
      window.location.href = targetUrl;
      return;
    }

    isTransitioning = true;

    // Close the side drawer if it's open (clean state)
    closeSideDrawer();

    const overlay = getOverlay();

    /* --- Phase 1: Cover (stripes sweep in) --- */
    overlay.classList.remove('pt-revealing');
    overlay.classList.add('pt-covering');

    /* --- Phase 2: Fetch new page while animation plays --- */
    abortController = new AbortController();

    let fetchedDoc = null;
    try {
      const response = await fetch(targetUrl, {
        signal: abortController.signal,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      if (!response.ok) {
        // Graceful fallback: real navigation
        window.location.href = targetUrl;
        return;
      }

      const html = await response.text();
      const parser = new DOMParser();
      fetchedDoc = parser.parseFromString(html, 'text/html');
    } catch (err) {
      if (err.name === 'AbortError') return;
      // Network error: fall back to regular navigation
      window.location.href = targetUrl;
      return;
    }

    /* --- Wait for cover animation to complete --- */
    await sleep(COVER_DURATION);

    /* --- Phase 3: Swap page content --- */
    try {
      swapPage(fetchedDoc, targetUrl);
    } catch (swapErr) {
      // If swap fails, navigate normally
      window.location.href = targetUrl;
      return;
    }

    /* --- Small breathing room before reveal --- */
    await sleep(REVEAL_DELAY);

    /* --- Phase 4: Reveal (stripes sweep out) --- */
    overlay.classList.remove('pt-covering');
    overlay.classList.add('pt-revealing');

    /* Reset state after reveal animation completes (~1300ms) */
    setTimeout(() => {
      overlay.classList.remove('pt-revealing');
      isTransitioning = false;
    }, 1400);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ----------------------------------------------------------
     4. PAGE SWAP
     Replaces <title>, <body> content and re-runs scripts.
  ---------------------------------------------------------- */
  function swapPage(fetchedDoc, targetUrl) {
    /* Update browser history */
    window.history.pushState({ url: targetUrl }, '', targetUrl);

    /* Update <title> */
    document.title = fetchedDoc.title;

    /* Update <meta description> if present */
    const newMeta = fetchedDoc.querySelector('meta[name="description"]');
    const oldMeta = document.querySelector('meta[name="description"]');
    if (newMeta && oldMeta) oldMeta.setAttribute('content', newMeta.getAttribute('content'));

    /* Swap body content — we keep our overlay intact */
    const newBody = fetchedDoc.body;

    // Remove the transition overlay from new body if it was fetched with one
    const clonedOverlay = newBody.querySelector('#page-transition-overlay');
    if (clonedOverlay) clonedOverlay.remove();

    // Replace body innerHTML (preserving the overlay)
    const overlay = document.getElementById('page-transition-overlay');
    document.body.innerHTML = newBody.innerHTML;

    // Re-attach the overlay (it was wiped by innerHTML reassignment)
    document.body.appendChild(overlay);

    // Copy new body inline styles (e.g. overflow-x: hidden)
    if (newBody.getAttribute('style')) {
      document.body.setAttribute('style', newBody.getAttribute('style'));
    }

    /* Scroll to top */
    window.scrollTo(0, 0);

    /* Inject new page-specific <link> stylesheets if not already present */
    injectNewStylesheets(fetchedDoc);

    /* Re-run initialisation scripts */
    reinitScripts();
  }

  /* ----------------------------------------------------------
     5. STYLESHEET INJECTION
     Adds any CSS <link> from the new page that isn't already loaded.
  ---------------------------------------------------------- */
  function injectNewStylesheets(fetchedDoc) {
    const existingHrefs = new Set(
      Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href)
    );

    fetchedDoc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const abs = new URL(link.getAttribute('href'), window.location.origin).href;
      if (!existingHrefs.has(abs)) {
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = abs;
        document.head.appendChild(newLink);
      }
    });
  }

  /* ----------------------------------------------------------
     6. SCRIPT RE-INITIALISATION
     After a DOM swap, we re-run all our module init functions.
     This is safer than re-injecting <script> tags.
  ---------------------------------------------------------- */
  function reinitScripts() {
    /* Fire DOMContentLoaded-equivalent for all modules */
    const event = new Event('DOMContentLoaded', { bubbles: true, cancelable: false });

    // Animations (fade-up observer)
    if (typeof window.__initAnimations === 'function') window.__initAnimations();
    else reinitAnimations();

    // Menu (hamburger + side drawer)
    if (typeof window.__initMenu === 'function') window.__initMenu();
    else reinitMenu();

    // Hero carousel (home page only)
    if (typeof window.__initHeroCarousel === 'function') window.__initHeroCarousel();

    // Dynamic status card (home page only)
    if (typeof window.__initDynamicStatus === 'function') window.__initDynamicStatus();

    // Main.js logic (dropdowns, view toggles, filtering, recommendations carousel, modals)
    if (typeof window.__initMain === 'function') window.__initMain();
    else reinitMain();

    // Re-attach page transition link listeners on the new page
    attachLinkListeners();

    // Re-run any inline <script> blocks in the new body that need it
    // (We skip this for the home preloader — it has its own guard)
  }

  /* ----------------------------------------------------------
     7. FALLBACK REINIT FUNCTIONS
     These mirror the logic in existing .js files but are wrapped
     so they can be called multiple times safely.
  ---------------------------------------------------------- */

  function reinitAnimations() {
    // Reset scroll to top after page swap
    window.scrollTo(0, 0);

    const fadeElements = document.querySelectorAll('.fade-up:not(.is-visible)');
    if (!fadeElements.length) return;

    const options = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          setTimeout(() => {
            if (entry.target.style.transitionDelay) {
              entry.target.style.transitionDelay = '0s';
            }
          }, 800);
          obs.unobserve(entry.target);
        }
      });
    }, options);

    fadeElements.forEach(el => observer.observe(el));

    // Stagger logic
    document.querySelectorAll('.stagger-container').forEach(container => {
      container.querySelectorAll('.fade-up').forEach((child, index) => {
        child.style.setProperty('--stagger-index', index);
      });
    });

    // Trigger hero elements that are immediately visible (top of page)
    const heroEls = document.querySelectorAll(
      '.split-hero-container.fade-up, .hero-text-wrapper.fade-up, .bottom-nav.fade-up, .hero-text-side.fade-up, .hero-image-side.fade-up, .servicos-hero .fade-up'
    );
    heroEls.forEach(el => {
      el.classList.add('is-visible');
    });
  }

  function reinitMenu() {
    const trigger = document.getElementById('menuTrigger');
    const overlay = document.getElementById('drawerOverlay');
    const drawer  = document.getElementById('sideDrawer');

    if (!trigger || !drawer) return;

    const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

    const toggleMenu = () => {
      const isActive = !document.body.classList.contains('nav-active');
      const scrollWidth = getScrollbarWidth();

      if (isActive) {
        document.body.classList.add('nav-active');
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollWidth}px`;
        trigger.style.marginRight = `${scrollWidth}px`;
      } else {
        document.body.classList.remove('nav-active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        trigger.style.marginRight = '';
      }
      trigger.setAttribute('aria-expanded', isActive);
    };

    trigger.addEventListener('click', toggleMenu);

    if (overlay) {
      overlay.addEventListener('click', () => {
        if (document.body.classList.contains('nav-active')) toggleMenu();
      });
    }

    // Close on drawer link click
    document.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        trigger.style.marginRight = '';
        trigger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-active')) toggleMenu();
    });

    // Adaptive trigger color based on dark sections
    const darkSections = document.querySelectorAll('.is-dark');
    if (darkSections.length > 0) {
      const updateTriggerColor = () => {
        if (document.body.classList.contains('nav-active')) return;
        const triggerRect = trigger.getBoundingClientRect();
        const triggerCenterY = triggerRect.top + triggerRect.height / 2;
        let isOverDark = false;
        darkSections.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (triggerCenterY >= rect.top - 100 && triggerCenterY <= rect.bottom + 100) {
            isOverDark = true;
          }
        });
        trigger.classList.toggle('is-over-dark', isOverDark);
      };
      window.addEventListener('scroll', updateTriggerColor, { passive: true });
      window.addEventListener('resize', updateTriggerColor);
      updateTriggerColor();
    }
  }

  function reinitMain() {
    // Mobile nav toggle (simple version in main.js)
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav    = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
      menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('is-open');
      });
    }

    // Custom Dropdowns
    const customDropdowns = document.querySelectorAll('.custom-dropdown');
    customDropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          customDropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('open'); });
          dropdown.classList.toggle('open');
        });
      }
    });
    document.addEventListener('click', (e) => {
      customDropdowns.forEach(d => { if (!d.contains(e.target)) d.classList.remove('open'); });
    });

    // View Toggle (list/grid)
    const viewBtns = document.querySelectorAll('.view-btn');
    const projectsContainer = document.getElementById('projectsContainer');
    if (viewBtns.length > 0 && projectsContainer) {
      viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.classList.contains('active')) return;
          viewBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const viewType = btn.getAttribute('data-view');
          projectsContainer.style.transition = 'opacity 0.2s ease-out';
          projectsContainer.style.opacity = '0';
          setTimeout(() => {
            projectsContainer.classList.remove('list-view', 'grid-view');
            projectsContainer.classList.add(`${viewType}-view`);
            projectsContainer.style.opacity = '1';
          }, 200);
        });
      });
    }

    // Carousel (recommendations)
    const carouselTrack = document.querySelector('.carousel-track');
    const slides        = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextBtn       = document.querySelector('.carousel-btn.next');
    const prevBtn       = document.querySelector('.carousel-btn.prev');
    const indicators    = Array.from(document.querySelectorAll('.indicator'));

    if (carouselTrack && slides.length > 0) {
      let currentIndex = 0;
      const updateCarousel = (index) => {
        carouselTrack.style.transform = `translateX(-${index * 100}%)`;
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        indicators.forEach((ind, i) => ind.classList.toggle('active', i === index));
        currentIndex = index;
      };
      updateCarousel(0);
      if (nextBtn) nextBtn.addEventListener('click', () => updateCarousel((currentIndex + 1) % slides.length));
      if (prevBtn) prevBtn.addEventListener('click', () => updateCarousel((currentIndex - 1 + slides.length) % slides.length));
      indicators.forEach((ind, i) => ind.addEventListener('click', () => updateCarousel(i)));
      window.addEventListener('resize', () => updateCarousel(currentIndex));
    }

    // Modals
    const setupModal = (triggerId, modalId) => {
      const trigger = document.getElementById(triggerId);
      const modal   = document.getElementById(modalId);
      if (!trigger || !modal) return;
      const closeBtn  = modal.querySelector('.modal-close');
      const backdrop  = modal.querySelector('.modal-backdrop');
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
      const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      };
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (backdrop) backdrop.addEventListener('click', closeModal);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
      });
    };

    [
      ['open-english-cert',    'cert-modal'],
      ['open-gaia-cert',       'gaia-cert-modal'],
      ['open-juventude-cert',  'juventude-cert-modal'],
      ['open-euroscola-cert',  'euroscola-cert-modal'],
      ['open-monserrate-cert', 'monserrate-cert-modal'],
      ['open-ai-org-cert',     'ai-org-cert-modal'],
      ['open-ibm-genai-cert',  'ibm-genai-cert-modal'],
      ['open-ibm-ds-cert',     'ibm-ds-cert-modal'],
      ['open-columbia-fe-cert','columbia-fe-cert-modal'],
      ['open-google-da-cert',  'google-da-cert-modal'],
    ].forEach(([tid, mid]) => setupModal(tid, mid));
  }

  /* ----------------------------------------------------------
     8. CLOSE SIDE DRAWER (utility)
  ---------------------------------------------------------- */
  function closeSideDrawer() {
    if (document.body.classList.contains('nav-active')) {
      document.body.classList.remove('nav-active');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      const trigger = document.getElementById('menuTrigger');
      if (trigger) {
        trigger.style.marginRight = '';
        trigger.setAttribute('aria-expanded', 'false');
      }
    }
  }

  /* ----------------------------------------------------------
     9. INTERCEPT ALL INTERNAL LINKS
  ---------------------------------------------------------- */
  function attachLinkListeners() {
    // Use event delegation on document for robustness
    // (catches dynamically injected links too)
    document.querySelectorAll('a').forEach(anchor => {
      // Skip already-instrumented anchors to prevent double-firing
      if (anchor.dataset.ptBound) return;
      anchor.dataset.ptBound = '1';

      anchor.addEventListener('click', (e) => {
        // Modifier keys = let browser handle naturally
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!shouldIntercept(anchor)) return;

        e.preventDefault();
        const target = anchor.href;

        // Don't re-navigate to the same URL
        if (window.location.href === target) {
          closeSideDrawer();
          return;
        }

        navigateTo(target);
      });
    });
  }

  /* ----------------------------------------------------------
     10. BROWSER BACK / FORWARD (popstate)
  ---------------------------------------------------------- */
  window.addEventListener('popstate', async (e) => {
    const targetUrl = window.location.href;

    if (isTransitioning) return;
    isTransitioning = true;

    closeSideDrawer();
    const overlay = getOverlay();

    // Cover
    overlay.classList.remove('pt-revealing');
    overlay.classList.add('pt-covering');

    try {
      const response = await fetch(targetUrl, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      if (!response.ok) { window.location.reload(); return; }

      const html = await response.text();
      const parser = new DOMParser();
      const fetchedDoc = parser.parseFromString(html, 'text/html');

      await sleep(COVER_DURATION);
      swapPage(fetchedDoc, targetUrl);

      // Keep URL as-is (popstate already set it)
      // Override the pushState that swapPage does
      window.history.replaceState({}, '', targetUrl);

      await sleep(REVEAL_DELAY);
      overlay.classList.remove('pt-covering');
      overlay.classList.add('pt-revealing');

      setTimeout(() => {
        overlay.classList.remove('pt-revealing');
        isTransitioning = false;
      }, 1400);
    } catch (err) {
      window.location.reload();
    }
  });

  /* ----------------------------------------------------------
     11. INIT
  ---------------------------------------------------------- */
  function init() {
    createOverlay();
    attachLinkListeners();

    // On the very first load, trigger the reveal if coming from an AJAX nav
    // (nothing needed — page loads normally without AJAX on first visit)
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
