export const section = {
  type: 'slider',
  onLoad: function () {
  }
  , onUnload: function () {
  }
  , onSelect: function () {
    // this.slider.config.index = this.index || 0;
  }
  , onDeselect: function () {
    setTimeout(() => {
      const slider = this.container.querySelector('slider-component');
      slider?.getSlide().play();
    }, 100);
  }
  , onBlockSelect: function (e) {
    const index = e.target.closest('[data-slide-index]')?.dataset.slideIndex;

    setTimeout(() => {
      const slider = this.container.querySelector('slider-component');
      slider?.goTo(+index);
      slider?.getSlide().pause();
    }, 100);
  }
}