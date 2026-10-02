/* roomdetail.js from the live hotelova room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
const carousel = document.getElementById('carousel');

const prevBtn = document.getElementById('prevBtn');

const nextBtn = document.getElementById('nextBtn');

const bulletsContainer = document.getElementById('bullets');

const autoplayToggle = document.getElementById('autoplayToggle');

const progressBar = document.getElementById('progressBar');



let currentSlide = 0;

const slides = document.querySelectorAll('.slide');

const slideCount = slides.length;



let autoplayInterval;

const autoplayDelay = 4000;

let progressInterval;

let autoplayActive = true;

let progressWidth = 0;

let allBullets = [];



function createBullets() {

    bulletsContainer.innerHTML = '';

    allBullets = [];



    for (let i = 0; i < slideCount; i++) {

        const bullet = document.createElement('span');

        bullet.classList.add('bullet');

        bullet.setAttribute('data-index', i);



        bullet.addEventListener('click', function () {

            goToSlide(i);

        });



        bulletsContainer.appendChild(bullet);

        allBullets.push(bullet);

    }

}



function initCarousel() {

    createBullets();

    updateCarousel();

    startAutoplay();



    prevBtn.addEventListener('click', showPrevSlide);

    nextBtn.addEventListener('click', showNextSlide);



    autoplayToggle.addEventListener('click', function () {

        this.classList.toggle('active');

        autoplayActive = this.classList.contains('active');



        if (autoplayActive) {

            startAutoplay();

        } else {

            stopAutoplay();

            progressBar.style.width = '0%';

        }

    });



    carousel.addEventListener('mouseenter', function () {

        stopAutoplay();

        clearInterval(progressInterval);

    });



    carousel.addEventListener('mouseleave', function () {

        if (autoplayActive) {

            startAutoplay();

        }

    });



    let touchStartX = 0;

    let touchEndX = 0;



    carousel.addEventListener('touchstart', function (e) {

        touchStartX = e.changedTouches[0].screenX;

    });



    carousel.addEventListener('touchend', function (e) {

        touchEndX = e.changedTouches[0].screenX;

        handleSwipe();

    });



    function handleSwipe() {

        const swipeThreshold = 50;

        const difference = touchStartX - touchEndX;



        if (Math.abs(difference) > swipeThreshold) {

            if (difference > 0) {

                showNextSlide();

            } else {

                showPrevSlide();

            }

        }

    }

}



function updateCarousel() {

    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;



    allBullets.forEach((bullet, index) => {

        bullet.classList.toggle('active', index === currentSlide);

    });



    progressWidth = 0;

    progressBar.style.width = '0%';

}



function showNextSlide() {

    currentSlide = (currentSlide + 1) % slideCount;

    updateCarousel();

    resetAutoplay();

}



function showPrevSlide() {

    currentSlide = (currentSlide - 1 + slideCount) % slideCount;

    updateCarousel();

    resetAutoplay();

}



function goToSlide(slideIndex) {

    currentSlide = slideIndex;

    updateCarousel();

    resetAutoplay();

}



function startAutoplay() {

    stopAutoplay();

    progressWidth = 0;



    autoplayInterval = setInterval(function () {

        showNextSlide();

    }, autoplayDelay);



    progressInterval = setInterval(function () {

        progressWidth += (100 / (autoplayDelay / 100));

        progressBar.style.width = `${progressWidth}%`;



        if (progressWidth >= 100) {

            clearInterval(progressInterval);

        }

    }, 100);

}



function stopAutoplay() {

    clearInterval(autoplayInterval);

    clearInterval(progressInterval);

}



function resetAutoplay() {

    if (autoplayActive) {

        stopAutoplay();

        startAutoplay();

    }

}



document.addEventListener('keydown', function (event) {

    if (event.key === 'ArrowLeft') {

        showPrevSlide();

    } else if (event.key === 'ArrowRight') {

        showNextSlide();

    } else if (event.key === ' ') {

        autoplayToggle.click();

    }

});



window.addEventListener('DOMContentLoaded', initCarousel);



window.addEventListener('load', function () {

    document.querySelectorAll('.slide img').forEach(img => {

        img.style.opacity = '1';

    });

});
