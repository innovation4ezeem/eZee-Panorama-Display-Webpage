/* inline script: const carousel = document.querySelector('.carousel') from the live staynest room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.querySelector('.carousel');
            const slides = document.querySelectorAll('.carousel__slide');
            const dots = document.querySelectorAll('.carousel__dot');
            const prevBtn = document.querySelector('.carousel__button--prev');
            const nextBtn = document.querySelector('.carousel__button--next');
            const autoplayToggle = document.querySelector('.autoplay-toggle');
            const currentEl = document.querySelector('.current');
            const totalEl = document.querySelector('.total');
            
            let currentIndex = 0;
            const totalSlides = slides.length;
            let isAutoplay = true;
            let autoplayInterval;
            
            totalEl.textContent = totalSlides;
            
            function updateSlide() {
                slides.forEach((slide, index) => {
                    slide.classList.remove('active', 'prev');
                    slide.setAttribute('aria-hidden', 'true');
                    
                    if (index === currentIndex) {
                        slide.classList.add('active');
                        slide.setAttribute('aria-hidden', 'false');
                    } else if (index < currentIndex) {
                        slide.classList.add('prev');
                    }
                });
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
                
                currentEl.textContent = currentIndex + 1;
            }

            function goToSlide(index) {
                currentIndex = (index + totalSlides) % totalSlides;
                updateSlide();
                resetAutoplay();
            }
            
            function nextSlide() {
                goToSlide(currentIndex + 1);
            }
            
            function prevSlide() {
                goToSlide(currentIndex - 1);
            }

            function startAutoplay() {
                if (!isAutoplay) return;
                autoplayInterval = setInterval(nextSlide, 4000);
            }
            
            function stopAutoplay() {
                clearInterval(autoplayInterval);
            }
            
            function resetAutoplay() {
                if (isAutoplay) {
                    stopAutoplay();
                    startAutoplay();
                }
            }
            
            function toggleAutoplay() {
                isAutoplay = !isAutoplay;
                autoplayToggle.classList.toggle('active', isAutoplay);
                isAutoplay ? startAutoplay() : stopAutoplay();
            }

            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => goToSlide(index));
            });
            
            autoplayToggle.addEventListener('click', toggleAutoplay);
            
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', () => {
                if (isAutoplay) startAutoplay();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp') prevSlide();
                if (e.key === 'ArrowDown') nextSlide();
                if (e.key === ' ') {
                    toggleAutoplay();
                    e.preventDefault();
                }
            });

            let startY = 0;
            carousel.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
            });
            
            carousel.addEventListener('touchend', (e) => {
                const endY = e.changedTouches[0].clientY;
                const diff = startY - endY;
                Math.abs(diff) > 50 && (diff > 0 ? nextSlide() : prevSlide());
            });

            startAutoplay();
            updateSlide();
        });
