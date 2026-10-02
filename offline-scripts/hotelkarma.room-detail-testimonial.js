/* testimonial.js from the live hotelkarma room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
// document.addEventListener("DOMContentLoaded", function () {

//   const slider = document.querySelector(".testimonial-slider");
//   const cards = document.querySelectorAll(".testimonial-card");
//   const prevBtn = document.querySelector(".ts-prev");
//   const nextBtn = document.querySelector(".ts-next");
//   const dotsWrapper = document.querySelector(".ts-dots");

//   if (!slider || !cards.length) return;

//   let currentIndex = 0;
//   let cardWidth = 0;
//   let maxIndex = 0;
//   let borderCompensation = 0;

//   function getVisibleCards() {
//     if (window.innerWidth <= 768) return 1;
//     if (window.innerWidth <= 1024) return 2;
//     return 3;
//   }

//   function calculateSizes() {
//     const visible = getVisibleCards();
//     maxIndex = Math.max(0, cards.length - visible);

//     const gap = parseFloat(getComputedStyle(slider).gap) || 0;
//     const cardStyle = getComputedStyle(cards[0]);

//     const border =
//       parseFloat(cardStyle.borderLeftWidth) +
//       parseFloat(cardStyle.borderRightWidth);

//     cardWidth = cards[0].getBoundingClientRect().width + gap;
//     borderCompensation = parseFloat(cardStyle.borderLeftWidth);

//     slider.style.marginLeft = borderCompensation + "px";

//     currentIndex = Math.min(currentIndex, maxIndex);
//   }

//   function buildDots() {
//     dotsWrapper.innerHTML = "";

//     if (maxIndex === 0) {
//       prevBtn.style.display = "none";
//       nextBtn.style.display = "none";
//       dotsWrapper.style.display = "none";
//       return;
//     }

//     prevBtn.style.display = "";
//     nextBtn.style.display = "";
//     dotsWrapper.style.display = "";

//     for (let i = 0; i <= maxIndex; i++) {
//       const dot = document.createElement("button");
//       dot.className = "ts-dot";
//       if (i === currentIndex) dot.classList.add("ts-dot-active");

//       dot.onclick = () => {
//         currentIndex = i;
//         updateSlider();
//       };

//       dotsWrapper.appendChild(dot);
//     }
//   }

//   function updateSlider() {

//     slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

//     // Update dots
//     dotsWrapper.querySelectorAll(".ts-dot").forEach((dot, i) => {
//       dot.classList.toggle("ts-dot-active", i === currentIndex);
//     });

//     // Remove active class from all cards
//     cards.forEach(card => card.classList.remove("ts-active"));

//     // Center card (for 3 visible cards)
//     const centerIndex = currentIndex + 1;

//     if (cards[centerIndex]) {
//       cards[centerIndex].classList.add("ts-active");
//     }
//   }

//   function initSlider() {
//     calculateSizes();
//     buildDots();
//     updateSlider();
//   }

//   nextBtn.onclick = () => {
//     currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
//     updateSlider();
//   };

//   prevBtn.onclick = () => {
//     currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
//     updateSlider();
//   };

//   initSlider();
//   window.addEventListener("resize", initSlider);

// });



document.addEventListener("DOMContentLoaded", function () {

  const slider = document.querySelector(".testimonial-slider");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.querySelector(".ts-prev");
  const nextBtn = document.querySelector(".ts-next");
  const dotsWrapper = document.querySelector(".ts-dots");

  if (!slider || !cards.length) return;

  let currentIndex = 0;
  let cardWidth = 0;
  let maxIndex = 0;

  function getVisibleCards() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function calculateSizes() {
    const visible = getVisibleCards();
    maxIndex = Math.max(0, cards.length - visible);

    const gap = parseFloat(getComputedStyle(slider).gap) || 0;

    // Exact card width including border
    cardWidth = cards[0].offsetWidth + gap;

    currentIndex = Math.min(currentIndex, maxIndex);
  }

  function buildDots() {
    dotsWrapper.innerHTML = "";

    if (maxIndex === 0) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      dotsWrapper.style.display = "none";
      return;
    }

    prevBtn.style.display = "";
    nextBtn.style.display = "";
    dotsWrapper.style.display = "";

    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement("button");
      dot.className = "ts-dot";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.setAttribute("type", "button");

      if (i === currentIndex) {
        dot.classList.add("ts-dot-active");
        dot.setAttribute("aria-current", "true");
      }

      dot.onclick = () => {
        currentIndex = i;
        updateSlider();
      };

      dotsWrapper.appendChild(dot);
    }
  }

  function updateSlider() {

    // Perfect exact card movement
    const moveX = cards[currentIndex].offsetLeft;

    slider.style.transform = `translateX(-${moveX}px)`;

    dotsWrapper.querySelectorAll(".ts-dot").forEach((dot, i) => {
      dot.classList.toggle("ts-dot-active", i === currentIndex);
      dot.setAttribute("aria-current", i === currentIndex ? "true" : "false");
    });

    cards.forEach(card => card.classList.remove("ts-active"));

    const centerIndex = currentIndex + 1;

    if (cards[centerIndex]) {
      cards[centerIndex].classList.add("ts-active");
    }
  }

  function initSlider() {
    calculateSizes();
    buildDots();
    updateSlider();
  }

  prevBtn.setAttribute("aria-label", "Previous slide");
  prevBtn.setAttribute("type", "button");

  nextBtn.setAttribute("aria-label", "Next slide");
  nextBtn.setAttribute("type", "button");

  nextBtn.onclick = () => {
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateSlider();
  };

  prevBtn.onclick = () => {
    currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    updateSlider();
  };

  initSlider();
  window.addEventListener("resize", initSlider);

});
