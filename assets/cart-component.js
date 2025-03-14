(() => {
  // app/scripts/component/cartRecommendation.js
  if (!customElements.get("cart-recommendation")) {
    class cartRecommendation extends HTMLElement {
      constructor() {
        super();
        if (this.isLoaded)
          return;
        const handleIntersection = (entries, observer) => {
          if (!entries[0].isIntersecting)
            return;
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
        if (!itemList.length)
          return;
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
        fetch(this.dataset.url).then((response) => response.text()).then((html) => {
          this.loaded(html);
        }).catch((e) => {
          console.error(e);
        });
      }
      fetchArray() {
        const arrayPromise = [];
        const listId = this.dataset.listId.split(",");
        listId.forEach((id) => {
          arrayPromise.push(
            new Promise((resolved) => {
              fetch(this.dataset.url.replace("PRODUCTID", id.trim())).then((response) => response.text()).then((html) => {
                resolved(html);
              });
            })
          );
        });
        Promise.all(arrayPromise).then((result) => {
          this.loaded(result.join(""));
        });
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

  // app/scripts/component/cartRemove.js
  var customElementsName = "cart-remove-button";
  !window.customElements.get(customElementsName) && window.customElements.define(customElementsName, class extends HTMLElement {
    constructor() {
      super();
      this.addEventListener("click", (e) => {
        const { target } = e;
        if (!target.closest("a"))
          return;
        const link = target.closest("a");
        e.preventDefault();
        this.closest("cart-component").dispatchEvent(new CustomEvent("change", {
          bubbles: true,
          detail: {
            customElement: link
          }
        }));
      });
    }
  });

  // app/scripts/component/cartNote.js
  var CartNote = class extends cartForm {
    constructor() {
      super();
      const { debounceTime } = theme;
      const textarea = this.querySelector("[name=note]");
      if (!textarea)
        return;
      textarea.addEventListener("input", debounceTime((event) => {
        this.postCart("update", JSON.stringify({ note: event.target.value }));
      }, 1e3));
      textarea.addEventListener("input", () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      });
    }
  };
  var customElementsName2 = "cart-note";
  !window.customElements.get(customElementsName2) && window.customElements.define(customElementsName2, CartNote);

  // app/scripts/cart-component.js
  !customElements.get("cart-component") && customElements.define("cart-component", class extends cartForm {
    constructor() {
      super();
    }
    connectedCallback() {
      console.log("cart-component::connectedCallback");
      const { debounceTime } = theme;
      const debounce = debounceTime((e) => this.change(e), 300);
      this.addEventListener("change", debounce.bind(this));
      this.onUpdate = this.onUpdate.bind(this);
      window.addEventListener("cart:update", this.onUpdate);
      this.addEventListener(
        "click",
        (e) => {
          const { target: el } = e;
          if (el.closest('a[href*="showOptions"]')) {
            e.preventDefault();
            this.querySelector("#showOptions summary")?.click();
          }
        },
        { passive: false }
      );
    }
    disconnectedCallback() {
      window.removeEventListener("cart:update", this.onUpdate);
    }
    onRefresh() {
      console.log("onRefresh:::");
      const section = theme.routes.pageType == "cart" ? this.getAttribute("data-section-id") : "cart-section";
      this.sections.find((i) => i.key == "section").section = section;
      let sections = this.sections.map((i) => i.section);
      sections.push(section);
      sections = Array.from(new Set(sections));
      Promise.all([
        fetch(`${location.pathname}?sections=${sections}`),
        fetch(`${theme.routes.cartUrl}.js`)
      ]).then(async ([response1, response2]) => {
        const data1 = await response1.json();
        const data2 = await response2.json();
        data2.sections = data1;
        console.log("data2::", data2);
        this.update({ detail: { sections: data1, status: response1.status, cart: data2, effect: "default" } });
      }).catch((error) => console.error("Fetch error:", error));
    }
    change(event) {
      let target = event.target;
      let quantity = 0;
      if (event.detail) {
        target = event.detail.customElement;
      } else {
        quantity = +target.value;
      }
      let { line, sections: section, sections_url } = target.dataset;
      if (!line)
        return;
      this.sections.find((i) => i.key == "section").section = section;
      let sections = this.sections.map((i) => i.section);
      sections.push(section);
      sections = Array.from(new Set(sections));
      const body = {
        line,
        quantity,
        sections,
        sections_url
      };
      this.style.pointerEvents = "none";
      this.postCart("change", JSON.stringify(body), (resp) => {
        this.style.pointerEvents = "auto";
      });
    }
    onUpdate(evt) {
      const { detail: { sections, status, cart, effect } } = evt;
      if (!status || effect == "none")
        return;
      if (theme.routes.pageType == "cart") {
        !cart.item_count && location.reload();
      } else if (theme.settings.cartStyle == "drawer_desktop" && !window.matchMedia("(min-width: 750px)").matches) {
        window.location.href = theme.routes.cartUrl;
      } else {
        this.open();
      }
    }
    open() {
      this.closest("popup-component")?.open();
    }
    close() {
      this.closest("popup-component")?.close();
    }
  });
})();
