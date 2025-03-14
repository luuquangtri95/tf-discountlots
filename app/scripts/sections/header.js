export default Header = {
  type: 'header'
  , onLoad: function () {
    this.init();
  }
  , init() {
    this.container = this.container || document.querySelector('[data-section-type=header]');

    this.container.querySelectorAll('.main-navigation > li > a').forEach(a => {
      a.addEventListener('mouseenter', this.onNavHover.bind(this, a), { once: true });
      a.addEventListener('focusin', e => {
        a.closest('li').classList.add('is-focusing');
        this.onNavHover(a);
      });

      a.addEventListener('focusout', e => {
        setTimeout(() => {
          !a.closest('li').querySelectorAll('.is-focusing').length && a.closest('li').classList.remove('is-focusing');
        }, 100)
      });
    })

  }

  , onNavHover(el) {
    const nav = el;
    const template = nav.parentNode.querySelector('.jsTemplate');

    if (!template) return;

    template.tagName == 'TEMPLATE' && Array.from(template.content.children)?.forEach(child => {
      template.insertAdjacentElement('beforebegin', child);
    })

    template.tagName == 'NOSCRIPT' && template.insertAdjacentHTML('beforebegin', template.textContent);
    template.remove();

    const parentNode = nav.parentNode;
    parentNode.classList.add('has-dropdown');
    parentNode.classList.toggle('has-mega-menu', parentNode.querySelector('[data-section-type="mega-menu"]'));

    parentNode.querySelector(':scope > a ~ template')?.remove();

    parentNode.querySelectorAll('a').forEach(a => {
      a.addEventListener('focusin', e => {
        a.classList.add('is-focusing');
      });

      a.addEventListener('focusout', e => {
        a.classList.remove('is-focusing');

        setTimeout(() => {
          !parentNode.querySelectorAll('.is-focusing').length && parentNode.classList.remove('is-focusing');
        }, 100)
      });
    })

    this.calHeight();
  }

  , calHeight() {
    this.container.querySelectorAll('.jsCalHeight').forEach(item => {
      item.style.setProperty('--menu-height', item.firstElementChild.scrollHeight + 'px');
    })
  }
}