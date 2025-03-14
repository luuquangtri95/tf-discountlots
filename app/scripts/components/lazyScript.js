const customElementsName = "lazy-script";

!window.customElements.get(customElementsName) &&
	window.customElements.define(
		customElementsName,
		class extends HTMLElement {
			constructor() {
				super();

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
					{ rootMargin: "400px 0px 400px 0px" }
				);

				observer.observe(this);
				// console.log(this);
			}

			inVisible() {
				setTimeout(() => {
					this.loadFiles();
					this.changeTag();
				}, 100);
			}

			loadFiles() {
				const { file: files } = this.dataset;

				if (!files) return;

				this.removeAttribute("data-file");

				files.split(",").forEach((file) => {
					if (file.includes(".js")) {
						const parts = file.split("/");
						const fileName = parts[parts.length - 1].split(".js")[0];

						if (document.querySelector(`script[data-uniq="${fileName}"]`)) return;

						const script = document.createElement("script");
						script.setAttribute("data-uniq", fileName);
						script.src = file;

						document.head.insertAdjacentElement("beforeend", script);
					} else {
						const parts = file.split("/");
						const fileName = parts[parts.length - 1].split(".css")[0];

						if (document.querySelector(`link[data-uniq="${fileName}"]`)) return;

						const stylesheet = document.createElement("link");
						stylesheet.href = file;
						stylesheet.rel = "stylesheet";
						stylesheet.type = "text/css";
						stylesheet.media = "all";
						stylesheet.setAttribute("data-uniq", fileName);

						document.head.insertAdjacentElement("beforeend", stylesheet);
					}
				});
			}

			changeTag() {
				const { tag = "div" } = this.dataset;

				if (!tag) return;

				const el = document.createElement(tag || "div");
				this.removeAttribute("data-tag");

				Array.from(this.attributes).forEach((attr, i) => {
					el.setAttribute(this.attributes[i].name, this.attributes[i].value);
				});

				Array.from(this.children)?.forEach((child) => {
					console.log("child::", child);
					el.insertAdjacentElement("beforeend", child);
				});

				this.insertAdjacentElement("beforebegin", el);
				this.remove();
			}
		}
	);
