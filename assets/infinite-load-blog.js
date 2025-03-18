(() => {
  // app/scripts/infinite-load-blog.js
  var InfiniteLoadingElement = class extends HTMLElement {
    constructor() {
      super();
      this.onLoadMoreClick = this.fetch.bind(this);
    }
    connectedCallback() {
      if (!this.dataset.url.length)
        return;
      this.querySelector(".js-load-more").addEventListener("click", this.onLoadMoreClick);
    }
    disconnectedCallback() {
      this.removeEvents();
    }
    removeEvents(remove) {
      this.querySelector(".js-load-more").removeEventListener("click", this.onLoadMoreClick);
      remove && this.remove();
    }
    fetch() {
      this.querySelector(".loading").classList.remove("hidden");
      let url = this.dataset.url;
      fetch(url).then((res) => res.text()).then((html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        this.render(div);
        this.querySelector(".loading").classList.add("hidden");
      });
    }
    render(newContent) {
      newContent.querySelectorAll("article").forEach((item) => {
        document.querySelector(".list-blog").insertAdjacentElement("beforeend", item);
      });
      const urlFetch = newContent.querySelector(this.tagName)?.dataset.url;
      if (!urlFetch || !urlFetch.includes("page=")) {
        this.removeEvents(true);
      } else {
        this.setAttribute("data-url", urlFetch);
      }
    }
  };
  customElements.define("infinite-loading", InfiniteLoadingElement);
})();
