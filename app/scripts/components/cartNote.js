class CartNote extends cartForm {
	constructor() {
		super();

		const { debounceTime } = theme;
		const textarea = this.querySelector('[name=note]');
		if (!textarea) return;

		textarea.addEventListener('input', debounceTime((event) => {
			this.postCart('update', JSON.stringify({ note: event.target.value }));
		}, 1000));

		textarea.addEventListener('input', ()=>{
			textarea.style.height = 'auto'; // reset height
			textarea.style.height = textarea.scrollHeight + 'px';
		});
	}
}

const customElementsName = 'cart-note';
!window.customElements.get(customElementsName) &&
	window.customElements.define(customElementsName, CartNote);