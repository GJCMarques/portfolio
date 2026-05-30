/* assets/js/lightbox.js */
// Lightbox logic for expanding project images

// Global state for drag and zoom
window._lbCurrentTranslateX = 0;
window._lbCurrentTranslateY = 0;
let _lbStartX = 0;
let _lbStartY = 0;
let _lbInitialTranslateX = 0;
let _lbInitialTranslateY = 0;

// Global close logic
window.closeLightbox = () => {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
    if (modal) modal.dataset.isZoomed = "false";
    if (img) {
        img.classList.remove('zoomed-in');
        img.style.transform = '';
        setTimeout(() => { img.src = ''; }, 300);
    }
    window._lbCurrentTranslateX = 0;
    window._lbCurrentTranslateY = 0;
};

// Global Event Delegation for Lightbox (AJAX-safe, no binding needed)
document.addEventListener('click', (e) => {
    let target = e.target;
    if (!target || typeof target.closest !== 'function') return;

    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    if (!modal || !img) return;

    // 1. OPEN LIGHTBOX
    const trigger = target.closest('.lightbox-trigger');
    if (trigger) {
        e.preventDefault();
        let imgSrc = '';
        if (trigger.tagName === 'IMG') {
            imgSrc = trigger.src;
        } else {
            const innerImg = trigger.querySelector('img');
            if (innerImg) imgSrc = innerImg.src;
        }
        
        if (imgSrc) {
            img.src = imgSrc;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            modal.dataset.isZoomed = "false";
            modal.dataset.isDragging = "false";
            modal.dataset.dragMoved = "false";
            img.classList.remove('zoomed-in');
            img.style.transform = '';
            window._lbCurrentTranslateX = 0;
            window._lbCurrentTranslateY = 0;
        }
        return;
    }

    // 2. CLOSE LIGHTBOX
    if (modal.classList.contains('active')) {
        // If clicked on cross
        if (target.closest('.lightbox-close')) {
            e.preventDefault();
            e.stopPropagation();
            window.closeLightbox();
            return;
        }
        
        // If clicked on background
        if (target === modal || target.classList.contains('lightbox-content')) {
            window.closeLightbox();
            return;
        }
        
        // If clicked on the image to toggle zoom
        if (target === img) {
            e.stopPropagation();
            if (modal.dataset.dragMoved === "true") {
                modal.dataset.dragMoved = "false";
                return;
            }

            const currentlyZoomed = modal.dataset.isZoomed === "true";
            modal.dataset.isZoomed = (!currentlyZoomed).toString();
            
            if (!currentlyZoomed) {
                img.classList.add('zoomed-in');
                img.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                img.style.transform = 'translate(0px, 0px) scale(1.5)';
                window._lbCurrentTranslateX = 0;
                window._lbCurrentTranslateY = 0;
            } else {
                img.classList.remove('zoomed-in');
                img.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                img.style.transform = '';
                window._lbCurrentTranslateX = 0;
                window._lbCurrentTranslateY = 0;
            }
        }
    }
});

// Drag and Drop Logic for Zoomed Image
document.addEventListener('mousedown', (e) => {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    if (!modal || !img || !modal.classList.contains('active')) return;
    
    if (e.target === img && modal.dataset.isZoomed === "true") {
        e.preventDefault();
        modal.dataset.isDragging = "true";
        modal.dataset.dragMoved = "false";
        _lbStartX = e.clientX;
        _lbStartY = e.clientY;
        _lbInitialTranslateX = window._lbCurrentTranslateX;
        _lbInitialTranslateY = window._lbCurrentTranslateY;
        img.style.transition = 'none';
    }
});

document.addEventListener('mousemove', (e) => {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    if (!modal || !img) return;

    if (modal.dataset.isDragging === "true" && modal.dataset.isZoomed === "true") {
        const dx = e.clientX - _lbStartX;
        const dy = e.clientY - _lbStartY;
        
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            modal.dataset.dragMoved = "true";
        }
        
        window._lbCurrentTranslateX = _lbInitialTranslateX + dx;
        window._lbCurrentTranslateY = _lbInitialTranslateY + dy;
        img.style.transform = `translate(${window._lbCurrentTranslateX}px, ${window._lbCurrentTranslateY}px) scale(1.5)`;
    }
});

document.addEventListener('mouseup', () => {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    if (modal && modal.dataset.isDragging === "true") {
        modal.dataset.isDragging = "false";
        if (img) img.style.transition = 'transform 0.1s ease-out';
    }
});

document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightboxModal');
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        window.closeLightbox();
    }
});

