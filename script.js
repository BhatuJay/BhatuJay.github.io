// This function initializes a slider. It can be reused for any number of sliders.
function initializeSlider(sliderId, options = {}) {
    // Default options for autoplay
    const { autoplay = true, interval = 3000 } = options;

    const slider = document.getElementById(sliderId);
    if (!slider) return; // Exit if the slider element doesn't exist

    // Get all necessary elements within the specific slider
    const wrapper = slider.querySelector('.slider-wrapper');
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    const dotsContainer = slider.querySelector('.dots-container');
    const originalSlides = Array.from(wrapper.children);
    const slideCount = originalSlides.length;

    let currentIndex = 1; // Start on the first "real" slide, not the cloned one
    let slideInterval;
    let isTransitioning = false; // Flag to prevent clicks during animation

    // Don't initialize if there's only one slide or fewer
    if (slideCount <= 1) {
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // --- Infinite Loop Setup ---
    // Clone the first and last slides for the seamless loop effect
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[slideCount - 1].cloneNode(true);

    // Add the clones to the beginning and end of the wrapper
    wrapper.appendChild(firstClone);
    wrapper.insertBefore(lastClone, originalSlides[0]);

    // Set the initial position to the first "real" slide
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

    // --- Create Navigation Dots ---
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            if (isTransitioning) return; // Prevent dot click during transition
            currentIndex = i + 1; // Go to the corresponding "real" slide
            moveToSlide();
        });
        dotsContainer.appendChild(dot);
    }
    const dots = Array.from(dotsContainer.children);

    // --- Core Slider Functions ---
    const moveToSlide = () => {
        isTransitioning = true; // Set the flag to true when transition starts
        wrapper.style.transition = 'transform 0.5s ease-in-out';
        wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
        resetAutoplay();
    };

    const moveToNext = () => {
        if (isTransitioning) return; // Check the flag before moving
        if (document.hidden) return; // Pause slider if tab is not active
        currentIndex++;
        moveToSlide();
    };

    const moveToPrev = () => {
        if (isTransitioning) return; // Check the flag before moving
        currentIndex--;
        moveToSlide();
    };

    // Function to update which dot is 'active'
    const updateDots = () => {
        let realIndex = currentIndex - 1;
        if (currentIndex === 0) { // On the cloned last slide
            realIndex = slideCount - 1;
        } else if (currentIndex === slideCount + 1) { // On the cloned first slide
            realIndex = 0;
        }

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === realIndex);
        });
    };

    // --- Autoplay Functionality ---
    const startAutoplay = () => {
        if (!autoplay) return;
        slideInterval = setInterval(moveToNext, interval);
    };

    const resetAutoplay = () => {
        clearInterval(slideInterval);
        startAutoplay();
    };

    // --- Event Listeners ---
    nextBtn.addEventListener('click', moveToNext);
    prevBtn.addEventListener('click', moveToPrev);

    // This listener handles the "jump" for the infinite loop after a transition ends
    wrapper.addEventListener('transitionend', () => {
        // If we've landed on the clone of the first slide (at the end)
        if (currentIndex === slideCount + 1) {
            wrapper.style.transition = 'none'; // Disable transition for the jump
            currentIndex = 1; // Jump back to the real first slide
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        // If we've landed on the clone of the last slide (at the beginning)
        if (currentIndex === 0) {
            wrapper.style.transition = 'none'; // Disable transition for the jump
            currentIndex = slideCount; // Jump back to the real last slide
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        isTransitioning = false; // Reset the flag after the transition is complete
    });

    // Pause autoplay on hover
    slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider.addEventListener('mouseleave', startAutoplay);
    
    // Pause slider if the page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(slideInterval);
        } else {
            startAutoplay();
        }
    });

    // --- Initialization ---
    updateDots(); // Set the initial active dot
    startAutoplay(); // Start the autoplay feature
}

// Initialize both sliders when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSlider('slider1', { autoplay: true, interval: 3500 });
    initializeSlider('slider2', { autoplay: true, interval: 4000 });
});