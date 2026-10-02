/* Menu script copied from the live hotelkarma site (ezeedemo.com / eweb247.com). Inlined into saved pages by offline_links.py. */
document.addEventListener("DOMContentLoaded", function () {



  const menuBtn = document.getElementById("menu-btn");

  const sidebar = document.getElementById("sidebar");

  const closeBtn = document.getElementById("close-btn");



  if (menuBtn && sidebar && closeBtn) {



    menuBtn.addEventListener("click", () => {

      sidebar.classList.add("active");

    });



    closeBtn.addEventListener("click", () => {

      sidebar.classList.remove("active");

    });



  }



  const nav = document.querySelector('.navv');



  if (nav) {



    const navTop = nav.offsetTop;

    const navHeight = nav.offsetHeight;



    const spacer = document.createElement('div');

    spacer.style.height = navHeight + 'px';

    spacer.style.display = 'none';

    nav.after(spacer);



    let isFixed = false;



    window.addEventListener('scroll', () => {

      const scrollY = window.scrollY;



      if (scrollY > navTop && !isFixed) {

        isFixed = true;



        spacer.style.display = 'block';



        nav.style.willChange = 'transform';

        nav.style.transition = 'transform 0.3s ease';

        nav.style.transform = 'translateY(-100%)';



        requestAnimationFrame(() => {

          nav.style.position = 'fixed';

          nav.style.top = '0';

          nav.style.left = '0';

          nav.style.width = '100%';

          nav.style.transform = 'translateY(0)';

        });

      }



      if (scrollY <= navTop && isFixed) {

        isFixed = false;



        nav.style.transition = 'none';

        nav.style.transform = 'none';



        nav.style.position = 'relative';

        spacer.style.display = 'none';



        nav.style.willChange = '';

      }



    }, { passive: true });



  }



});