/* Guest reviews slider (arrows and dots), copied from the live heavenhotel site: https://ezeedemo.com/heavenhotel/testimonial.js
   Inlined into every page of the site by offline_links.py; only runs where the reviews slider is. */
if (!(document.getElementById('slider') && document.getElementById('next') && document.querySelector('#slider .card'))) return;

const slider = document.getElementById("slider")
const cards = document.querySelectorAll(".card")
const next = document.getElementById("next")
const prev = document.getElementById("prev")

let index = 0

function visibleCards(){
return window.innerWidth <= 768 ? 1 : 2
}

function updateSlider(){

const gap = window.innerWidth <= 768 ? 0 : 25
const cardWidth = cards[0].offsetWidth + gap

slider.style.transform = `translateX(-${index * cardWidth}px)`

prev.disabled = index === 0
next.disabled = index >= cards.length - visibleCards()

}

next.onclick = () => {
if(index < cards.length - visibleCards()){
index++
updateSlider()
}
}

prev.onclick = () => {
if(index > 0){
index--
updateSlider()
}
}

window.addEventListener("resize", updateSlider)

updateSlider()