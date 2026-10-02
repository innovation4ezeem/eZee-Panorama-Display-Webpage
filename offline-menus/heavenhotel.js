/* Menu script copied from the live heavenhotel site (ezeedemo.com / eweb247.com). Inlined into saved pages by offline_links.py. */
(function() {

// Desktop about sidebar

const desktopToggle = document.getElementById('desktopAboutToggle');

const desktopSidebar = document.getElementById('desktopAboutSidebar');

const closeDesktop = document.getElementById('closeDesktopSidebar');

const desktopOverlay = document.getElementById('desktopOverlay');



function openDesktopSidebar() {

if (!desktopSidebar || !desktopOverlay) return;

desktopOverlay.classList.add('active');

setTimeout(() => {

desktopSidebar.classList.add('open');

}, 20);

}



function closeDesktopSidebar() {

desktopSidebar.classList.remove('open');

desktopOverlay.classList.remove('active');

}



if (desktopToggle) {

desktopToggle.addEventListener('click', openDesktopSidebar);

}

if (closeDesktop) {

closeDesktop.addEventListener('click', closeDesktopSidebar);

}

if (desktopOverlay) {

desktopOverlay.addEventListener('click', closeDesktopSidebar);

}



// Mobile menu sidebar

const menuToggle = document.getElementById('menuToggle');

const mobileSidebar = document.getElementById('mobileSidebar');

const closeMobile = document.getElementById('closeMobileSidebar');

const mobileOverlay = document.getElementById('mobileOverlay');



function openMobileSidebar() {

if (!mobileSidebar || !mobileOverlay) return;

mobileOverlay.classList.add('active');

setTimeout(() => {

mobileSidebar.classList.add('open');

}, 20);

}



function closeMobileSidebar() {

mobileSidebar.classList.remove('open');

mobileOverlay.classList.remove('active');

}



if (menuToggle) {

menuToggle.addEventListener('click', openMobileSidebar);

}

if (closeMobile) {

closeMobile.addEventListener('click', closeMobileSidebar);

}

if (mobileOverlay) {

mobileOverlay.addEventListener('click', closeMobileSidebar);

}



// ESC key closes any open sidebar

document.addEventListener('keydown', function(e) {

if (e.key === 'Escape') {

if (desktopSidebar && desktopSidebar.classList.contains('open')) {

closeDesktopSidebar();

}

if (mobileSidebar && mobileSidebar.classList.contains('open')) {

closeMobileSidebar();

}

}

});



// Responsive cleanup

window.addEventListener('resize', function() {

if (window.innerWidth >= 1024) {

if (mobileSidebar && mobileSidebar.classList.contains('open')) {

closeMobileSidebar();

}

} else {

if (desktopSidebar && desktopSidebar.classList.contains('open')) {

closeDesktopSidebar();

}

}

});

})();