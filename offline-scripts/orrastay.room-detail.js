/* room-detail.js from the live orrastay room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
class Slider {

    constructor(slider, autoSlideDelay = 4000) {

        this.slider = slider;

        this.display = slider.querySelector(".image-display");

        this.navButtons = Array.from(slider.querySelectorAll(".nav-button"));

        this.prevButton = slider.querySelector(".prev-button");

        this.nextButton = slider.querySelector(".next-button");

        this.sliderNavigation = slider.querySelector(".slider-navigation");

        this.currentSlideIndex = 0;

        this.preloadedImages = {};

        this.autoSlideDelay = autoSlideDelay;

        this.autoSlideInterval = null;



        this.initialize();

    }



    initialize() {

        this.setupSlider();

        this.preloadImages();

        this.eventListeners();

        this.startAutoSlide();

    }



    setupSlider() {

        this.showSlide(this.currentSlideIndex);

    }



    showSlide(index) {

        this.currentSlideIndex = index;



        const navButtonImg =

            this.navButtons[this.currentSlideIndex].querySelector("img");



        if (navButtonImg) {

            const imgClone = navButtonImg.cloneNode();

            this.display.replaceChildren(imgClone);

        }



        this.updateNavButtons();

    }



    updateNavButtons() {

        this.navButtons.forEach((button, buttonIndex) => {

            const isSelected = buttonIndex === this.currentSlideIndex;

            button.setAttribute("aria-selected", isSelected);



            // Prevent page scroll jump

            if (isSelected) {

                button.focus({ preventScroll: true });

            }

        });

    }



    preloadImages() {

        this.navButtons.forEach((button) => {

            const imgElement = button.querySelector("img");

            if (imgElement) {

                const imgSrc = imgElement.src;

                if (!this.preloadedImages[imgSrc]) {

                    this.preloadedImages[imgSrc] = new Image();

                    this.preloadedImages[imgSrc].src = imgSrc;

                }

            }

        });

    }



    eventListeners() {

        document.addEventListener("keydown", (event) => {

            this.pauseAutoSlide();

            this.handleAction(event.key);

            this.resumeAutoSlide();

        });



        this.sliderNavigation.addEventListener("click", (event) => {

            const targetButton = event.target.closest(".nav-button");

            const index = targetButton

                ? this.navButtons.indexOf(targetButton)

                : -1;



            if (index !== -1) {

                this.pauseAutoSlide();

                this.showSlide(index);

                this.resumeAutoSlide();

            }

        });



        this.prevButton.addEventListener("click", () => {

            this.pauseAutoSlide();

            this.handleAction("prev");

            this.resumeAutoSlide();

        });



        this.nextButton.addEventListener("click", () => {

            this.pauseAutoSlide();

            this.handleAction("next");

            this.resumeAutoSlide();

        });



        // Pause on hover

        this.slider.addEventListener("mouseenter", () => this.pauseAutoSlide());

        this.slider.addEventListener("mouseleave", () => this.resumeAutoSlide());

    }



    handleAction(action) {

        if (action === "Home") {

            this.currentSlideIndex = 0;

        } else if (action === "End") {

            this.currentSlideIndex = this.navButtons.length - 1;

        } else if (action === "ArrowRight" || action === "next") {

            this.currentSlideIndex =

                (this.currentSlideIndex + 1) % this.navButtons.length;

        } else if (action === "ArrowLeft" || action === "prev") {

            this.currentSlideIndex =

                (this.currentSlideIndex - 1 + this.navButtons.length) %

                this.navButtons.length;

        }



        this.showSlide(this.currentSlideIndex);

    }



    startAutoSlide() {

        this.autoSlideInterval = setInterval(() => {

            this.handleAction("next");

        }, this.autoSlideDelay);

    }



    pauseAutoSlide() {

        clearInterval(this.autoSlideInterval);

    }



    resumeAutoSlide() {

        this.pauseAutoSlide();

        this.startAutoSlide();

    }

}



// Initialize slider

const ImageSlider = new Slider(

    document.querySelector(".image-slider"),

    4000 // auto slide delay (ms)

);
