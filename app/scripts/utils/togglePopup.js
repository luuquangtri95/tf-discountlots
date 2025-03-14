const { addEvent, loadTemplate } = theme;

addEvent('click', '.jsTogglePopup', e => {

	const el = e.target.closest('.jsTogglePopup');
	const { control: popupControlId, id: popupId } = el.dataset;

	let popup = null;
	if (popupControlId)
		popup = document.querySelector(`.popup-component[data-control="${popupControlId}"],${popupControlId}`);
	else if (popupId)
		popup = document.querySelector(`.popup-component[id="${popupId}"],${popupId}`);

	if (!popup) return;

	if (popupControlId == '#cartDrawer' && theme.settings.cartStyle == 'drawer_desktop' && !window.matchMedia('(min-width: 750px)').matches || popupControlId =='#filterPopup') {
		return
	}

	e.preventDefault();
	e.stopPropagation();

	el.classList.toggle('active');

	popup.isOpen ? popup.close() : popup.open();
})

addEvent('click', '.jsPopupClose', e => {
	e.preventDefault();
	const el = e.target;
	const popup = el.closest('.popup-component');

	if (!popup) return;

	popup.close();

	document.querySelectorAll(`.jsTogglePopup[data-control="${popup.dataset.control}"]`)?.forEach(el => el.classList.remove('active'));
})