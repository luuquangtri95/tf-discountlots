window.cartForm = class extends HTMLElement {
	constructor() {
		super();

		this.sections = [
			{
				key: 'section',
				section: 'cart-section'
			},
			{
				key: 'count',
				section: 'cart-live-region-text'
			}
		]
	}

	sectionList(section) {
		if (section) {
			const callSection = section.split(',');
			return this.sections.filter(i => callSection.includes(i.key)).map(i => i.section).join(',');
		}

		return this.sections.map(i => i.section).join(',');
	}

	getHeader(formData) {
		if (!(formData instanceof FormData)) {
			return { 'Content-Type': 'application/json' }
		}
		else
			return { 'X-Requested-With': 'XMLHttpRequest' };
	}

	async postCart(type, data, callback = null, effect = 'default') {
		type != 'update' && window.addEventListener('cart:update', this.update.bind(this), { once: true });

		//if (type == 'add')this.loadingState = true;

		let status = true;
		let response = await fetch(`${theme.routes.cartUrl}/${type}.js`, {
			method: "POST",
			headers: this.getHeader(data),
			body: data
		});

		response = await response.json();

		if (type == 'update') {
			return;
		}


		//if (type == 'add') this.loadingState = false;

		if (response.status) {
			console.error(response);
			this.notify(response.description || response.message);
			status = false;

			response.sections = await this.refresh();
		}

		const { sections } = response;

		window.dispatchEvent(new CustomEvent('cart:update', {
			detail: {
				sections,
				status,
				cart: response,
				effect
			}
		}));

		callback != null && callback(response);
	}

	async refresh() {
		let response = await fetch(`${location.pathname}?sections=${this.sectionList()}`);
		response = await response.json();

		return response;
	}

	update(evt) {

		const { detail: { sections } } = evt;

		for (const [section, html] of Object.entries(sections)) {
			const key = this.sections.find(i => i.section == section)?.key || section;

			switch (key) {
				case 'count':
					this.updateCartCount = html.split('<!-- split -->')[1];
					break;

				default:
					let div = document.createElement('div');
					div.innerHTML = html;
					div.querySelectorAll('.jsCartUpdate').forEach(newItem => {
						const currentItem = document.querySelector(`[class="${newItem.className}"]`);
						if (currentItem) {
							currentItem.innerHTML = newItem.innerHTML;
						}
					})
			}
		}
	}

	async notify(msg) {
		const cartNotify = 'cart-notify';
		let response = await fetch(`${theme.routes.searchUrl}?q=${encodeURI(msg)}&section_id=${cartNotify}`);
		response = await response.text();

		let div = document.createElement('div');
		div.innerHTML = response;

		Array.from(div.querySelector('.shopify-section').children).forEach(el => {
			document.body.insertAdjacentElement('beforeend', el);
		})
	}

	set loadingState(bool) {
		const buttons = Array.from(this.form.elements).filter((button) => button.type === "submit");

		if (bool) {
			buttons.forEach(button => {
				button.setAttribute('aria-busy', true);
				button.classList.add('disabled');
				button.HTMLTemp = button.innerHTML;
				button.innerHTML = document.querySelector('#svg_loading').innerHTML;
			})
		}
		else {
			buttons.forEach(button => {
				button.removeAttribute('aria-busy');
				button.classList.remove('disabled');
				button.innerHTML = button.HTMLTemp;
				button.HTMLTemp = null;
			})
		}
	}

	set updateCartCount(value) {
		document.querySelectorAll('.jsCartCount')?.forEach(item => item.setAttribute('data-count', value))
	}
}