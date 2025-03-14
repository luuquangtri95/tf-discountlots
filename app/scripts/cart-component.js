import './components/cartRecommendation';
import './components/cartRemove';
import './components/cartNote';

!customElements.get("cart-component") &&
  customElements.define("cart-component", class extends cartForm {
    constructor() {
      super();
    }

    connectedCallback() {
      console.log('cart-component::connectedCallback');
      const { debounceTime } = theme;
      const debounce = debounceTime((e) => this.change(e), 300);
      this.addEventListener('change', debounce.bind(this));

      this.onUpdate = this.onUpdate.bind(this);
      window.addEventListener('cart:update', this.onUpdate);

      // app Dr Stacked Discounts
      // window.theme = window.theme || {};
      // window.theme.refreshCart = this.onRefresh.bind(this);

      // document.body.addEventListener('docapp-applied-discount-code-changed', ()=>{
      //   this.onRefresh();
      // })

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
      window.removeEventListener('cart:update', this.onUpdate);
    }

    onRefresh() {
      console.log('onRefresh:::');
      const section = theme.routes.pageType == 'cart' ? this.getAttribute('data-section-id') : 'cart-section';
      this.sections.find(i => i.key == 'section').section = section;
      let sections = this.sections.map(i => i.section);
      sections.push(section);
      sections = Array.from(new Set(sections));

      Promise.all([
        fetch(`${location.pathname}?sections=${sections}`),
        fetch(`${theme.routes.cartUrl}.js`)
      ])
        .then(async ([response1, response2]) => {
          const data1 = await response1.json();
          const data2 = await response2.json();
          data2.sections = data1;
          console.log('data2::', data2);
          this.update({ detail: { sections: data1, status: response1.status, cart: data2, effect: 'default' } })
        })
        .catch(error => console.error('Fetch error:', error));
    }

    change(event) {
      let target = event.target;
      let quantity = 0;

      if (event.detail) {
        target = event.detail.customElement;
      }
      else {
        quantity = +target.value;
      }

      let { line, sections: section, sections_url } = target.dataset;

      if (!line) return;

      this.sections.find(i => i.key == 'section').section = section;

      let sections = this.sections.map(i => i.section);
      sections.push(section);
      sections = Array.from(new Set(sections));

      const body = {
        line,
        quantity,
        sections,
        sections_url
      };

      this.style.pointerEvents = 'none';
      // target.replaceWith(document.querySelector('#svg_loading > svg').cloneNode(true));

      this.postCart('change', JSON.stringify(body), (resp) => {
        this.style.pointerEvents = 'auto';
      })
    }

    onUpdate(evt) {
      const { detail: { sections, status, cart, effect } } = evt;

      if (!status || effect == 'none') return;

      if (theme.routes.pageType == 'cart') {
        !cart.item_count && location.reload();
      }
      else if (theme.settings.cartStyle == 'drawer_desktop' && !window.matchMedia('(min-width: 750px)').matches) {
        window.location.href = theme.routes.cartUrl;
      }
      else {
        this.open();
        // if (isScriptLoaded('product-select-addons-popup.js')) {
        //   window.dispatchEvent(new CustomEvent('addOn:open'));
        // } else {
        //   const script = document.createElement("script");
        //   script.src = window.theme.assets.pdpAddons;
        //   script.onload = () => {
        //     window.dispatchEvent(new CustomEvent('addOn:open'));
        //   };
        //   document.head.insertAdjacentElement("beforeend", script);
        // }
      }

      // status ? this.open() : this.close();
    }

    open() {
      this.closest('popup-component')?.open();
    }
    close() {
      this.closest('popup-component')?.close();
    }
  });