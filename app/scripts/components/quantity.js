class QuantityInput extends HTMLElement {
  constructor() {
    super();

    this.changeEvent = new Event('change', { bubbles: true })

    this.input = this.querySelector('input');

    if (this.input) {
      this.querySelectorAll('button')?.forEach((button) => {
        button.addEventListener('click', this.onButtonClick.bind(this));
      });
    }
    else{
      this.querySelector('select')?.addEventListener('change', e=>{
        this.dispatchEvent(this.changeEvent);
      })
    }
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();

    if (previousValue !== this.input.value) 
      this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define('quantity-input', QuantityInput);