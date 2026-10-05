/* Guest reviews slider (arrows and dots), copied from the live thegoldenvista site: https://ezeedemo.com/goldenvista/testimonial.js
   Inlined into every page of the site by offline_links.py; only runs where the reviews slider is. */
if (!(document.querySelector('.tmn-card') && document.querySelector('.tmn-next-btn'))) return;

 const tmnCards = document.querySelectorAll('.tmn-card');
  const tmnDots = document.querySelectorAll('.tmn-dot');
  const tmnPrevBtn = document.querySelector('.tmn-prev-btn');
  const tmnNextBtn = document.querySelector('.tmn-next-btn');
  let tmnCurrent = 0;
  const tmnTotal = tmnCards.length;
  let tmnAutoPlay;
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
  tmnPrevBtn.addEventListener('click', tmnPrev);
  tmnNextBtn.addEventListener('click', tmnNext);
  tmnDots.forEach(dot => {
    dot.addEventListener('click', () => {
      tmnCurrent = parseInt(dot.dataset.index);
      tmnUpdateCards();
    });
  });
  tmnCards.forEach(card => {
    card.addEventListener('mouseenter', () => clearInterval(tmnAutoPlay));
    card.addEventListener('mouseleave', tmnStartAutoPlay);
  });
  tmnStartAutoPlay();
  tmnUpdateCards();