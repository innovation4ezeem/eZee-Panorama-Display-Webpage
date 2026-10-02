/* room-detail.js from the live heavenhotel room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
const track = document.querySelector(".track");

const cardWidth = 300;



let scrollPosition = 0;



function autoScroll() {

  scrollPosition += cardWidth;



  track.scrollTo({

    left: scrollPosition,

    behavior: "smooth"

  });



  // When reaching end → reset instantly

  if (scrollPosition >= track.scrollWidth - track.clientWidth) {

    setTimeout(() => {

      track.scrollTo({ left: 0, behavior: "auto" });

      scrollPosition = 0;

    }, 600);

  }

}



setInterval(autoScroll, 2500);



let rooms = document.querySelectorAll(".room");

let mainImage = document.getElementById("mainImage");

let currentIndex = 0;

let autoPlay;



// start autoplay

function startAutoPlay(){

    autoPlay = setInterval(autoChange, 5000);

}



startAutoPlay();



// change image

function changeImage(el, index){

    let img = el.querySelector("img").src;

    mainImage.src = img;

    currentIndex = index;

}



// click event

rooms.forEach((card,index)=>{

    card.addEventListener("click",()=>{

        clearInterval(autoPlay); // temporary stop

        changeImage(card,index);



        // restart autoplay after 8 sec

        setTimeout(()=>{

            startAutoPlay();

        },8000);

    });



    // hover animation for card only

    card.addEventListener("mouseenter",()=>{

        card.style.transform="scale(1.05)";

    });



    card.addEventListener("mouseleave",()=>{

        card.style.transform="scale(1)";

    });

});



// autoplay function

function autoChange(){

    currentIndex++;



    if(currentIndex >= rooms.length){

        currentIndex = 0;

    }



    changeImage(rooms[currentIndex], currentIndex);

}
