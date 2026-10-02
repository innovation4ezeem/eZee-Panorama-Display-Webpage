/* Menu script copied from the live hotelwow site (ezeedemo.com / eweb247.com). Inlined into saved pages by offline_links.py. */
const toggle = document.querySelector('.nav-toggle');

        const closeBtn = document.querySelector('.close-btn');

        const mobileMenu = document.querySelector('.mobile-menu');

        const overlay = document.querySelector('.overlay');

        

        toggle.addEventListener('click', function() {

            mobileMenu.classList.add('active');

            overlay.classList.add('active');

            document.body.style.overflow = 'hidden';

        });

        

        closeBtn.addEventListener('click', closeMenu);

        overlay.addEventListener('click', closeMenu);

        

        function closeMenu() {

            mobileMenu.classList.remove('active');

            overlay.classList.remove('active');

            document.body.style.overflow = '';

        }

        

        document.querySelectorAll('.mobile-nav-link').forEach(link => {

            link.addEventListener('click', closeMenu);

        });