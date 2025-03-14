if (!customElements.get("cart-recommendation")) {
    class cartRecommendation extends HTMLElement {
        constructor() {
            super();

            if (this.isLoaded) return;
            const handleIntersection = (entries, observer) => {
                if (!entries[0].isIntersecting) return;
                observer.unobserve(this);
                this.onLoad();
            };
            new IntersectionObserver(handleIntersection.bind(this), { rootMargin: "600px 0px 600px 0px" }).observe(this);
        }

        onLoad() {
            this.dataset.listId ? this.fetchArray() : this.fetch();
        }

        loaded(html) {
            const div = document.createElement("div");
            div.innerHTML = html;
            const itemList = div.querySelectorAll(".card");

            if (!itemList.length) return;
            const wrapper = this.querySelector(".js-recommend-items");

            [...itemList].slice(0, parseInt(this.dataset.limit)).forEach((item) => {
                wrapper.insertAdjacentElement("afterbegin", item);
            });
            this.classList.add("recommend-initialized");
            this.querySelector(".js-container")?.classList.remove("hide");
            const slider = this.querySelector("slider-component");
            if (slider) {
                if (slider.load) {
                    slider.load();
                } else {
                    window.customElements.whenDefined("slider-component").then(() => {
                        slider.load();
                    });
                }
            }
        }

        fetch() {
            fetch(this.dataset.url)
                .then((response) => response.text())
                .then((html) => {
                    this.loaded(html);
                })
                .catch((e) => {
                    console.error(e);
                });
        }

        fetchArray() {
            const arrayPromise = [];
            const listId = this.dataset.listId.split(",");
            listId.forEach((id) => {
                arrayPromise.push(
                    new Promise((resolved) => {
                        fetch(this.dataset.url.replace("PRODUCTID", id.trim()))
                            .then((response) => response.text())
                            .then((html) => {
                                resolved(html);
                            });
                    })
                );
            });

            Promise.all(arrayPromise).then((result) => {
                this.loaded(result.join(""));
            });

            // let contentBtn = this.querySelector('.btn-hide-product');

            // contentBtn.addEventListener('click', () => {

            //   if(contentBtn.innerHTML == 'Show') {
            //     contentBtn.innerHTML = 'Hide';
            //     this.classList.add('show');
            //   }else {
            //     contentBtn.innerHTML = 'Show'
            //     this.classList.remove('show');

            //   }
            // })
        }

        removeExist() {
            this.querySelectorAll(".remove")?.forEach((item) => {
                item.remove();
            });

            return this.querySelectorAll(".product-card").length;
        }
    }
    customElements.define("cart-recommendation", cartRecommendation);
}
