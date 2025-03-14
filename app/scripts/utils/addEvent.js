export default function addEvent(evt, selector, handler) {
	evt.split(" ").forEach((event) => {
		document.addEventListener(
			event,
			function (event) {
				if (event.target.matches(selector + ", " + selector + " *")) {
					handler.apply(event.target.closest(selector), arguments);
				}
			},
			false
		);
	});
}
