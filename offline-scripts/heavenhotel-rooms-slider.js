/* Room slider (Available Rooms arrows and dots), copied from the live heavenhotel site: https://ezeedemo.com/heavenhotel/room.js
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
    const GAP = 15;

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
            if (i === currentIndex) dot.classList.add('active');

            dot.addEventListener('click', () => {
                currentIndex = i;
                updateTrack();
            });

            dotsWrap.appendChild(dot);
        }
    }

    function updateButtons() {
        const maxIndex = cardCount - getCardsPerView();

        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= maxIndex;
    }

    function updateTrack() {
        const cardsPerView = getCardsPerView();
        const cardWidth = cards[0].offsetWidth;
        const maxIndex = Math.max(0, cardCount - cardsPerView);

        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;

        const offset = currentIndex * (cardWidth + GAP);
        track.style.transform = `translateX(-${offset}px)`;

        dotsWrap.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        updateButtons(); // update button state
    }

    function nextSlide() {
        const maxIndex = cardCount - getCardsPerView();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateTrack();
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateTrack();
        }
    }

    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            createIndicators();
            updateTrack();
        }, 200);
    });

    createIndicators();
    updateTrack();

});