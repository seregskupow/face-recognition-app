import gsap, { Back } from "gsap/all";
export default class Slider {
  constructor(slides) {
    this.currentItem = 0;
    this.slider_items = slides;
    this.animating = false;
    this.in = this.in.bind(this);
    this.out = this.out.bind(this);
    this.next_slide = this.next_slide.bind(this);
    this.prev_slide = this.prev_slide.bind(this);
    this.resetAnimation = this.resetAnimation.bind(this)
  }

  init() {
    this.in(this.currentItem,false,0);
  }
  resetAnimation(){
    //   this.animating = false;
    
  }
  in(index, toLeft,del=1) {
    const item = this.slider_items[index];
    const texts = item.querySelectorAll(".item-appear");
    const timeline = gsap.timeline({});
    const allComplete = ()=>{this.animating = false;}
    gsap.set(item, { scale: 0.9 });
    gsap.set(item.querySelector('.film-card-wrapper'),{boxShadow:"0 1px 3px rgba(0, 0, 0, 0.14), 0 1px 2px rgba(0, 0, 0, 0.24)"});
    gsap.set([item.querySelector('.img-wrap'),item.querySelector('.film-info')],{boxShadow:"0 1px 3px rgba(0, 0, 0, 0.14), 0 1px 2px rgba(0, 0, 0, 0.24)"});
    gsap.set(item, { left: toLeft ? "100vw" : "-100vw" });
    timeline
      .to(item, 0.5, { left: 0, delay: del })
      .to(item, 0.5, { scale: 1})
      .to(item.querySelector('.film-card-wrapper'), 0.5, { boxShadow:"0 15px 30px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",delay:-0.5})
      .from(item.querySelectorAll(".rating"),{width:0,delay:0.2})
      .to([item.querySelector('.img-wrap'),item.querySelector('.film-info')],0.5,{boxShadow:"0 15px 30px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)",delay:-1})
      .staggerFrom(
        texts,
        0.4,
        {
          y: 200,
          autoAlpha: 0,
          ease: Back.easeOut,
        },
        0.2,
        this.slider_items.length*0.4,
        allComplete
      );
  }

  out(index, nextIndex, toLeft) {
    const item = this.slider_items[index];
    const texts = item.querySelectorAll("p");
    const timeline = gsap.timeline({});
    timeline
      .to(item, 0.5, { scale: 0.9 })
      .to(item, 0.5, { left: toLeft ? "-100vw" : "100vw"})
      .to(item.querySelector('.film-card-wrapper'), 0.5, { boxShadow:"0 1px 3px rgba(0, 0, 0, 0.14), 0 1px 2px rgba(0, 0, 0, 0.24)"},0)
      .to([item.querySelector('.img-wrap'),item.querySelector('.film-info')],0.5,{boxShadow:"0 1px 3px rgba(0, 0, 0, 0.14), 0 1px 2px rgba(0, 0, 0, 0.24)",delay:-1})
      .call(this.in, [nextIndex, toLeft], this, "-=1.5")
      .set(texts, {
        clearProps: "all"
      });
  }
  next_slide() {
    if (this.animating === false) {
      this.animating = true;
      const next =
        this.currentItem !== this.slider_items.length - 1
          ? this.currentItem + 1
          : 0;
      this.out(this.currentItem, next, false);
      this.currentItem = next;
    }
  }

  prev_slide() {
    if (this.animating === false) {
      this.animating = true;
      const prev =
        this.currentItem > 0
          ? this.currentItem - 1
          : this.slider_items.length - 1;
      this.out(this.currentItem, prev, true);
      this.currentItem = prev;
    }
  }
}
