/* assets/js/lightbox.js */
// Lightbox logic for expanding project images

window.initLightbox = function() {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (!lightboxModal || !lightboxImage) return;

    // Use dataset to store zoom and drag state to avoid closure issues on re-init
    lightboxModal.dataset.isZoomed = "false";
    lightboxModal.dataset.isDragging = "false";
    lightboxModal.dataset.dragMoved = "false";
    
    let startX, startY;
    let currentTranslateX = 0, currentTranslateY = 0;
    let initialTranslateX = 0, initialTranslateY = 0;
    
    // Find all images that should trigger the lightbox
    const triggers = document.querySelectorAll('.lightbox-trigger');
    
    // Remove old listeners by cloning triggers? No, just assign onclick to avoid duplicates
    triggers.forEach(trigger => {
        trigger.onclick = (e) => {
            e.preventDefault();
            let imgSrc = '';
            if (trigger.tagName === 'IMG') {
                imgSrc = trigger.src;
            } else {
                const img = trigger.querySelector('img');
                if (img) imgSrc = img.src;
            }
            
            if (imgSrc) {
                lightboxImage.src = imgSrc;
                lightboxModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                lightboxModal.dataset.isZoomed = "false";
                lightboxImage.classList.remove('zoomed-in');
                lightboxImage.style.transform = '';
                currentTranslateX = 0;
                currentTranslateY = 0;
            }
        };
    });

    lightboxImage.onmousedown = (e) => {
        if (lightboxModal.dataset.isZoomed !== "true") return;
        e.preventDefault();
        lightboxModal.dataset.isDragging = "true";
        lightboxModal.dataset.dragMoved = "false";
        startX = e.clientX;
        startY = e.clientY;
        initialTranslateX = currentTranslateX;
        initialTranslateY = currentTranslateY;
        lightboxImage.style.transition = 'none';
    };

    window.addEventListener('mousemove', (e) => {
        if (lightboxModal.dataset.isDragging !== "true" || lightboxModal.dataset.isZoomed !== "true") return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            lightboxModal.dataset.dragMoved = "true";
        }
        
        currentTranslateX = initialTranslateX + dx;
        currentTranslateY = initialTranslateY + dy;
        lightboxImage.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(1.5)`;
    });

    window.addEventListener('mouseup', () => {
        if (lightboxModal.dataset.isDragging === "true") {
            lightboxModal.dataset.isDragging = "false";
            lightboxImage.style.transition = 'transform 0.1s ease-out';
        }
    });

    lightboxImage.onclick = (e) => {
        e.stopPropagation();
        if (lightboxModal.dataset.dragMoved === "true") {
            lightboxModal.dataset.dragMoved = "false";
            return;
        }

        const currentlyZoomed = lightboxModal.dataset.isZoomed === "true";
        lightboxModal.dataset.isZoomed = (!currentlyZoomed).toString();
        
        if (!currentlyZoomed) {
            lightboxImage.classList.add('zoomed-in');
            lightboxImage.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            lightboxImage.style.transform = 'translate(0px, 0px) scale(1.5)';
            currentTranslateX = 0;
            currentTranslateY = 0;
        } else {
            lightboxImage.classList.remove('zoomed-in');
            lightboxImage.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            lightboxImage.style.transform = '';
            currentTranslateX = 0;
            currentTranslateY = 0;
        }
    };
    
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
        currentTranslateX = 0;
        currentTranslateY = 0;
    };
    
    const closeBtn = lightboxModal.querySelector('.lightbox-close');
    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.closeLightbox();
        };
    }
    
    lightboxModal.onclick = (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
            window.closeLightbox();
        }
    };
    
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('lightboxModal');
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            window.closeLightbox();
        }
    });
};

document.addEventListener('DOMContentLoaded', window.initLightbox);
