function scrollBarWidth() {
	return window.innerWidth - document.documentElement.offsetWidth;
}

document.body.style.setProperty("--scrollbar-width", scrollBarWidth() + "px");

window.addEventListener("resize", () => {
	document.body.style.setProperty("--scrollbar-width", scrollBarWidth() + "px");
});
