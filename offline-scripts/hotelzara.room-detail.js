/* room-detail.js from the live hotelzara room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
const rmMainImage = document.getElementById("rmMainImage");

const rmThumbs = document.querySelectorAll(".rm-thumb");

const rmPrevBtn = document.querySelector(".rm-prev");

const rmNextBtn = document.querySelector(".rm-next");



let rmCurrentIndex = 0;

let rmImages = [];



// Collect image sources

rmThumbs.forEach((thumb, index) => {

    rmImages.push(thumb.src);



    thumb.addEventListener("click", () => {

        rmCurrentIndex = index;

        updateRmSlider();

    });

});



function updateRmSlider() {

    rmMainImage.src = rmImages[rmCurrentIndex];



    rmThumbs.forEach(t => t.classList.remove("rm-active"));

    rmThumbs[rmCurrentIndex].classList.add("rm-active");

}



// Next

rmNextBtn.addEventListener("click", () => {

    rmCurrentIndex = (rmCurrentIndex + 1) % rmImages.length;

    updateRmSlider();

});



// Prev

rmPrevBtn.addEventListener("click", () => {

    rmCurrentIndex = (rmCurrentIndex - 1 + rmImages.length) % rmImages.length;

    updateRmSlider();

});



// Autoplay

setInterval(() => {

    rmCurrentIndex = (rmCurrentIndex + 1) % rmImages.length;

    updateRmSlider();

}, 4000);
