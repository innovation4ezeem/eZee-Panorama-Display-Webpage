/* room-inner.js from the live hotelwow room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
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

    if (!bulletsContainer) return;



    bulletsContainer.innerHTML = '';

    allBullets = [];



    for (let i = 0; i < slideCount; i++) {

        const bullet = document.createElement('span');

        bullet.className = 'bullet';

        bullet.setAttribute('data-index', i);



        bullet.addEventListener('click', function () {

            goToSlide(i);

        });



        bulletsContainer.appendChild(bullet);

        allBullets.push(bullet);

    }

}



function initCarousel() {

    if (!carousel || !slides.length) return;



    createBullets();

    updateCarousel();

    startAutoplay();



    if (prevBtn) prevBtn.addEventListener('click', showPrevSlide);

    if (nextBtn) nextBtn.addEventListener('click', showNextSlide);



    if (autoplayToggle) {

        autoplayToggle.addEventListener('click', function () {

            this.classList.toggle('active');

            autoplayActive = this.classList.contains('active');



            if (autoplayActive) {

                startAutoplay();

            } else {

                stopAutoplay();

                if (progressBar) progressBar.style.width = '0%';

            }

        });

    }



    carousel.addEventListener('mouseenter', function () {

        stopAutoplay();

        clearInterval(progressInterval);

    });



    carousel.addEventListener('mouseleave', function () {

        if (autoplayActive) startAutoplay();

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

        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {

            diff > 0 ? showNextSlide() : showPrevSlide();

        }

    }

}



function updateCarousel() {

    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;



    allBullets.forEach((bullet, index) => {

        bullet.classList.toggle('active', index === currentSlide);

    });



    progressWidth = 0;

    if (progressBar) progressBar.style.width = '0%';

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



function goToSlide(index) {

    currentSlide = index;

    updateCarousel();

    resetAutoplay();

}



function startAutoplay() {

    stopAutoplay();

    progressWidth = 0;



    autoplayInterval = setInterval(showNextSlide, autoplayDelay);



    if (progressBar) {

        progressInterval = setInterval(() => {

            progressWidth += (100 / (autoplayDelay / 100));

            progressBar.style.width = `${progressWidth}%`;



            if (progressWidth >= 100) clearInterval(progressInterval);

        }, 100);

    }

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

    if (event.key === 'ArrowLeft') showPrevSlide();

    if (event.key === 'ArrowRight') showNextSlide();

    if (event.key === ' ' && autoplayToggle) autoplayToggle.click();

});



window.addEventListener('DOMContentLoaded', initCarousel);



window.addEventListener('load', function () {

    document.querySelectorAll('.slide img').forEach(img => {

        img.style.opacity = '1';

    });

});



document.addEventListener("DOMContentLoaded", () => {

    const buttons = [

        { id: "prevBtn", label: "Previous slide" },

        { id: "nextBtn", label: "Next slide" }

    ];



    buttons.forEach(btn => {

        const el = document.getElementById(btn.id);

        if (el && !el.getAttribute("aria-label")) {

            el.setAttribute("aria-label", btn.label);

        }

    });

});



const tmnCards = document.querySelectorAll('.tmn-card');

const tmnDotsContainer = document.querySelector('.tmn-dots');

const tmnPrevBtn = document.querySelector('.tmn-prev-btn');

const tmnNextBtn = document.querySelector('.tmn-next-btn');



let tmnCurrent = 0;

const tmnTotal = tmnCards.length;

let tmnAutoPlay;

let tmnDots = [];



function createTmnDots() {

  tmnDotsContainer.innerHTML = '';

  tmnDots = [];



  for (let i = 0; i < tmnTotal; i++) {

    const dot = document.createElement('span');

    dot.classList.add('tmn-dot');

    dot.setAttribute('data-index', i);



    dot.addEventListener('click', () => {

      tmnCurrent = i;

      tmnUpdateCards();

    });



    tmnDotsContainer.appendChild(dot);

    tmnDots.push(dot);

  }

}



function tmnUpdateCards() {

  tmnCards.forEach((card, index) => {

    const diff = (index - tmnCurrent + tmnTotal) % tmnTotal;



    if (diff === 0) {

      card.className = 'tmn-card active';

    } else if (diff === 1) {

      card.className = 'tmn-card next';

    } else if (diff === tmnTotal - 1) {

      card.className = 'tmn-card prev';

    } else {

      card.className = 'tmn-card';

      card.style.display = 'none';

    }



    card.style.display = 'block';

    card.style.zIndex = tmnTotal - diff;

  });



  tmnDots.forEach((dot, index) => {

    dot.classList.toggle('active', index === tmnCurrent);

  });



  tmnResetAutoPlay();

}



function tmnNext() {

  tmnCurrent = (tmnCurrent + 1) % tmnTotal;

  tmnUpdateCards();

}



function tmnPrev() {

  tmnCurrent = (tmnCurrent - 1 + tmnTotal) % tmnTotal;

  tmnUpdateCards();

}



function tmnStartAutoPlay() {

  tmnAutoPlay = setInterval(tmnNext, 4000);

}



function tmnResetAutoPlay() {

  clearInterval(tmnAutoPlay);

  tmnStartAutoPlay();

}



function initTmnSlider() {

  createTmnDots();

  tmnUpdateCards();

  tmnStartAutoPlay();



  tmnPrevBtn?.addEventListener('click', tmnPrev);

  tmnNextBtn?.addEventListener('click', tmnNext);



  tmnCards.forEach(card => {

    card.addEventListener('mouseenter', () => clearInterval(tmnAutoPlay));

    card.addEventListener('mouseleave', tmnStartAutoPlay);

  });

}



window.addEventListener('DOMContentLoaded', initTmnSlider);



function safeAddEventListener(selector, event, callback){

  const element = document.querySelector(selector);

  if(element){

    element.addEventListener(event, callback);

  }

}
