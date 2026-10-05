/* Room slider (Available Rooms arrows and dots), copied from the live thehivestay site: https://ezeedemo.com/alara/thehivestay-room.js
   Inlined into every page of the site by offline_links.py; does nothing on pages without the slider. */
if (!document.getElementById('roomsSliderTrack')) return;

document.addEventListener('DOMContentLoaded', function () {

const track = document.getElementById('roomsSliderTrack');
const cards = document.querySelectorAll('.room-card');
const prevBtn = document.getElementById('roomsPrevBtn');
const nextBtn = document.getElementById('roomsNextBtn');
const dotsWrap = document.querySelector('.room-dots');

let currentIndex = 0;
const cardCount = cards.length;

function getGap(){
    return parseInt(window.getComputedStyle(track).gap) || 0;
}

function getCardsPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

function createIndicators() {

    dotsWrap.innerHTML = '';

    const cardsPerView = getCardsPerView();
    const dotCount = Math.max(1, cardCount - cardsPerView + 1);

    for (let i = 0; i < dotCount; i++) {

        const dot = document.createElement('span');
        dot.className = 'dot';

        if (i === currentIndex) {
            dot.classList.add('active');
        }

        dot.addEventListener('click', function () {
            currentIndex = i;
            updateTrack();
        });

        dotsWrap.appendChild(dot);
    }
}

function updateTrack() {

    const cardsPerView = getCardsPerView();
    const cardWidth = cards[0].offsetWidth;
    const gap = getGap();

    const maxIndex = Math.max(0, cardCount - cardsPerView);

    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    document.querySelectorAll('.room-dots .dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });

}

function nextSlide() {

    const maxIndex = cardCount - getCardsPerView();

    if(currentIndex < maxIndex){
        currentIndex++;
    } else {
        currentIndex = 0;
    }

    updateTrack();
}

function prevSlide() {

    const maxIndex = cardCount - getCardsPerView();

    if(currentIndex > 0){
        currentIndex--;
    } else {
        currentIndex = maxIndex;
    }

    updateTrack();
}

if(prevBtn){
    prevBtn.addEventListener('click', prevSlide);
}

if(nextBtn){
    nextBtn.addEventListener('click', nextSlide);
}

let resizeTimer;

window.addEventListener('resize', function(){

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function(){

        createIndicators();
        updateTrack();

    },200);

});

createIndicators();
updateTrack();

});