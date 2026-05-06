/* assets/js/hero-carousel.js */

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let isTransitioning = false;

    function updateCarousel(newIndex) {
        if (isTransitioning || newIndex === currentIndex) return;
        isTransitioning = true;

        // Update dots
        dots[currentIndex].classList.remove('active');
        dots[newIndex].classList.add('active');

        // Transition slides
        slides[currentIndex].classList.remove('active');
        slides[newIndex].classList.add('active');

        currentIndex = newIndex;

        // Reset transition flag after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 1200); // Matches CSS transition duration
    }

    function showNext() {
        const nextIndex = (currentIndex + 1) % totalSlides;
        updateCarousel(nextIndex);
    }

    function showPrev() {
        const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel(prevIndex);
    }

    // Event Listeners
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
        });
    });

    // Auto-advance every 6 seconds
    let autoPlay = setInterval(showNext, 6000);

    // Pause auto-play on interaction
    const container = document.querySelector('.split-right');
    container.addEventListener('mouseenter', () => clearInterval(autoPlay));
    container.addEventListener('mouseleave', () => {
        autoPlay = setInterval(showNext, 6000);
    });
});
