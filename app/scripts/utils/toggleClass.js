const { addEvent } = theme;

addEvent('click', '.jsToggleClass', e => {
	const el = e.target.closest('.jsToggleClass');
	const target = document.querySelectorAll(el.dataset.target || null);

	// if(el.hasAttribute('data-toggle-class-config')){
	// 	console.log(JSON.parse(el.getAttribute('data-toggle-class-config')));
	// }

	if (!target.length) return;

	let { className, classRemove, classRule, classEvent } = el.dataset;

	if (classEvent == 'none') {
		e.preventDefault();
		e.stopPropagation();
	}

	target.forEach(i => {
		switch (classRule) {
			case 'add':
				i.classList.add(...className.split(','));
				break;

			case 'remove':
				i.classList.remove(...className.split(','));
				break;
			default:
				className.split(',').forEach(c => i.classList.toggle(c));
		}

		if (classRemove) {
			i.classList.remove(...classRemove.split(','));
		}

		i.className.includes('header-search') && document.querySelector('header predictive-search')?.focusSearch();
	});
})