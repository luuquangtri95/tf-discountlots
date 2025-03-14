const customElementsName = 'cart-remove-button';

!window.customElements.get(customElementsName) &&
window.customElements.define(customElementsName, class extends HTMLElement{
  constructor(){
    super();

    this.addEventListener('click', e=>{
      const { target } = e;

      if(!target.closest('a')) return;

      const link = target.closest('a');

      e.preventDefault();

      this.closest('cart-component').dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        detail: {
          customElement: link
        }
      }));
    });
  }
});