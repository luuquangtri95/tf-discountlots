document.addEventListener('keyup', e=>{
	e.key == `Escape` && document.querySelectorAll('details[open]')?.forEach(item=>item.removeAttribute('open'));
})
