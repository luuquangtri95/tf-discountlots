(() => {
  // app/scripts/product-slider.js
  var productThumbSliderComponent = class extends HTMLElement {
    constructor() {
      super();
      this.mql = window.matchMedia("(min-width: 750px");
    }
    connectedCallback() {
      const config = this.querySelector('script[type*="json"]');
      if (!config)
        return;
      this.config = JSON.parse(config.innerHTML);
      this.config.spaceBetween && (this.config.spaceBetween = +this.config.spaceBetween.toString().replace(/[^\d.,]/g, ""));
      this.config.freeMode = {
        enabled: true
      };
      for (let i in this.config.breakpoints) {
        let spaceBetween = this.config.breakpoints[i]?.spaceBetween || 0;
        this.config.breakpoints[i].spaceBetween = +spaceBetween.toString().replace(/[^\d.,]/g, "");
      }
      if (this.hasAttribute("slide-wait"))
        return;
    }
    createSlide() {
      const { Swiper, Modules } = window.SwiperSlider;
      if (!this.mql.matches) {
        if (!this.slider) {
          this.slider = new Swiper(this, {
            init: false,
            ...this.config,
            modules: Modules
          });
          this.slider.on("init", this.onInit.bind(this));
          this.slider.on("slideChange", this.onSlideChange.bind(this));
          this.slider.init();
          return this.slider;
        }
      } else {
        if (this.slider) {
          this.slider.destroy();
          this.slider = null;
          return this.slider;
        }
      }
    }
    onSlideChange(swiper) {
    }
    onInit() {
    }
  };
  !window.customElements.get("product-thumbnail-slider-component") && customElements.define("product-thumbnail-slider-component", productThumbSliderComponent);
  var productSliderComponent = class extends productThumbSliderComponent {
    constructor() {
      super();
    }
    connectedCallback() {
      super.connectedCallback();
      if (window.SwiperSlider) {
        this.initSwiper();
        this.mql.addEventListener("change", (e) => {
          this.initSwiper();
        });
      } else {
        document.addEventListener("SwiperSliderLoaded", () => {
          console.log("SwiperSliderLoaded::");
          this.initSwiper();
          this.mql.addEventListener("change", (e) => {
            this.initSwiper();
          });
        });
      }
    }
    initSwiper() {
      const thumbSliderElement = document.querySelector("product-thumbnail-slider-component");
      if (thumbSliderElement) {
        window.customElements.whenDefined("product-thumbnail-slider-component").then(() => {
          const thumbsSwiper = thumbSliderElement.createSlide();
          if (thumbsSwiper) {
            this.config.thumbs = {
              swiper: thumbsSwiper
            };
          }
          this.createSlide();
        });
      }
    }
    onSlideChange(swiper) {
      const currentSlide = swiper.slides[swiper.activeIndex];
      const currentSlideWidth = window.getComputedStyle(currentSlide).width;
      if (currentSlideWidth == "0px") {
        if (swiper.previousIndex < swiper.activeIndex) {
          swiper.slideNext();
        } else {
          swiper.slidePrev();
        }
      }
    }
  };
  !window.customElements.get("product-slider-component") && customElements.define("product-slider-component", productSliderComponent);
})();
