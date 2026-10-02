/* inner-room.js from the live thegoldenvista room-detail page. Inlined into the saved room-detail.html by offline_links.py. */
class Carousel3D {
            constructor() {
                this.slides = document.querySelector('.slides');
                this.slideEls = document.querySelectorAll('.slide');
                this.dots = document.querySelectorAll('.dot');
                this.prevBtn = document.querySelector('.prev');
                this.nextBtn = document.querySelector('.next');
                this.toggle = document.querySelector('.toggle');
                this.counter = document.querySelector('.counter');
                this.progressBar = document.querySelector('.progress-bar');
                
                this.current = 0;
                this.total = this.slideEls.length;
                this.isAuto = true;
                this.interval = null;
                this.progress = 0;
                
                this.init();
            }
            
            init() {

                 this.slideEls.forEach((slide, index) => {
        slide.style.setProperty('--i', index);
    });
                this.update();
                this.startAuto();
                this.events();
            }
            
            update() {
                const angle = -this.current * 60;
                this.slides.style.transform = `rotateY(${angle}deg)`;

                this.slideEls.forEach((slide, i) => {
                    slide.classList.toggle('active', i === this.current);
                });
                
                this.dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === this.current);
                });

                this.counter.textContent = `${this.current + 1}/${this.total}`;
            }
            
            next() {
                this.current = (this.current + 1) % this.total;
                this.update();
                this.resetProgress();
            }
            
            prev() {
                this.current = (this.current - 1 + this.total) % this.total;
                this.update();
                this.resetProgress();
            }
            
            goTo(index) {
                this.current = index;
                this.update();
                this.resetProgress();
            }
            
            startAuto() {
                if (!this.isAuto) return;
                clearInterval(this.interval);
                
                this.interval = setInterval(() => {
                    this.next();
                }, 4000);
                
                this.startProgress();
            }
            
            stopAuto() {
                clearInterval(this.interval);
                clearInterval(this.progressInterval);
            }
            
            toggleAuto() {
                this.isAuto = !this.isAuto;
                this.toggle.classList.toggle('active', this.isAuto);
                this.isAuto ? this.startAuto() : this.stopAuto();
            }
            
            startProgress() {
                clearInterval(this.progressInterval);
                this.progress = 0;
                this.progressBar.style.width = '0%';
                
                this.progressInterval = setInterval(() => {
                    this.progress += 0.25;
                    this.progressBar.style.width = `${this.progress}%`;
                    
                    if (this.progress >= 100) {
                        clearInterval(this.progressInterval);
                    }
                }, 10);
            }
            
            resetProgress() {
                this.startProgress();
            }
            
            events() {
                this.prevBtn.addEventListener('click', () => this.prev());
                this.nextBtn.addEventListener('click', () => this.next());

                this.dots.forEach((dot, i) => {
                    dot.addEventListener('click', () => this.goTo(i));
                });

                this.toggle.addEventListener('click', () => this.toggleAuto());

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.prev();
                    if (e.key === 'ArrowRight') this.next();
                    if (e.key === ' ') {
                        this.toggleAuto();
                        e.preventDefault();
                    }
                });
                
                let startX = 0;
                document.querySelector('.slides-container').addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                });
                
                document.querySelector('.slides-container').addEventListener('touchend', (e) => {
                    const endX = e.changedTouches[0].clientX;
                    const diff = startX - endX;
                    
                    if (Math.abs(diff) > 50) {
                        diff > 0 ? this.next() : this.prev();
                    }
                });
                
                this.slides.addEventListener('mouseenter', () => this.stopAuto());
                this.slides.addEventListener('mouseleave', () => {
                    if (this.isAuto) this.startAuto();
                });
            }
        }
        
        document.addEventListener('DOMContentLoaded', () => new Carousel3D());
