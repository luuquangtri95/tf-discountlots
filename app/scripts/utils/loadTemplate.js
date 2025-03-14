const {addEvent} = theme;

addEvent('click', '.jsTemplate', e=>{
	const node = e.target.closest('.jsTemplate');
	const template = document.querySelector(node.dataset.template);

	e.preventDefault();
	e.stopPropagation();

  template.tagName == 'TEMPLATE' && Array.from(template.content.children)?.forEach(child=>{
    template.insertAdjacentElement('beforebegin', child);
  })

  if(template.tagName == 'NOSCRIPT'){
  	const div = document.createElement('div');
  	div.innerHTML = template.innerHTML;
   	template.insertAdjacentElement('beforebegin', div);
  }
  
  template.remove();

	node.classList.remove('jsTemplate');
	node.removeAttribute('data-template');

	setTimeout(()=>{
		node.click();
	}, 300)
})