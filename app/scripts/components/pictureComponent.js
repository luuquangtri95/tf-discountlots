const customElementsName = "picture-component";

!window.customElements.get(customElementsName) &&
	window.customElements.define(
		customElementsName,
		class extends HTMLElement {
			connectedCallback() {
				return;

				if (
					!("IntersectionObserver" in window) &&
					!("IntersectionObserverEntry" in window) &&
					!("intersectionRatio" in window.IntersectionObserverEntry.prototype)
				) {
					this.inVisible();
					return;
				}

				const observer = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								this.inVisible();
								observer.disconnect();
							}
						});
					},
					{
						rootMargin: "0px 0px 400px 0px",
					}
				);

				observer.observe(this);

				this.querySelector("img").onerror = this.onError.bind(this);

				const preloadEl = this.querySelector('[rel="preload"]');
				if (preloadEl) {
					document.head.insertAdjacentElement("beforeend", preloadEl);
				}
			}

			onError(event) {
				console.log("onError", event);
			}

			inVisible() {
				// if(this.closest('.tns-slider') && this.closest('slider-component:not(.slide-initialized)')) return;
				if (
					this.closest("lazy-script") ||
					(this.closest("slider-component") &&
						!this.closest("slider-component")?.classList.contains("ready"))
				)
					return;

				this.classList.add("loaded");
			}
		}
	);
