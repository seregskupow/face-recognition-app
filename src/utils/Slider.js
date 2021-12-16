import gsap, { Power1 } from 'gsap';

export default class Slider {
  constructor(properties) {
    this.slider = properties.slider || null;
    this.track = this.slider.querySelector('.slider-track') || null;
    this.slider_items = [...this.slider.querySelectorAll('.slide')];
    this.nextBtn = properties.next || null;
    this.prevBtn = properties.prev || null;
    this.slideWidth = window.innerWidth * 0.8;
    this.slideMargin = (window.innerWidth - this.slideWidth) / 2;
    this.currentSlide = 1;
    this.animating = false;

    this.startX = null;
    this.xDiff = null;

    this.resize = this.resize.bind(this);
    this.destroy = this.destroy.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.appearAnimation = this.appearAnimation.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchOrMouseEnd = this.handleTouchOrMouseEnd.bind(this);
  }

  init() {
    console.log('Inited');
    if (!this.slider_items.length) {
      throw 'Slides are not defined';
    }
    if (!this.track) {
      throw 'Track is not defined';
    }

    const firstClone = this.slider_items[0].cloneNode(true);
    const lastClone = this.slider_items[this.slider_items.length - 1].cloneNode(
      true
    );
    this.track.prepend(lastClone);
    this.track.append(firstClone);

    this.slider_items.unshift(lastClone);
    this.slider_items.push(firstClone);

    window.addEventListener('resize', this.resize);

    this.resize();

    gsap.set(this.track, {
      x: -1 * (this.currentSlide * (this.slideWidth + this.slideMargin)),
    });

    this.nextBtn.addEventListener('click', this.nextSlide);
    this.prevBtn.addEventListener('click', this.prevSlide);

    this.slider.addEventListener('mousedown', this.handleMouseDown, false);
    this.slider.addEventListener('mousemove', this.handleMouseMove, false);
    this.slider.addEventListener('mouseup', this.handleTouchOrMouseEnd, false);

    this.slider.addEventListener('touchstart', this.handleTouchStart, false);
    this.slider.addEventListener('touchmove', this.handleTouchMove, false);
    this.slider.addEventListener('touchend', this.handleTouchOrMouseEnd, false);
  }

  resize() {
    this.slideWidth = window.innerWidth * 0.8;
    this.slideMargin = (window.innerWidth - this.slideWidth) / 2;

    this.track.style.width = `${
      this.slider_items.length * this.slideWidth +
      this.slideMargin * (this.slider_items.length + 1)
    }px`;

    this.slider_items.forEach((slide, index) => {
      slide.style.width = `${this.slideWidth}px`;
      slide.style.marginLeft = `${this.slideMargin}px`;
      if (index === this.slider_items.length - 1) {
        slide.style.marginRight = `${this.slideMargin}px`;
      }
    });
    gsap.set(this.track, {
      x: -1 * (this.currentSlide * (this.slideWidth + this.slideMargin)),
    });
  }

  destroy() {
    this.nextBtn.removeEventListener('click', this.nextSlide);
    this.prevBtn.removeEventListener('click', this.prevSlide);
    this.slider.removeEventListener('mousedown', this.handleMouseDown, false);
    this.slider.removeEventListener('mousemove', this.handleMouseMove, false);
    this.slider.removeEventListener(
      'mouseup',
      this.handleTouchOrMouseEnd,
      false
    );

    this.slider.removeEventListener('touchstart', this.handleTouchStart, false);
    this.slider.removeEventListener('touchmove', this.handleTouchMove, false);
    this.slider.removeEventListener(
      'touchend',
      this.handleTouchOrMouseEnd,
      false
    );
  }

  nextSlide() {
    if (this.animating === false) {
      this.animating = true;
      const nextSlide = this.currentSlide + 1;
      this.appearAnimation(nextSlide);
      gsap.to(this.track, {
        duration: 0.5,
        x: -1 * (nextSlide * (this.slideWidth + this.slideMargin)),
        onComplete: () => {
          this.currentSlide = nextSlide;
          this.animating = false;
          if (this.currentSlide === this.slider_items.length - 1) {
            this.currentSlide = 1;
            gsap.set(this.track, {
              x:
                -1 * (this.currentSlide * (this.slideWidth + this.slideMargin)),
            });
          }
        },
      });
    }
  }

  prevSlide() {
    if (this.animating === false) {
      this.animating = true;
      const prevSlide = this.currentSlide - 1;
      this.appearAnimation(prevSlide);
      gsap.to(this.track, {
        duration: 0.5,
        x: -1 * (prevSlide * (this.slideWidth + this.slideMargin)),
        onComplete: () => {
          this.currentSlide = prevSlide;
          this.animating = false;
          if (this.currentSlide === 0) {
            this.currentSlide = this.slider_items.length - 2;
            gsap.set(this.track, {
              x:
                -1 * (this.currentSlide * (this.slideWidth + this.slideMargin)),
            });
          }
        },
      });
    }
  }

  handleTouchStart(event) {
    const firstTouch = event.touches[0];
    this.startX = firstTouch.clientX;
  }

  handleMouseDown(event) {
    this.startX = event.clientX;
  }

  handleMouseMove(event) {
    if (!this.startX) {
      return false;
    }
    const x2 = event.clientX;
    this.xDiff = x2 - this.startX;
  }

  handleTouchMove(event) {
    if (!this.startX) {
      return false;
    }
    const x2 = event.touches[0].clientX;
    this.xDiff = x2 - this.startX;
  }

  handleTouchOrMouseEnd() {
    if (Math.abs(this.xDiff) > 5) {
      if (this.xDiff > 0) this.prevSlide();
      else this.nextSlide();
      this.startX = null;
      this.xDiff = null;
    }
  }

  appearAnimation(index) {
    gsap.from(this.slider_items[index].querySelectorAll('.rating'), {
      duration: 0.6,
      width: 0,
      ease: Power1.easeInOut,
    });
  }
}
