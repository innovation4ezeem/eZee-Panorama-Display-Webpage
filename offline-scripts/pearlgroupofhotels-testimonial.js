/* Guest reviews slider (arrows and dots), copied from the live pearlgroupofhotels site: https://ezeedemo.com/alara/testimonial.js
   Inlined into every page of the site by offline_links.py; only runs where the reviews slider is. */
if (!(document.querySelector('.testimonial-slider') && document.querySelector('.ts-next'))) return;

document.addEventListener("DOMContentLoaded", function () {

    const slider = document.querySelector(".testimonial-slider");
    const cards = document.querySelectorAll(".testimonial-card");
    const prevBtn = document.querySelector(".ts-prev");
    const nextBtn = document.querySelector(".ts-next");
    const dotsWrapper = document.querySelector(".ts-dots");

    let currentIndex = 0;
    const totalSlides = cards.length;

    cards.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.classList.add("ts-dot");
        if (index === 0) dot.classList.add("ts-dot-active");
        dot.addEventListener("click", () => {
            currentIndex = index;
            updateSlider();
        });
        dotsWrapper.appendChild(dot);
    });

    const dots = dotsWrapper.querySelectorAll(".ts-dot");

    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle("ts-dot-active", index === currentIndex);
        });
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