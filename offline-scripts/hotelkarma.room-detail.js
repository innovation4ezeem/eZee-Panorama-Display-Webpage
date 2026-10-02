/* rooms-detail-s.js from the live hotelkarma room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
document.addEventListener("DOMContentLoaded", function () {

    const grid = document.getElementById("imageGrid");
    const dotsContainer = document.getElementById("sliderDots");
    const images = grid.querySelectorAll("img");

    if (!grid || !dotsContainer || !images.length) return;

    let currentIndex = 0;

    function getImagesPerSlide() {
        return window.innerWidth <= 768 ? 1 : 4;
    }

    function getGap() {
        return parseInt(window.getComputedStyle(grid).gap) || 0;
    }

    function createDots() {
        dotsContainer.innerHTML = "";

        const perSlide = getImagesPerSlide();
        const totalSlides = Math.ceil(images.length / perSlide);

        for (let i = 0; i < totalSlides; i++) {

            const dot = document.createElement("span");

            dot.className = "slider-dot";
            dot.setAttribute("role", "button");
            dot.setAttribute("tabindex", "0");
            dot.setAttribute("aria-label", "Go to slide " + (i + 1));

            if (i === currentIndex) {
                dot.classList.add("active");
                dot.setAttribute("aria-current", "true");
            } else {
                dot.setAttribute("aria-current", "false");
            }

            dot.addEventListener("click", function () {
                currentIndex = i;
                updateSlider();
            });

            dot.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    currentIndex = i;
                    updateSlider();
                }
            });

            dotsContainer.appendChild(dot);
        }
    }

    function updateSlider() {
        const perSlide = getImagesPerSlide();
        const gap = getGap();
        const singleWidth = images[0].offsetWidth;

        const slideWidth =
            (singleWidth * perSlide) + (gap * (perSlide - 1));

        const moveAmount = currentIndex * (slideWidth + gap);

        grid.style.transform = "translateX(-" + moveAmount + "px)";

        dotsContainer.querySelectorAll(".slider-dot").forEach(function (dot, index) {
            const active = index === currentIndex;

            dot.classList.toggle("active", active);
            dot.setAttribute("aria-current", active ? "true" : "false");
        });
    }

    window.addEventListener("resize", function () {
        currentIndex = 0;
        createDots();
        updateSlider();
    });

    createDots();
    updateSlider();

});
