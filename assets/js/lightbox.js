/* assets/js/lightbox.js */
// Lightbox logic for expanding project images

document.addEventListener('DOMContentLoaded', () => {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    let isZoomed = false;
    let isDragging = false;
    let dragMoved = false;
    let startX, startY;
    let currentTranslateX = 0, currentTranslateY = 0;
    let initialTranslateX = 0, initialTranslateY = 0;
    
    if (!lightboxModal || !lightboxImage) return;
    
    // Find all images that should trigger the lightbox
    const triggers = document.querySelectorAll('.lightbox-trigger');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            // If the trigger is an image itself, use its src. 
            // If it's a container, find the img inside.
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
                document.body.style.overflow = 'hidden'; // Prevent scrolling in the background
                isZoomed = false;
                lightboxImage.classList.remove('zoomed-in');
                lightboxImage.style.transform = '';
                currentTranslateX = 0;
                currentTranslateY = 0;
            }
        });
    });

    lightboxImage.addEventListener('mousedown', (e) => {
        if (!isZoomed) return;
        e.preventDefault();
        isDragging = true;
        dragMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        initialTranslateX = currentTranslateX;
        initialTranslateY = currentTranslateY;
        lightboxImage.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging || !isZoomed) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            dragMoved = true;
        }
        
        currentTranslateX = initialTranslateX + dx;
        currentTranslateY = initialTranslateY + dy;
        lightboxImage.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(1.5)`;
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            lightboxImage.style.transition = 'transform 0.1s ease-out';
        }
    });

    // Toggle zoom on image click
    lightboxImage.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dragMoved) {
            dragMoved = false;
            return;
        }

        isZoomed = !isZoomed;
        if (isZoomed) {
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
    });
    
    // Close logic
    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
        isZoomed = false;
        lightboxImage.classList.remove('zoomed-in');
        lightboxImage.style.transform = '';
        currentTranslateX = 0;
        currentTranslateY = 0;
        setTimeout(() => {
            lightboxImage.src = '';
        }, 300); // wait for fade out before clearing src
    };
    
    // Close on clicking the close button
    const closeBtn = lightboxModal.querySelector('.lightbox-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    // Close on clicking the background (outside the image)
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });
});
