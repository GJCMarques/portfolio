/* assets/js/menu.js */

document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('menuTrigger');
    const overlay = document.getElementById('drawerOverlay');
    const drawer = document.getElementById('sideDrawer');
    
    if (trigger && drawer) {
        // Get scrollbar width for compensation
        const getScrollbarWidth = () => {
            return window.innerWidth - document.documentElement.clientWidth;
        };

        // Toggle Menu
        const toggleMenu = () => {
            const isActive = !document.body.classList.contains('nav-active');
            const scrollWidth = getScrollbarWidth();
            
            if (isActive) {
                document.body.classList.add('nav-active');
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = `${scrollWidth}px`;
                // Compensate fixed elements
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
                if (document.body.classList.contains('nav-active')) {
                    toggleMenu();
                }
            });
        }

        // Close on link click
        const links = document.querySelectorAll('.drawer-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('nav-active');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                trigger.style.marginRight = '';
                trigger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-active')) {
                toggleMenu();
            }
        });

        // Adaptive Trigger Color Logic (Scroll-based for absolute precision)
        const darkSections = document.querySelectorAll('.is-dark');
        
        if (darkSections.length > 0) {
            const updateTriggerColor = () => {
                if (document.body.classList.contains('nav-active')) return;

                const triggerRect = trigger.getBoundingClientRect();
                const triggerCenterY = triggerRect.top + (triggerRect.height / 2);
                
                let isOverDark = false;
                
                darkSections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    // Dividers are 100px high and extend outside the section
                    const darkTop = rect.top - 100;
                    const darkBottom = rect.bottom + 100;

                    if (triggerCenterY >= darkTop && triggerCenterY <= darkBottom) {
                        isOverDark = true;
                    }
                });
                
                if (isOverDark) {
                    trigger.classList.add('is-over-dark');
                } else {
                    trigger.classList.remove('is-over-dark');
                }
            };

            window.addEventListener('scroll', updateTriggerColor, { passive: true });
            window.addEventListener('resize', updateTriggerColor);
            updateTriggerColor();
        }
    }
});
