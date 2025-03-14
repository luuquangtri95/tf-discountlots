if (!customElements.get("recently-viewed")) {
    class RecentlyViewed extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.observer = new IntersectionObserver(
                (entries, observer) => {
                    if (!entries[0].isIntersecting) return;
                    observer.unobserve(this);
                    this.isIntersecting = true;
                    this.getRecentlyViewedProducts();
                },
                { rootMargin: "400px 0px 400px 0px" }
            );
            this.observer.observe(this);
        }

        disconnectedCallback() {
            if (!this.isIntersecting) this.observer?.unobserve(this);
        }

        getRecentlyViewedProducts() {
            if (!localStorage.getItem("recently-viewed-products")) return;

            let products = JSON.parse(localStorage.getItem("recently-viewed-products"));

            if (theme.routes.pageType == "product") {
                products = products.filter((item) => item != theme.product.handle);
            }

            const urls = products.map((handle, index) => {
                return `${theme.routes.searchUrl}?view=product-card&q=${handle}`;
            });

            Promise.all(urls.map((url) => fetch(url).then((resp) => resp.text()))).then((texts) => {
                const newArr = texts.filter(Boolean);

                newArr.forEach((card) => {
                    let li = document.createElement("li");
                    li.classList.add("product-item", "swiper-slide");
                    li.innerHTML = card;
                    this.querySelector(".product-list").appendChild(li);
                });

                if (newArr.length == 0) return;

                if (this.querySelector("slider-component") || this.querySelector("lazy-script")) {
                    this.initSlider();
                }
            });
        }

        initSlider() {
            const slider = this.querySelector("slider-component");
            if (slider) {
                if (slider.load) {
                    slider.load();
                } else {
                    window.customElements.whenDefined("slider-component").then(() => {
                        slider.load();
                    });
                }

                if (this.querySelector(".js-recently-viewed-wrapper")) {
                    this.querySelector(".js-recently-viewed-wrapper")?.classList.remove("hide");
                }
            }
        }
    }

    customElements.define("recently-viewed", RecentlyViewed);
}
