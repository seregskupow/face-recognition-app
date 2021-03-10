import gsap, { Back } from 'gsap';

const largeShadow =
  '0 0px 30px rgba(0, 0, 0, 0.25), 0 0px 10px rgba(0, 0, 0, 0.22)';
const smallShadow =
  '0 1px 3px rgba(0, 0, 0, 0.14), 0 1px 2px rgba(0, 0, 0, 0.24)';

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

    this.resize = this.resize.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
  }

  init() {
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

    // this.in(this.currentSlide, false, 0);
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

  nextSlide() {
    if (this.animating === false) {
      this.animating = true;
      const nextSlide = this.currentSlide + 1;
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
}
