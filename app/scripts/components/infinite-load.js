class infiniteLoading extends HTMLElement {
  constructor() {
    super();
    // this.querySelector('.js-load-more')?.addEventListener('click',()=>{
    //     this.fetch();
    // })
    //this.loading = this.querySelector('.svg_loading')
  }

  connectedCallback() {
    if (!this.dataset.url.length) return;

    // this.removeEvents();
    window.addEventListener("scroll", this.onScrollHandler.bind(this), false);
  }

  disconnectedCallback() {
    this.removeEvents();
  }

  removeEvents(remove) {
    window.removeEventListener("scroll", this.onScrollHandler.bind(this), false);
    remove && this.remove();
  }

  onScrollHandler() {
    if (this.getBoundingClientRect().top < 1 || this.getBoundingClientRect().top > window.innerHeight || this.waiting)
      return;

    this.fetch();
  }

  fetch() {
    if (!this.dataset.url.includes("page")) return;
    this.waiting = true;
    this.classList.add("loading");

    if (!this.dataset.url.length) {
      this.disconnectedCallback();
      return;
    }

    var url = this.dataset.url;
    url += url.includes("?") ? "&" : "?";

    console.log("url", url);
    fetch(url)
      .then((e) => e.text())
      .then((html) => {
        const div = document.createElement("div");
        div.innerHTML = html;

        this.render(div);
        div.remove();
        this.waiting = false;
        this.classList.remove("loading");
      });
  }

  render(newContent) {
    //console.log('newContent', newContent)
    if (newContent.querySelector(".list-products") == null) return;
    Array.from(newContent.querySelector(".list-products")?.children)?.forEach((item) => {
      if (item.classList.contains("info-card")) return;
      document.querySelector(".list-products").insertAdjacentElement("beforeend", item);
    });
    this.setAttribute("data-url", newContent.querySelector(this.tagName)?.dataset.url);

    if (!this.dataset.url.length) {
      this.removeEvents(true);
    }
    // Loading Stamped's widgets with AJAX
    StampedFn.reloadUGC();
  }
}

customElements.define("infinite-loading", infiniteLoading);
