/* assets/js/lightbox.js */
// Lightbox logic for expanding project images

document.addEventListener('DOMContentLoaded', () => {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    
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
            }
        });
    });
    
    // Close logic
    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
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
