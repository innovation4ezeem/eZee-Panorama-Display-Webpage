/* testimonial.js from the live heavenhotel room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
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
