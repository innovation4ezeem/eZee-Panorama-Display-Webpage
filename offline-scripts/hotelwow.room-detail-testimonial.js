/* testimonial.js from the live hotelwow room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
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
