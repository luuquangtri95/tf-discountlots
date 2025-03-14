export const section = {
  type: "popup-section"
  , onLoad: function (evt) {
    this.popup = this.container.tagName.toLowerCase().includes('popup') ? this.container : this.container.querySelector('popup-component');
    document.body.classList.add('show-popup', 'overflow-hidden');
    this.popup.closest('.shopify-section').classList.add('is-editing');
  }
  , onSelect: function (evt) {
    this.popup = this.container.tagName.toLowerCase().includes('popup') ? this.container : this.container.querySelector('popup-component');
    document.body.classList.add('show-popup', 'overflow-hidden');
    this.popup.closest('.shopify-section').classList.add('is-editing');

    // if(this.popup)
    // this.popup.open();
  }
  , onDeselect: function () {
    document.body.classList.remove('show-popup', 'overflow-hidden');
    this.popup.closest('.shopify-section').classList.remove('is-editing');
    // if(this.popup)
    // this.popup.close();
  }
};

/*
export const section = {
  type: "popup-section",
  onLoad: function(){
    this.popup = this.container.tagName.toLowerCase().includes('popup') ? this.container : this.container.querySelector('popup-component');
  }
  ,onSelect: function(){
    if(!this.popup) return;
    this.popup.open();
    this.container.querySelectorAll('product-slider-component, product-thumbnail-slider-component').forEach(i=>i.load());
  }
  ,onDeselect: function(){
    if(!this.popup) return;
    this.popup.close();
  }
};
*/