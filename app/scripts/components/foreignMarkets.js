class foreignMarkets extends HTMLElement { 
	constructor() {
		super();

		this.querySelectorAll('.js-multi-shop')?.forEach(item=>{
			item.addEventListener('click', e=>{
				const element = item;
				const type = element.className.includes('languages') ? 'language_code': 'country_code';
				const target = this.querySelector(`[name="${type}"]`);
				target.value = element.dataset.value;
				this.querySelector('form').submit();
			})
		});

		this.querySelectorAll('details').forEach(item => {
			item.addEventListener('click', e =>{
				this.querySelectorAll('details').forEach(detail =>{
					if (detail != item) {
						detail.removeAttribute('open')
					}
				})
			})
		});

		this.addEventListener('change', ({target})=>{
			if(!target.hasAttribute('auto-submit')) return;

			this.querySelector('form').submit();

		})
	}
}

customElements.define('foreign-markets', foreignMarkets);