/* Guest reviews slider (arrows and dots), copied from the live thehivestay site: https://ezeedemo.com/alara/thehivestay-testimonial.js
   Inlined into every page of the site by offline_links.py; only runs where the reviews slider is. */
if (!(document.querySelector('.testimonial-slider') && document.querySelector('.ts-next'))) return;

document.addEventListener("DOMContentLoaded", function () {

    const slider = document.querySelector(".testimonial-slider");
    const cards = document.querySelectorAll(".testimonial-card");
    const prevBtn = document.querySelector(".ts-prev");
    const nextBtn = document.querySelector(".ts-next");

    let currentIndex = 0;
    const totalSlides = cards.length;

    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

});