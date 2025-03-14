import noUiSlider from 'nouislider';

class rangePrice extends HTMLElement {
  constructor() {
    super();
    const numbers = this.querySelectorAll("input[type=number]");

    numbers?.forEach((el) => {
      el.oninput = () => {
        var number1 = +numbers[0].value,
          number2 = +numbers[1].value;

        if (number1 > number2) {
          var tmp = number1;
          numbers[0].value = number2;
          numbers[1].value = tmp;
        }

        this.waiting != null && clearTimeout(this.waiting);
        this.waiting = setTimeout(() => {
          el.dispatchEvent(new Event('change'));
          this.waiting = null;
        }, 500);

        this.slider.noUiSlider && this.slider?.noUiSlider.set([+numbers[0].value, +numbers[1].value]);
      }
    });

    this.initSlider();
  }

  initSlider() {
    const slider = this.querySelector('.js-range-slider');
    const numbers = this.querySelectorAll("input[type=number]");

    const min = +this.dataset.min;
    const max = +this.dataset.max;
    const minValue = +this.dataset.minValue;
    const maxValue = +this.dataset.maxValue;

    noUiSlider.create(slider, {
      start: [minValue, maxValue],
      connect: true,
      step: 1,
      direction: document.body.dir,
      range: {
        'min': min,
        'max': max
      }
    });

    slider.noUiSlider.on('slide', (values) => {
      numbers[0].value = +values[0];
      numbers[1].value = +values[1];
    });

    slider.noUiSlider.on('set', (values) => {
      this.waiting != null && clearTimeout(this.waiting);
      this.waiting = setTimeout(() => {
        numbers[0].dispatchEvent(new Event('change'));
        this.waiting = null;
      }, 300);
    });

    this.slider = slider;
    this.sliderCreated = true;
  }
}
customElements.define('price-range', rangePrice);