import zenscroll from 'zenscroll';

export default function Scroll(selector, duration, offset){
	var duration = duration || 500;
	var offset = offset || 0;
	const headerSticky = document.querySelector('sticky-header')?.getBoundingClientRect().bottom || 0;

	headerSticky > 0 && (offset = offset - headerSticky);
	
	const top = selector.offsetTop + offset;
	zenscroll.toY(top, duration);
}
