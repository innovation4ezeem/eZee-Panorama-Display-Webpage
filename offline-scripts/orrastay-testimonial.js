/* Guest reviews slider (arrows and dots), copied from the live orrastay site: https://ezeedemo.com/orrastay/testimonial.js
   Inlined into every page of the site by offline_links.py; only runs where the reviews slider is. */
if (!(document.querySelector('.testimonial-slider') && document.querySelector('.testimonial-card'))) return;

class TestimonialSlider {
    constructor() {
        this.slider = document.querySelector('.testimonial-slider');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');

        if (!this.slider || this.cards.length === 0) return;

        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 seconds

        this.init();
    }

    init() {
        // Button events (safe check)
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prev();
                this.restartAutoPlay();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.next();
                this.restartAutoPlay();
            });
        }

        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goTo(index);
                this.restartAutoPlay();
            });
        });

        // Auto scroll
        this.startAutoPlay();

        // Pause on hover
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());

        this.update();
    }

    update() {
        this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    prev() {
        this.currentIndex =
            (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.update();
    }

    next() {
        this.currentIndex =
            (this.currentIndex + 1) % this.cards.length;
        this.update();
    }

    goTo(index) {
        this.currentIndex = index;
        this.update();
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    restartAutoPlay() {
        this.startAutoPlay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TestimonialSlider();
});