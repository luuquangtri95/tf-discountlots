import Scroll from '../function/scroll';

const { addEvent } = theme;

addEvent('click', '.js-scroll-to', e => {

	const el = e.target.closest('.js-scroll-to');
	const selector = el.dataset.scroll || null;
	const target = document.querySelector(selector);
	if (!target || !selector) return;

	e.preventDefault();
	e.stopPropagation();

	const duration = +el.dataset.duration || null;
	Scroll(target, duration);
})

