class productCartForm extends cartForm {
  constructor() {
    super();

    if (theme.settings.cartStyle == 'page')
      return;

    this.form = this.querySelector("form");
    this.form.addEventListener("submit", this.onSubmit.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();

    if (!this.form.checkValidity()) {
      this.form.reportValidity();
      return;
    }
    const formData = new FormData(this.form);
    formData.append("sections", this.sectionList());
    formData.append("sections_url", this.dataset.url || location.pathname);

    const bundleItemchecked = this.closest('product-container')?.querySelector('.jsBFDAddOns:checked');
    const effect = !!bundleItemchecked ? 'none' : 'default'; // effect == 'none' <==> don't open cart drawer
    
    this.postCart('add', formData, () => {
      this.closest('popup-component')?.close();

      if (!formData.get('_hidden-price-add-ons')) return;

      const cartCookie = document.cookie.split('; ').find(row => row.startsWith('cart='))?.split('=')[1];
      console.log('cartCookie :>> ', cartCookie);

      fetch(`/apps/options-3/v1/draft-order/${cartCookie}`)
        .then(response => response.json())
        .then(data => {
          if (data.draftOrderCreate?.draftOrder?.invoiceUrl) {
            const shouldProceed = confirm("Bạn có muốn tiếp tục đến trang thanh toán không?");

            if (!shouldProceed) return;
            window.location.href = data.draftOrderCreate.draftOrder.invoiceUrl;
          }
        })
        .catch(error => {
          console.error('Lỗi khi tạo draft order:', error);
        });
    }, effect);
  }

  addBundlesToCart(data, callback) {
    if (!data.sections) data.sections = this.sectionList();
    if (!data.sections_url) data.sections_url = this.dataset.url || location.pathname;
    this.postCart('add', JSON.stringify(data), callback, 'default');
  }
}

!customElements.get("product-cart-form") &&
  customElements.define("product-cart-form", productCartForm);