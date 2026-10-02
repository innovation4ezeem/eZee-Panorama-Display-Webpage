/* inline script: const VISIBLE from the live pearlgroupofhotels room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
document.addEventListener("DOMContentLoaded", function () {

  const VISIBLE = 2;
  const GAP = 8;
  const AUTO_MS = 3000;
  let current = 0;
  let autoInt = null;
  const track    = document.getElementById("sliderTrack");
  const dotsCol  = document.getElementById("dotsCol");
  const progFill = document.getElementById("progFill");
  const cA       = document.getElementById("cA");
  const cB       = document.getElementById("cB");
  const cT       = document.getElementById("cT");
  const btnUp    = document.getElementById("btnUp");
  const btnDown  = document.getElementById("btnDown");
  const viewport = document.getElementById("sliderVP");

  if (!track || !dotsCol || !progFill || !cA || !cB || !cT || !btnUp || !btnDown || !viewport) return;

  const slides = track.querySelectorAll(".slide-item");
  const TOTAL = slides.length;

  if (TOTAL === 0) return;

  const IMG_H = slides[0].offsetHeight;
  const STEP = IMG_H + GAP;
  const MAX_TOP = Math.max(0, TOTAL - VISIBLE);

  cT.textContent = TOTAL;

  viewport.style.height = `${(IMG_H * VISIBLE) + GAP}px`;

  dotsCol.innerHTML = "";

  for (let i = 0; i < TOTAL; i++) {
    const btn = document.createElement("button");
    btn.className = "dot";
    btn.type = "button";
    btn.title = `Image ${i + 1}`;
    btn.addEventListener("click", () => jumpTo(i));
    dotsCol.appendChild(btn);
  }

  function render() {
    current = Math.max(0, Math.min(current, MAX_TOP));

    track.style.transform = `translateY(-${current * STEP}px)`;

    const dots = dotsCol.querySelectorAll(".dot");

    dots.forEach((d, i) => {
      d.classList.remove("top-visible", "bot-visible");

      if (i === current) d.classList.add("top-visible");
      if (i === current + 1) d.classList.add("bot-visible");
    });

    cA.textContent = current + 1;
    cB.textContent = Math.min(current + VISIBLE, TOTAL);

    const progress = MAX_TOP > 0 ? (current / MAX_TOP) * 100 : 100;
    progFill.style.width = `${progress}%`;
  }

  function next() {
    current = current >= MAX_TOP ? 0 : current + 1;
    render();
  }

  function prev() {
    current = current <= 0 ? MAX_TOP : current - 1;
    render();
  }

  function jumpTo(index) {
    current = Math.max(0, Math.min(index, MAX_TOP));
    render();
    resetAuto();
  }

  function startAuto() {
    autoInt = setInterval(next, AUTO_MS);
  }

  function resetAuto() {
    clearInterval(autoInt);
    startAuto();
  }

  btnDown.addEventListener("click", function () {
    next();
    resetAuto();
  });

  btnUp.addEventListener("click", function () {
    prev();
    resetAuto();
  });

  track.addEventListener("mouseenter", () => clearInterval(autoInt));
  track.addEventListener("mouseleave", resetAuto);

  window.addEventListener("resize", function () {
    render();
  });

  render();

  if (TOTAL > VISIBLE) {
    startAuto();
  }
});
