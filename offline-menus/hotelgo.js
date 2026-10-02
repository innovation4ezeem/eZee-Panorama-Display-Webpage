/* Menu script copied from the live hotelgo site (ezeedemo.com / eweb247.com). Inlined into saved pages by offline_links.py. */

const toggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay = document.querySelector('.overlay');

// MAIN MENU TOGGLE
toggle.addEventListener('click', function() {
    const isActive = mobileMenu.classList.contains('active');

    mobileMenu.classList.toggle('active');

    if (overlay) {
        overlay.classList.toggle('active');
    }

    this.textContent = isActive ? '☰' : '✕';
    this.setAttribute('aria-expanded', !isActive);
    document.body.style.overflow = isActive ? '' : 'hidden';
});

// OVERLAY CLICK CLOSE
if (overlay) {
    overlay.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        this.classList.remove('active');
        toggle.textContent = '☰';
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
}

// CLOSE MENU ON LINK CLICK (EXCEPT DROPDOWN)
document.querySelectorAll('.mobile-menu .nav-link:not(.zr-room-toggle)').forEach(link => {
    link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');

        if (overlay) {
            overlay.classList.remove('active');
        }

        toggle.textContent = '☰';
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// ROOM DROPDOWN TOGGLE
document.querySelectorAll('.zr-room-toggle').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // IMPORTANT FIX

        const parent = this.closest('.zr-room-dropdown');

        // CLOSE OTHER DROPDOWNS
        document.querySelectorAll('.zr-room-dropdown').forEach(item => {
            if (item !== parent) item.classList.remove('active');
        });

        parent.classList.toggle('active');
    });
});

// CLOSE DROPDOWN WHEN CLICK OUTSIDE
document.addEventListener('click', function(e) {
    if (!e.target.closest('.zr-room-dropdown')) {
        document.querySelectorAll('.zr-room-dropdown').forEach(item => {
            item.classList.remove('active');
        });
    }
});
