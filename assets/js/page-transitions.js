/* assets/js/page-transitions.js */
/* ============================================================
   AJAX PAGE TRANSITIONS v2
   Silky smooth page loads — horizontal stripe covers
   Matches the preloader exit animation aesthetic
   ============================================================
   SAFE BY DESIGN:
   - Does NOT interfere with the home preloader (#home-preloader)
   - Does NOT interfere with the hamburger / side drawer menu
   - Does NOT interfere with modals (cert modals, etc.)
   - Does NOT affect mailto:, tel:, external links, hash anchors
   - Restores scroll to top after each navigation
   - Re-executes ALL inline scripts from new page
   - Re-initialises all external page scripts after AJAX load
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

  function getOverlay() {
    return document.getElementById('page-transition-overlay');
  }

  /* ----------------------------------------------------------
     2. LINK FILTERING
  ---------------------------------------------------------- */
  function shouldIntercept(anchor) {
    const href = anchor.getAttribute('href');
    if (!href) return false;
    if (href.startsWith('#')) return false;
    if (href.startsWith('mailto:')) return false;
    if (href.startsWith('tel:')) return false;
    if (href.startsWith('javascript:')) return false;

    try {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return false;
    } catch (e) {
      return false;
    }

    if (anchor.target === '_blank') return false;
    if (anchor.closest('[id$="-modal"]')) return false;
    if (anchor.closest('.modal-backdrop')) return false;

    return true;
  }

  /* ----------------------------------------------------------
     3. TIMING
  ---------------------------------------------------------- */
  const COVER_DURATION = 900;  // ms — wait before swapping DOM
  const REVEAL_DELAY   = 60;   // ms — breathing room after swap

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* ----------------------------------------------------------
     4. TRANSITION ENGINE
  ---------------------------------------------------------- */
  let isTransitioning = false;

  async function navigateTo(targetUrl) {
    if (isTransitioning) return;

    // Guard: don't intercept if home preloader is still active
    const preloaderEl = document.getElementById('home-preloader');
    if (preloaderEl &&
        !preloaderEl.classList.contains('preloader-hidden') &&
        !preloaderEl.classList.contains('preloader-instant-hide')) {
      window.location.href = targetUrl;
      return;
    }

    isTransitioning = true;
    closeSideDrawer();

    const overlay = getOverlay();

    // Phase 1: Cover (stripes sweep IN)
    overlay.classList.remove('pt-revealing');
    overlay.classList.add('pt-covering');

    // Phase 2: Fetch new page concurrently with animation
    let fetchedDoc = null;
    try {
      const response = await fetch(targetUrl, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      if (!response.ok) { window.location.href = targetUrl; return; }

      const html = await response.text();
      fetchedDoc = new DOMParser().parseFromString(html, 'text/html');
    } catch (err) {
      window.location.href = targetUrl;
      return;
    }

    // Wait for cover animation to complete
    await sleep(COVER_DURATION);

    // Phase 3: Swap page content
    try {
      swapPage(fetchedDoc, targetUrl);
    } catch (err) {
      window.location.href = targetUrl;
      return;
    }

    await sleep(REVEAL_DELAY);

    // Phase 4: Reveal (stripes sweep OUT)
    overlay.classList.remove('pt-covering');
    overlay.classList.add('pt-revealing');

    setTimeout(() => {
      overlay.classList.remove('pt-revealing');
      isTransitioning = false;
    }, 1400);
  }

  /* ----------------------------------------------------------
     5. PAGE SWAP
     Replace body content, reinit all scripts, handle CSS
  ---------------------------------------------------------- */
  function swapPage(fetchedDoc, targetUrl) {
    // Update history
    window.history.pushState({ url: targetUrl }, '', targetUrl);

    // Update <title>
    document.title = fetchedDoc.title;

    // Update favicon
    const newFavicon = fetchedDoc.querySelector('link[rel="icon"]');
    if (newFavicon) {
      const oldFavicon = document.querySelector('link[rel="icon"]');
      const absHref = new URL(newFavicon.getAttribute('href'), targetUrl).href;
      if (oldFavicon) {
        oldFavicon.href = absHref;
      } else {
        const fl = document.createElement('link');
        fl.rel = 'icon';
        fl.type = newFavicon.type || 'image/svg+xml';
        fl.href = absHref;
        document.head.appendChild(fl);
      }
    }

    // Update <meta description>
    const newMeta = fetchedDoc.querySelector('meta[name="description"]');
    const oldMeta = document.querySelector('meta[name="description"]');
    if (newMeta && oldMeta) {
      oldMeta.setAttribute('content', newMeta.getAttribute('content'));
    }

    // Manage CSS: remove previous page's exclusive styles, inject new page's styles
    manageStylesheets(fetchedDoc, targetUrl);

    // Preserve the overlay element across swap
    const overlay = document.getElementById('page-transition-overlay');

    // Swap body HTML
    const newBody = fetchedDoc.body;
    const newBodyOverlay = newBody.querySelector('#page-transition-overlay');
    if (newBodyOverlay) newBodyOverlay.remove();

    document.body.innerHTML = newBody.innerHTML;

    // Re-attach overlay
    document.body.appendChild(overlay);

    // Reset body style to match new page
    document.body.removeAttribute('style');
    const newBodyStyle = newBody.getAttribute('style');
    if (newBodyStyle) document.body.setAttribute('style', newBodyStyle);

    // --------------------------------------------------------
    // SUPPRESS HOME PRELOADER on AJAX back-to-index
    // The inline preloader script does NOT re-execute via innerHTML
    // --------------------------------------------------------
    const homePreloader = document.getElementById('home-preloader');
    if (homePreloader) {
      homePreloader.classList.add('preloader-instant-hide');
      document.body.style.overflow = '';
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Re-execute all inline scripts from new page
    executeInlineScripts(fetchedDoc.body);

    // Re-initialise external scripts that use DOMContentLoaded
    reinitExternalScripts();

    // Re-attach link listeners on new content
    attachLinkListeners();
  }

  /* ----------------------------------------------------------
     6. CSS MANAGEMENT
     Adds CSS files needed for new page, removes those that are
     exclusive to the previous page. Prevents style accumulation
     that causes layout conflicts between pages.
  ---------------------------------------------------------- */

  // CSS files shared across all pages — never remove these
  const SHARED_CSS = [
    'fonts.css', 'variables.css', 'global.css', 'menu.css',
    'animations.css', 'components.css', 'page-transitions.css'
  ];

  function isSharedCss(href) {
    return SHARED_CSS.some(name => href.includes(name));
  }

  function manageStylesheets(fetchedDoc, targetUrl) {
    // Build set of hrefs the NEW page needs (absolute URLs)
    const newPageHrefs = new Set();
    fetchedDoc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      try {
        newPageHrefs.add(new URL(href, targetUrl).href);
      } catch (e) { /* ignore */ }
    });

    // Remove page-specific CSS files NOT needed by the new page
    document.querySelectorAll('link[rel="stylesheet"]').forEach(existingLink => {
      const href = existingLink.href;
      if (isSharedCss(href)) return;          // never remove shared CSS
      if (newPageHrefs.has(href)) return;     // new page needs this — keep it
      existingLink.parentNode.removeChild(existingLink); // remove stale CSS
    });

    // Now add CSS files the new page needs that aren't loaded yet
    const currentHrefs = new Set(
      Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href)
    );

    fetchedDoc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      try {
        const abs = new URL(href, targetUrl).href;
        if (!currentHrefs.has(abs)) {
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.href = abs;
          document.head.appendChild(newLink);
          currentHrefs.add(abs);
        }
      } catch (e) { /* ignore bad hrefs */ }
    });
  }


  /* ----------------------------------------------------------
     7. INLINE SCRIPT EXECUTION
     Re-runs all <script> blocks from the newly loaded body.
     This handles ALL page-specific JS: accordion, carousels,
     filters, activity timelines, etc.
     Skips the home preloader script (session-managed separately).
  ---------------------------------------------------------- */
  function executeInlineScripts(bodyEl) {
    bodyEl.querySelectorAll('script').forEach(oldScript => {
      // Skip external scripts (src attribute) — already loaded
      if (oldScript.src) return;

      const code = oldScript.textContent || '';

      // Skip the home preloader script — it has its own session/storage logic
      // that must NOT run on AJAX navigation
      if (code.includes('home-preloader') || code.includes('hasSeenPreloader')) return;

      // Skip Live Server injected scripts to prevent WebSocket memory leaks and crashes
      if (code.includes('Code injected by live-server') || code.includes('live-server') || code.includes('Live Server')) return;

      try {
        const newScript = document.createElement('script');
        newScript.textContent = code;
        document.body.appendChild(newScript);
        // Remove immediately after execution to keep DOM clean
        document.body.removeChild(newScript);
      } catch (err) {
        console.warn('[PT] Inline script error:', err);
      }
    });

    // CRITICAL FIX: Many inline scripts are wrapped in document.addEventListener('DOMContentLoaded', ...)
    // Since the document is already loaded, these listeners would normally never fire.
    // We manually dispatch the event so they execute immediately after being injected.
    window.document.dispatchEvent(new Event('DOMContentLoaded', {
      bubbles: true,
      cancelable: true
    }));
  }

  /* ----------------------------------------------------------
     8. EXTERNAL SCRIPT REINIT
     External scripts (dynamic-status.js, hero-carousel.js,
     animations.js, menu.js) use DOMContentLoaded which only
     fires once. We must manually re-run their logic after swap.
  ---------------------------------------------------------- */
  function reinitExternalScripts() {
    // ---- Animations (fade-up IntersectionObserver) ----
    reinitAnimations();

    // ---- Menu (hamburger + side drawer) ----
    reinitMenu();

    // ---- Dynamic Status Card (home page only) ----
    reinitDynamicStatus();

    // ---- Hero Carousel (home page only) ----
    reinitHeroCarousel();

    // ---- Main logic (modals, dropdowns, filters, view toggles) ----
    if (typeof window.reinitMain === 'function') {
      window.reinitMain();
    }
  }

  function reinitAnimations() {
    window.scrollTo(0, 0);

    const fadeEls = document.querySelectorAll('.fade-up:not(.is-visible)');

    // Immediately show elements that are at the top of the page
    const immediateSelectors = [
      '.split-hero-container.fade-up',
      '.split-hero-container.hero-fade-up',
      '.hero-text-wrapper.fade-up',
      '.hero-text-wrapper.hero-fade-up',
      '.bottom-nav.fade-up',
      '.bottom-nav.hero-fade-up',
      '.floating-card-wrapper.fade-up',
      '.floating-card-wrapper.hero-fade-up',
      '.hero-text-side.fade-up',
      '.hero-image-side.fade-up',
      '.header-top.fade-up',
      '.servicos-hero .fade-up',
      '.hero-editorial-row.fade-up',
      '.hero-visual-wrapper.fade-up',
      '.contact-hero .fade-up',
      '.projetos-hero-section .fade-up'
    ];
    setTimeout(() => {
      document.querySelectorAll(immediateSelectors.join(', ')).forEach(el => {
        el.classList.add('is-visible');
      });
    }, 200);

    // Observer for the rest
    if (!fadeEls.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => observer.observe(el));

    // Stagger containers
    document.querySelectorAll('.stagger-container').forEach(container => {
      container.querySelectorAll('.fade-up').forEach((child, i) => {
        child.style.setProperty('--stagger-index', i);
      });
    });
  }

  function reinitMenu() {
    const trigger = document.getElementById('menuTrigger');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawer = document.getElementById('sideDrawer');

    if (!trigger || !drawer) return;

    const scrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

    // Remove old listeners by cloning (safest approach)
    const newTrigger = trigger.cloneNode(true);
    trigger.parentNode.replaceChild(newTrigger, trigger);

    const toggleMenu = () => {
      const opening = !document.body.classList.contains('nav-active');
      const sw = scrollbarWidth();
      if (opening) {
        document.body.classList.add('nav-active');
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${sw}px`;
        newTrigger.style.marginRight = `${sw}px`;
      } else {
        document.body.classList.remove('nav-active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        newTrigger.style.marginRight = '';
      }
      newTrigger.setAttribute('aria-expanded', opening);
    };

    newTrigger.addEventListener('click', toggleMenu);

    if (drawerOverlay) {
      const newOverlay = drawerOverlay.cloneNode(true);
      drawerOverlay.parentNode.replaceChild(newOverlay, drawerOverlay);
      newOverlay.addEventListener('click', () => {
        if (document.body.classList.contains('nav-active')) toggleMenu();
      });
    }

    // Drawer links close the menu
    document.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('nav-active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        newTrigger.style.marginRight = '';
        newTrigger.setAttribute('aria-expanded', 'false');
      });
    });

    // Adaptive trigger colour (dark sections)
    const darkSections = document.querySelectorAll('.is-dark');
    if (darkSections.length > 0) {
      const updateColor = () => {
        if (document.body.classList.contains('nav-active')) return;
        const rect = newTrigger.getBoundingClientRect();
        const cy = rect.top + rect.height / 2;
        let overDark = false;
        darkSections.forEach(s => {
          const sr = s.getBoundingClientRect();
          if (cy >= sr.top - 100 && cy <= sr.bottom + 100) overDark = true;
        });
        newTrigger.classList.toggle('is-over-dark', overDark);
      };
      window.addEventListener('scroll', updateColor, { passive: true });
      updateColor();
    }
  }

  /* ---- Dynamic Status Card ---- */
  function reinitDynamicStatus() {
    const clockEl   = document.getElementById('live-clock');
    const titleEl   = document.getElementById('status-title');
    const msgEl     = document.getElementById('status-message');
    const iconEl    = document.getElementById('status-icon');

    if (!clockEl || !titleEl || !msgEl || !iconEl) return;

    // Clear any existing intervals stored on window
    if (window.__ptDynamicStatusIntervals) {
      window.__ptDynamicStatusIntervals.forEach(id => clearInterval(id));
    }
    window.__ptDynamicStatusIntervals = [];

    const icons = {
      coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
      zap:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
      moon:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
      camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
      peace:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"></path><path d="M12 18v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path><circle cx="12" cy="12" r="4"></circle></svg>`,
      code:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
      search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
      waves:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C5.8 7 7 5.6 8.5 5.6c1.3 0 2.5 1.4 3.5 1.4 1 0 2.4-1.4 3.5-1.4 1.4 0 2.4 1.4 3.5 1.4 1.2 0 1.9-.5 2.5-1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 1.3 0 2.5-1.4 3.5-1.4 1 0 2.4 1.4 3.5 1.4 1.2 0 2.4-1.4 3.5-1.4 1.4 0 2.4 1.4 3.5 1.4 1.2 0 1.9-.5 2.5-1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 1.3 0 2.5-1.4 3.5-1.4 1 0 2.4 1.4 3.5 1.4 1.2 0 2.4-1.4 3.5-1.4 1.4 0 2.4 1.4 3.5 1.4 1.2 0 1.9-.5 2.5-1"></path></svg>`,
      paint:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l5 5"></path></svg>`,
      beer:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11h1a3 3 0 0 1 0 6h-1"></path><path d="M5 21h12V7H5v14z"></path><path d="M5 3h12"></path><path d="M11 7v14"></path></svg>`,
      book:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5V4.5z"></path></svg>`,
      target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`
    };

    const statusMap = {
      0: { morning: { title: "Slow Living", message: "Domingo é para ler e recarregar a alma.", icon: icons.book }, afternoon: { title: "Side Projects", message: "Codar por prazer, sem prazos nem pressas.", icon: icons.code }, late: { title: "Reset & Plan", message: "Organizar a mente para uma nova semana épica.", icon: icons.peace }, night: { title: "Ready for 01", message: "Tudo alinhado. Segunda-feira, estou pronto.", icon: icons.target } },
      1: { morning: { title: "Início de Semana", message: "Café duplo para enfrentar a segunda-feira.", icon: icons.coffee }, afternoon: { title: "Back to Business", message: "A limpar a inbox e a planear sprints.", icon: icons.zap }, late: { title: "Primeiro Round", message: "Primeiro dia superado. O Porto brilha lá fora.", icon: icons.waves }, night: { title: "Estratégia", message: "Planear a semana enquanto a cidade acalma.", icon: icons.moon } },
      2: { morning: { title: "Full Focus", message: "Terça-feira é dia de produção intensiva.", icon: icons.zap }, afternoon: { title: "Code Review", message: "A polir detalhes e a caçar bugs.", icon: icons.search }, late: { title: "Pausa Criativa", message: "Uma caminhada pela Foz para arejar as ideias.", icon: icons.waves }, night: { title: "Quiet Hours", message: "O silêncio da noite é o melhor depurador.", icon: icons.moon } },
      3: { morning: { title: "Mid-week Energy", message: "Metade da semana! O ritmo está alto.", icon: icons.zap }, afternoon: { title: "Interface Design", message: "Figma e café. A combinação perfeita.", icon: icons.paint }, late: { title: "Networking", message: "A buscar inspiração na comunidade do Porto.", icon: icons.peace }, night: { title: "Refining", message: "Ajustar animações até estarem perfeitas.", icon: icons.code } },
      4: { morning: { title: "Sprint Final", message: "Quinta-feira é dia de fechar grandes módulos.", icon: icons.zap }, afternoon: { title: "QA Testing", message: "Nada escapa ao olhar clínico de um dev.", icon: icons.search }, late: { title: "Quase lá", message: "A pensar na imperial de amanhã, mas focado.", icon: icons.beer }, night: { title: "Build Time", message: "A compilar os sucessos do dia.", icon: icons.moon } },
      5: { morning: { title: "TGIF Prep", message: "Manhã de fecho. Tudo pronto para o deploy.", icon: icons.coffee }, afternoon: { title: "Deploy Friday", message: "Sim, eu faço deploys à sexta. Com confiança.", icon: icons.zap }, late: { title: "Relax Mode", message: "O fim de semana começa agora nas Virtudes.", icon: icons.beer }, night: { title: "Offline Vibes", message: "Computador fechado. Porto, aqui vou eu.", icon: icons.moon } },
      6: { morning: { title: "Lazy Saturday", message: "Pequeno-almoço tardio e zero notificações.", icon: icons.coffee }, afternoon: { title: "Exploração", message: "A descobrir novos cantos escondidos do Porto.", icon: icons.camera }, late: { title: "Golden Hour", message: "Câmara na mão e inspiração visual.", icon: icons.camera }, night: { title: "Night Out", message: "A viver a noite vibrante da Invicta.", icon: icons.moon } }
    };

    const updateClock = () => {
      const now = new Date();
      const t = now.toLocaleTimeString('pt-PT', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (clockEl) clockEl.textContent = t;
    };

    const updateStatus = () => {
      const now = new Date();
      let day = now.getDay();
      const hour = now.getHours();
      if (hour < 6) day = (day === 0) ? 6 : day - 1;
      let period = 'night';
      if (hour >= 6 && hour < 12) period = 'morning';
      else if (hour >= 12 && hour < 17) period = 'afternoon';
      else if (hour >= 17 && hour < 21) period = 'late';
      const current = statusMap[day][period];
      if (titleEl) titleEl.textContent = current.title;
      if (msgEl) msgEl.textContent = current.message;
      if (iconEl) iconEl.innerHTML = current.icon;
    };

    updateClock();
    updateStatus();
    window.__ptDynamicStatusIntervals.push(setInterval(updateClock, 1000));
    window.__ptDynamicStatusIntervals.push(setInterval(updateStatus, 60000));
  }

  /* ---- Hero Carousel ---- */
  function reinitHeroCarousel() {
    const slides  = Array.from(document.querySelectorAll('.carousel-slide'));
    const dots    = Array.from(document.querySelectorAll('.dot'));
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');

    if (!slides.length || !nextBtn || !prevBtn) return;

    // Kill previous autoplay
    if (window.__ptHeroAutoplay) clearInterval(window.__ptHeroAutoplay);

    let current = 0;
    let busy = false;

    const goTo = (newIdx) => {
      if (busy || newIdx === current) return;
      busy = true;
      dots[current]?.classList.remove('active');
      slides[current]?.classList.remove('active');
      dots[newIdx]?.classList.add('active');
      slides[newIdx]?.classList.add('active');
      current = newIdx;
      setTimeout(() => { busy = false; }, 1200);
    };

    // Clone buttons to remove stale listeners
    const newNext = nextBtn.cloneNode(true);
    const newPrev = prevBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);

    newNext.addEventListener('click', () => goTo((current + 1) % slides.length));
    newPrev.addEventListener('click', () => goTo((current - 1 + slides.length) % slides.length));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    const container = document.querySelector('.split-right');
    window.__ptHeroAutoplay = setInterval(() => goTo((current + 1) % slides.length), 10000);
    if (container) {
      container.addEventListener('mouseenter', () => clearInterval(window.__ptHeroAutoplay));
      container.addEventListener('mouseleave', () => {
        window.__ptHeroAutoplay = setInterval(() => goTo((current + 1) % slides.length), 10000);
      });
    }
  }

  /* ----------------------------------------------------------
     9. CLOSE SIDE DRAWER (utility)
  ---------------------------------------------------------- */
  function closeSideDrawer() {
    if (!document.body.classList.contains('nav-active')) return;
    document.body.classList.remove('nav-active');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    const trigger = document.getElementById('menuTrigger');
    if (trigger) {
      trigger.style.marginRight = '';
      trigger.setAttribute('aria-expanded', 'false');
    }
  }

  /* ----------------------------------------------------------
     10. LINK INTERCEPTION
  ---------------------------------------------------------- */
  function attachLinkListeners() {
    document.querySelectorAll('a').forEach(anchor => {
      if (anchor.dataset.ptBound) return;
      anchor.dataset.ptBound = '1';

      anchor.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!shouldIntercept(anchor)) return;
        e.preventDefault();
        const target = new URL(anchor.href, window.location.href).href;
        if (window.location.href === target) { closeSideDrawer(); return; }
        navigateTo(target);
      });
    });
  }

  /* ----------------------------------------------------------
     11. BROWSER BACK / FORWARD (popstate)
  ---------------------------------------------------------- */
  window.addEventListener('popstate', async () => {
    if (isTransitioning) return;
    isTransitioning = true;

    closeSideDrawer();
    const overlay = getOverlay();
    overlay.classList.remove('pt-revealing');
    overlay.classList.add('pt-covering');

    try {
      const targetUrl = window.location.href;
      const response = await fetch(targetUrl, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      if (!response.ok) { window.location.reload(); return; }

      const html = await response.text();
      const fetchedDoc = new DOMParser().parseFromString(html, 'text/html');

      await sleep(COVER_DURATION);

      // Swap without pushing another history entry
      const overlay2 = document.getElementById('page-transition-overlay');

      // Manage CSS for new page
      manageStylesheets(fetchedDoc, targetUrl);

      const newBody = fetchedDoc.body;
      const newBodyOverlay = newBody.querySelector('#page-transition-overlay');
      if (newBodyOverlay) newBodyOverlay.remove();

      document.body.innerHTML = newBody.innerHTML;
      document.body.appendChild(overlay2);

      document.body.removeAttribute('style');
      const newBodyStyle = newBody.getAttribute('style');
      if (newBodyStyle) document.body.setAttribute('style', newBodyStyle);

      const homePreloader = document.getElementById('home-preloader');
      if (homePreloader) {
        homePreloader.classList.add('preloader-instant-hide');
        document.body.style.overflow = '';
      }

      window.scrollTo(0, 0);

      document.title = fetchedDoc.title;

      executeInlineScripts(fetchedDoc.body);
      reinitExternalScripts();
      attachLinkListeners();

      await sleep(REVEAL_DELAY);
      overlay2.classList.remove('pt-covering');
      overlay2.classList.add('pt-revealing');

      setTimeout(() => {
        overlay2.classList.remove('pt-revealing');
        isTransitioning = false;
      }, 1400);

    } catch (err) {
      window.location.reload();
    }
  });

  /* ----------------------------------------------------------
     12. INIT
  ---------------------------------------------------------- */
  function init() {
    createOverlay();
    attachLinkListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
