(() => {
  // app/scripts/slider-component.js
  var customElementsName = "slider-component";
  !window.customElements.get(customElementsName) && window.customElements.define(
    customElementsName,
    class extends HTMLElement {
      connectedCallback() {
        let config = this.querySelector('script[type*="json"]');
        if (!config)
          return;
        this.config = JSON.parse(config.innerHTML);
        //!location.search.includes('debug') && config.remove();
        if (this.hasAttribute("slide-wait"))
          return;
        this.createSlide();
      }
      load(config = {}) {
        this.config = { ...this.config, ...config };
        this.createSlide();
      }
      createSlide() {
        if (this.slider || !this.querySelector(".js-slider").childElementCount)
          return;
        if (!window.SwiperSlider) {
          setTimeout(() => this.load(), 50);
          return;
        }
        const { Swiper, Modules } = window.SwiperSlider;
        this.config.spaceBetween && (this.config.spaceBetween = +this.config.spaceBetween.toString().replace(/[^\d.,]/g, ""));
        for (let i in this.config.breakpoints) {
          let spaceBetween = this.config.breakpoints[i]?.spaceBetween || 0;
          this.config.breakpoints[i].spaceBetween = +spaceBetween.toString().replace(/[^\d.,]/g, "");
        }
        this.slider = new Swiper(this, {
          init: false,
          ...this.config,
          modules: Modules
        });
        this.slider.on("init", this.onInit.bind(this));
        this.slider.on("breakpoint", (e) => {
          this.classList.toggle("slider-slide-enabled", e.enabled);
        });
        this.slider.init();
        return this.slider;
      }
      onChange(e) {
        const slideIndex = this.querySelector(".jsSlideIndex");
        if (!slideIndex)
          return;
        slideIndex.innerHTML = e.index + 1;
      }
      onInit() {
        this.removeAttribute("slide-wait");
        this.querySelector(".js-slider")?.classList.add("flex-nowrap");
        this.querySelector(".js-slider")?.classList.add("slider-loaded");
        const emptySlides = [...this.querySelectorAll(".swiper-slide")].filter(
          (slide) => {
            const emptyContent = slide.querySelector(
              ".swiper-slide-content-empty"
            );
            return !!emptyContent;
          }
        );
        if (emptySlides.length == this.querySelectorAll(".swiper-slide").length) {
          this.classList.add("slider-is-empty");
        }
        this.classList.add("slider-component-loaded");
        window.dispatchEvent(new Event("lazy:update"));
      }
      getSlide() {
        return this.slider;
      }
      unLoad() {
        if (!this.slider || !this.slider.destroy)
          return;
        this.slider.destroy();
      }
      goTo(index) {
        if (index == "next")
          this.slider?.slideNext();
        else if (index == "prev")
          this.slider?.slidePrev();
        else
          this.slider?.slideTo(index);
      }
    }
  );
})();
