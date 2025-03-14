class ShippingCalculator extends HTMLElement {
  constructor() {
    super();

    this.url = this.dataset.url;
    this.form = this.querySelector('form');
    this.country = this.querySelector('[name*=country]');
    this.province = this.querySelector('[name*=province]');
    this.zip = this.querySelector('[name*=zip]');

    this.country.addEventListener('change', this.countryChange.bind(this));

    this.form.addEventListener('submit', this.onSubmit.bind(this));
  }

  countryChange(){
    const province = JSON.parse(this.country.options[this.country.selectedIndex].dataset.provinces);

    this.province.innerHTML = '';

    if(province.length){
      province.forEach(item=>{
        const option = document.createElement('option');
        option.value = item[0];
        option.textContent = item[1];
        this.province.insertAdjacentElement('beforeend', option);
      });

      this.province.closest('.form-field').style.display = null;
    }else{
      this.province.closest('.form-field').style.display = 'none';
    }
  }

  onSubmit(e){
    e.preventDefault();
    this.classList.add('calculating');
    let formData = new FormData(this.form);
    let searchParams = new URLSearchParams(formData).toString();

    fetch(this.url + '?' + searchParams).then(e=>e.json()).then(e=>{
      console.log(e);
      this.renderResult(e);
    })
    .finally(()=>{
      this.classList.remove('calculating');
    })
  }

  renderResult(e){
    let shippingTitle = theme.shippingString.not_found_shipping_rate;
    if(e.shipping_rates && e.shipping_rates.length > 1){
      shippingTitle = theme.shippingString.many_shipping_rates.replace('{{number}}', e.shipping_rates.length);
    }
    else if(e.shipping_rates && e.shipping_rates.length == 1){
      shippingTitle = theme.shippingString.one_shipping_rate;
    }
    this.querySelector('.js-response-title').innerHTML = shippingTitle;

    const resultWrapper = this.querySelector('.js-shipping-result');
    const template = this.querySelector('template').content.firstElementChild;
    const div = document.createElement('div');

    resultWrapper.innerHTML = '';

    e.shipping_rates && e.shipping_rates.forEach(item=>{      
      div.innerHTML = template.outerHTML;
      div.querySelector('.shipping-name').innerHTML = item.name;
      div.querySelector('price-component').set(item.price);
      resultWrapper.insertAdjacentHTML('beforeend', div.innerHTML);
    })

  }
}

customElements.define('shipping-calculator', ShippingCalculator);
