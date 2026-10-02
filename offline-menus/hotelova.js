/* Menu script copied from the live hotelova site (ezeedemo.com / eweb247.com). Inlined into saved pages by offline_links.py. */
const toggle = document.querySelector('.nav-toggle');

        const mobileNav = document.querySelector('.mobile-nav');

        const closeBtn = document.querySelector('.close-btn');

        

        toggle.addEventListener('click', () => {

            mobileNav.classList.add('active');

            document.body.style.overflow = 'hidden';

            toggle.textContent = '✕';

        });

        

        closeBtn.addEventListener('click', () => {

            mobileNav.classList.remove('active');

            document.body.style.overflow = '';

            toggle.textContent = '☰';

        });

        

        document.querySelectorAll('.mobile-nav-link, .mobile-book-btn').forEach(item => {

            item.addEventListener('click', () => {

                mobileNav.classList.remove('active');

                document.body.style.overflow = '';

                toggle.textContent = '☰';

            });

        });