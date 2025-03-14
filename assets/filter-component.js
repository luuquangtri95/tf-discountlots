(() => {
  // app/scripts/filter-component.js
  var { debounceTime, addEvent } = theme;
  var customElementsName = "filter-component";
  var TIMEOUT = 300;
  !window.customElements.get(customElementsName) && window.customElements.define(
    customElementsName,
    class extends HTMLElement {
      constructor() {
        super();
        this.filterParentWidth = this.getAttribute("data-sb-width");
        this.mobileResetAnim();
      }
      connectedCallback() {
        this.cache = [];
        this.container = this.closest("[data-section-id]");
        this.filterType = this.dataset.type || "attribute";
        this.form = this.querySelector("form");
        this.inputClass = `input[form="${this.form.id}"]`;
        console.log("this.form", this.form);
        this.addEvents();
        this.search();
      }
      addEvents() {
        this.addEventListener("click", (e) => {
          if (e.target.closest(".js-auto-submit")) {
            console.log("testing right now");
            const container = e.target.closest(".filter__block");
            if (e.target.checked) {
              this.querySelectorAll(`#${e.target.id}`).forEach((item) => {
                item.checked = true;
              });
              container?.querySelector(".filter-clear")?.classList.remove("none");
            } else {
              this.querySelectorAll(`#${e.target.id}`).forEach((item) => {
                item.checked = false;
              });
              const allUnchecked = [
                ...container.querySelectorAll(".js-auto-submit")
              ].every((input) => !input.checked);
              if (allUnchecked)
                container?.querySelector(".filter-clear")?.classList.add("none");
            }
            if (e.target.closest("[name=sort_by_clone]")) {
              const input = e.target.closest("[name=sort_by_clone]");
              document.querySelectorAll(`input[name=sort_by]`).forEach((i) => {
                i.checked = input.value == i.value;
              });
            }
            this.autoSumit = true;
            if (e.target.closest("[name=sort_by], [name=sort_by_clone]")) {
              const label = document.querySelector(
                `label[for="${e.target.closest("input").id}"]`
              );
              document.querySelectorAll(".sort-value").forEach((item) => {
                item.innerHTML = label.querySelector(".text") ? label.querySelector(".text").innerHTML : label.innerHTML;
              });
            }
            this.isRunning = null;
          }
          if (e.target.closest(".js-switch-farbic")) {
            this.container.classList.toggle("farbic-mode");
          }
          if (e.target.closest(".filter-clear")) {
            const container = e.target.closest(".filter__block");
            let filters = container.querySelectorAll(".js-auto-submit");
            filters.forEach((e2) => {
              e2.checked = false;
            });
            this.submit();
            e.target.closest(".filter-clear").classList.add("none");
          }
          if (e.target.closest(".js-filter-submit")) {
            e.preventDefault();
            this.submit();
          }
          if (e.target.closest(".view-item")) {
            this.querySelector(".main-products").classList.remove(
              "desktop-view-2",
              "desktop-view-3",
              "desktop-view-4"
            );
            this.querySelector(".main-products").classList.add(
              `desktop-view-${e.target.closest(".view-item").dataset.view}`
            );
            this.querySelectorAll(".view-item").forEach(
              (e2) => e2.classList.remove("active")
            );
            e.target.closest(".view-item").classList.add("active");
            this.checkBanner();
          }
          if (e.target.closest(".jsFilter")) {
            const main_filter = this.querySelector(".main-filter");
            main_filter?.classList.contains("active") ? main_filter.classList.remove("active") : main_filter.classList.add("active");
            e.target.closest(".jsFilter").classList.contains("active") ? e.target.closest(".jsFilter").classList.remove("active") : e.target.closest(".jsFilter").classList.add("active");
          }
          if (e.target.closest(".jsToggleFilter")) {
            e.preventDefault();
            e.stopPropagation();
            this.filterAnim(e.target.closest(".jsToggleFilter"));
          }
          if (e.target.closest(".jsFilterReset")) {
            e.preventDefault();
            this.uncheckInput();
            this.submit();
          }
          if (e.target.closest(".jsFilterRemove")) {
            e.preventDefault();
            if (this.isRunning != null)
              clearTimeout(this.isRunning);
            this.isRunning = setTimeout(() => {
              const item = e.target.closest(".jsFilterRemove");
              const { value } = item.querySelector(".jsValue").dataset;
              this.querySelectorAll(`input[form="${this.form.id}"]`).forEach(
                (item2) => {
                  if (item2.value != value)
                    return;
                  item2.checked = false;
                }
              );
              this.submit();
              this.isRunning = null;
            }, TIMEOUT);
          }
        });
        const inputList = this.querySelectorAll(this.inputClass);
        inputList?.forEach((input) => {
          input.addEventListener(
            "change",
            debounceTime((e) => {
              const input2 = e.target;
              this.autoSumit && this.submit();
            }, TIMEOUT).bind(this)
          );
        });
        this.checkBanner();
      }
      checkBanner() {
        document.querySelectorAll(".collection__main-products .info-card").forEach((ele) => ele.remove());
        let page_banners = document.querySelector("#collection-banner")?.content.querySelectorAll(".info-card");
        page_banners?.forEach((e) => {
          let index = e.dataset.position;
          if (document.querySelector(".view-2-item").classList.contains("active")) {
            index++;
          }
          const parent = document.querySelector(".list-products");
          const clonedElement = e.cloneNode(true);
          const reference = parent.children[index] || null;
          parent.insertBefore(clonedElement, reference);
        });
      }
      uncheckInput(input = null) {
        let inputList;
        if (input) {
          inputList = this.querySelectorAll(
            `input[name="${input.name}"][form="${this.form.id}"]:not([id="${input.id}"])`
          );
        } else {
          inputList = this.querySelectorAll(`input[form="${this.form.id}"]`);
        }
        inputList.forEach((i) => {
          i.removeAttribute("checked");
          i.checked = false;
        });
      }
      getQueryString() {
        const formData = new FormData(this.form);
        formData.delete("sort_by_clone");
        const query = new URLSearchParams(formData);
        if (this.filterType == "attribute") {
          return query.toString();
        }
        const arrayFilter = [];
        let sort = "";
        query.split("&").map((i) => {
          !i.includes("sort_by=") ? arrayFilter.push(i.split("=")[1]) : sort = i;
        });
        return arrayFilter.join("+") + (sort.length ? `?${sort}` : "");
      }
      async submit() {
        const query = this.getQueryString();
        const findInCache = this.cache.find((i) => i.query == query);
        if (findInCache) {
          this.render(findInCache.DOM, findInCache.query);
          return;
        }
        let url = this.form.action;
        url += this.filterType == "attribute" ? "?" : "/";
        url += query;
        url += this.filterType == "attribute" || query.includes("?") ? "&" : "?";
        url += `section_id=${this.dataset.sectionId}`;
        await fetch(url).then((e) => e.text()).then((html) => {
          const div = document.createElement("div");
          div.innerHTML = html;
          this.cache.push({
            query,
            DOM: div
          });
          this.render(div, query);
          div.remove();
        });
      }
      render(result, searchParams = null) {
        if (searchParams) {
          let splitCharacter = this.filterType == "attribute" ? "?" : !searchParams.includes("?") || searchParams.includes("?") && searchParams.split("?")[0].length ? "/" : "";
          history.pushState(
            { searchParams },
            "",
            `${this.form.action}${searchParams && splitCharacter.concat(searchParams)}`
          );
        }
        const nInputList = result.querySelectorAll(this.inputClass);
        const inputList = this.querySelectorAll(this.inputClass);
        inputList?.forEach((input, i) => {
          input.checked = nInputList[i]?.checked || false;
        });
        document.querySelectorAll(".jsFilterUpdate")?.forEach((item) => {
          const newItem = result.querySelector(`[class="${item.className}"]`);
          if (!newItem)
            return;
          item.innerHTML = newItem.innerHTML;
        });
        this.checkBanner();
        this.autoSumit = null;
      }
      getSearchUrl() {
        const searchForm = this.querySelector('form[action*="search"]');
        const formData = new FormData(searchForm);
        const url = new URLSearchParams(formData).toString();
        return searchForm.action + "?" + url;
      }
      search() {
        const searchForm = this.querySelector('form[action*="search"]');
        if (!searchForm)
          return;
        searchForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const query = this.getSearchUrl();
          const findInCache = this.cache.find((i) => i.query == query);
          if (findInCache) {
            this.render(findInCache.DOM);
            return;
          }
          fetch(query).then((e2) => e2.text()).then((html) => {
            const div = document.createElement("div");
            div.innerHTML = html;
            this.cache.push({
              query,
              DOM: div
            });
            this.render(div);
            div.remove();
          });
        });
      }
      filterAnim(button, duration = 500) {
        const filter = this.querySelector("#filterPopup");
        if (button) {
          button.style.pointerEvents = "none";
        }
        const framesWidth = this.classList.contains("show-filter") ? {
          flexBasis: [this.filterParentWidth, "0px"],
          maxWidth: [this.filterParentWidth, "0px"]
        } : {
          flexBasis: ["0px", this.filterParentWidth],
          maxWidth: ["0px", this.filterParentWidth]
        };
        const framesMove = this.classList.contains("show-filter") ? {
          transform: ["translateX(0)", "translateX(-100%)"],
          position: ["static", "absolute"],
          width: [this.filterParentWidth, this.filterParentWidth],
          opacity: ["1", "0"]
        } : {
          transform: ["translateX(-100%)", "translateX(0)"],
          position: ["absolute", "static"],
          width: [this.filterParentWidth, "auto"],
          opacity: ["0", "1"]
        };
        this.animRun = filter.closest(".collection__main-filter").animate(framesWidth, {
          duration,
          fill: "both",
          easing: "cubic-bezier(0.645, 0.045, 0.355, 1)"
        });
        this.animChildRun = filter.firstElementChild.animate(framesMove, {
          duration,
          fill: "both",
          easing: "cubic-bezier(0.645, 0.045, 0.355, 1)"
        });
        this.animRun.onfinish = () => {
          if (button) {
            button.style.pointerEvents = null;
          }
          if (this.classList.contains("show-filter")) {
            this.classList.remove("show-filter");
            this.filterDesktopHidden = true;
          } else {
            this.classList.add("show-filter");
            this.filterDesktopHidden = false;
          }
        };
      }
      mobileResetAnim() {
        const filter = this.querySelector("#filterPopup");
        const observer = new ResizeObserver((e) => {
          const isMobile = window.matchMedia("(max-width: 991px)").matches;
          if (isMobile == this.isMobile)
            return;
          this.isMobile = isMobile;
          if (isMobile && this.filterDesktopHidden) {
            this.filterAnim(null, 400);
          }
        });
        observer.observe(this);
      }
    }
  );
  addEvent("click", ".jsFilterShowMore", ({ target }) => {
    const container = target.closest(".filter__block");
    const filterList = container.querySelectorAll(".jsFilterToggle.none");
    filterList.forEach((item) => {
      item.classList.remove("none");
    });
    target.classList.add("none");
    container.querySelector(".jsFilterShowLess").classList.remove("none");
  });
  addEvent("click", ".jsFilterShowLess", ({ target }) => {
    const container = target.closest(".filter__block");
    const filterList = container.querySelectorAll(".jsFilterToggle");
    filterList.forEach((item, index) => {
      if (index >= 5) {
        item.classList.add("none");
      }
    });
    target.classList.add("none");
    container.querySelector(".jsFilterShowMore").classList.remove("none");
  });
})();
