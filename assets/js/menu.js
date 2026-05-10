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

        // Adaptive Trigger Color Logic (Intersection Observer)
        const darkSections = document.querySelectorAll('.is-dark');
        
        if (darkSections.length > 0) {
            const observerOptions = {
                // Check if dark section is in the top 100px of viewport (where button lives)
                rootMargin: '-64px 0px -90% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        trigger.classList.add('is-over-dark');
                    } else {
                        // Check if ANY other dark section is still intersecting
                        const anyDarkVisible = Array.from(darkSections).some(section => {
                            const rect = section.getBoundingClientRect();
                            return rect.top <= 100 && rect.bottom >= 64;
                        });
                        if (!anyDarkVisible) {
                            trigger.classList.remove('is-over-dark');
                        }
                    }
                });
            }, observerOptions);

            darkSections.forEach(section => observer.observe(section));
        }
    }
});
