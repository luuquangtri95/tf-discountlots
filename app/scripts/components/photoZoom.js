import PhotoSwipeLightbox from 'photoswipe/lightbox';

!window.customElements.get('photo-zoom') &&
window.customElements.define('photo-zoom', class extends HTMLElement{
  constructor(){
    super();
  }

  connectedCallback(){
    const template = this.querySelector('template').content;
    const arrowIcon = template.querySelector('.icon-arrow').outerHTML;
    const closeIcon = template.querySelector('.icon-close').outerHTML;
    const zoomIcon = template.querySelector('.icon-zoom').outerHTML;

    this.lightbox = new PhotoSwipeLightbox({
      arrowPrevSVG: arrowIcon,
      arrowNextSVG: arrowIcon,
      closeSVG: closeIcon,
      zoomSVG: zoomIcon,
      bgOpacity: 0.8,
      mainClass: 'pswp--custom-bg',
      gallery: this,
      children: '.photo-zoom-item',
      pswpModule: () => import('photoswipe')
    });


    this.lightbox.init();
  }
})