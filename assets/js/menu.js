/* assets/js/menu.js */

document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('menuTrigger');
    const overlay = document.getElementById('drawerOverlay');
    const drawer = document.getElementById('sideDrawer');
    
    if (trigger && drawer) {
        // Toggle Menu
        const toggleMenu = () => {
            document.body.classList.toggle('nav-active');
            const isActive = document.body.classList.contains('nav-active');
            trigger.setAttribute('aria-expanded', isActive);
            
            // Lock scroll
            document.body.style.overflow = isActive ? 'hidden' : '';
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
                trigger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-active')) {
                toggleMenu();
            }
        });
    }
});
