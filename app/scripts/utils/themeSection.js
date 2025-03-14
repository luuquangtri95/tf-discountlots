export default function SectionLoad(obj) {
	document.addEventListener('shopify:section:load', evt => {

		const { target, detail: { sectionId } } = evt;
		const container = target.querySelector(`[data-section-type="${obj.type}"]`);

		if (!container) return;

		obj.id = sectionId;
		obj.container = container;
		obj.onLoad?.call(obj, evt);
	});

	document.addEventListener('shopify:section:select', evt => {
		const { target, detail: { sectionId } } = evt;
		const container = target.querySelector(`[data-section-type="${obj.type}"]`);

		if (!container) return;

		obj.id = sectionId;
		obj.container = container;
		obj.onSelect?.call(obj, evt);
	});

	document.addEventListener('shopify:section:deselect', evt => {
		if (!obj.container) return;

		obj.onDeselect?.call(obj, evt);
	});


	document.addEventListener('shopify:block:select', evt => {

		const { target, detail: { sectionId, blockId } } = evt;
		const container = target.closest(`[data-section-type="${obj.type}"]`);

		if (!container) return;

		obj.id = sectionId;
		obj.container = container;
		obj.blockId = blockId;
		obj.curentBlock = target;
		obj.onBlockSelect?.call(obj, evt);
	});


	document.addEventListener('shopify:block:deselect', evt => {
		const { detail: { sectionId, blockId } } = evt;

		obj.id = sectionId;
		obj.blockId = blockId;
		obj.curentBlock = null;
		obj.onBlockDeselect?.call(obj, evt);
	});


	// document.addEventListener('shopify:inspector:activate', evt => {
	// 	console.log('shopify:inspector:activate', evt);
	// });

	// document.addEventListener('shopify:inspector:deactivate', evt => {
	// 	console.log('shopify:inspector:deactivate', evt);
	// });
}