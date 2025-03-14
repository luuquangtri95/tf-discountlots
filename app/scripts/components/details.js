document.addEventListener('click', e => {
  const detailsOpening = document.querySelectorAll('details[open]');

  if (!detailsOpening.length || e.target.closest('details')) return;

  detailsOpening.forEach(item => {
    if (item.closest('lazy-script, accordion-component, .section-announcement-bar')) return;
    item.open = false;
  })
})

!window.customElements.get('accordion-component') &&
  window.customElements.define('accordion-component', class extends HTMLElement {
    constructor() {
      super();

      if (this.hasAttribute('data-open-screen') || this.hasAttribute('data-close-screen')) {
        const { debounceTime } = theme;
        const debounce = debounceTime(e => this.changeState(e), 300);
        window.addEventListener('resize', debounce.bind(this));
      }

      this.querySelectorAll('summary a').forEach(link => {
        link.addEventListener('click', e => {
          e.stopPropagation();
        })
      })
      this.changeState();

      setTimeout(() => {
        this.querySelector('details') && this.init();
      }, 0)

      this.observeClassChanges();
    }

    observeClassChanges() {
      const observer = new MutationObserver(() => {
        const details = this.querySelector('details');
        if (!details) return;

        if (this.classList.contains('show')) {
          if (!details.open) {
            details.querySelector('summary')?.click();
          }
        } else {
          if (details.open) {
            details.querySelector('summary')?.click();
          }
        }
      });

      observer.observe(this, { attributes: true, attributeFilter: ['class'] });
    }

    init() {
      this.details = this.querySelector('details');
      this.summary = this.details.querySelector(':scope > summary');
      this.close = this.details.querySelector('.js-details-close');
      this.content = this.details.querySelector(':scope > *:not(summary)');

      this.animation = null;
      this.isClosing = false;
      this.isExpanding = false;

      this.summary.addEventListener('click', (e) => this.onClick(e));

      if (this.close) {
        this.close.closest('details') == this.details && this.close.addEventListener('click', (e) => this.onClick(e));
      }
      this.details.classList.add('accordion-initialized');
    }

    onClick(e) {
      e.preventDefault();
      e.stopPropagation();

      this.details.style.overflow = 'hidden';

      if (this.isClosing || !this.details.open) {
        this.open();
      } else if (this.isExpanding || this.details.open) {
        this.shrink();
      }
    }

    shrink() {
      this.isClosing = true;

      const summaryPosition = window.getComputedStyle(this.summary).position;

      const startHeight = `${this.details.offsetHeight}px`;
      const endHeight = `${summaryPosition == 'absolute' ? 0 : this.summary.offsetHeight}px`;


      if (this.animation) {
        this.animation.cancel();
      }
      this.details.classList.add('is-closing');
      this.animation = this.details.animate({
        height: [startHeight, endHeight]
      }, {
        duration: 400,
        easing: 'ease-out'
      });

      this.animation.onfinish = () => this.onAnimationFinish(false);
      this.animation.oncancel = () => this.isClosing = false;
    }

    open() {
      this.details.style.height = `${this.details.offsetHeight}px`;
      this.details.open = true;
      this.details.classList.add('is-opening');
      window.requestAnimationFrame(() => this.expand());
    }

    expand() {
      this.isExpanding = true;

      const summaryPosition = window.getComputedStyle(this.summary).position;
      const startHeight = `${this.details.offsetHeight}px`;
      const endHeight = `${summaryPosition == 'absolute' ? this.content.offsetHeight : this.details.scrollHeight}px`;

      if (this.animation) {
        this.animation.cancel();
      }

      const s = Math.abs(+startHeight.replace('px', '') - endHeight.replace('px', ''));
      const v = s / 50;

      this.animation = this.details.animate({
        height: [startHeight, endHeight]
      }, {
        duration: 400,//v*100,
        easing: 'ease-out'
      });
      this.animation.onfinish = () => this.onAnimationFinish(true);
      this.animation.oncancel = () => this.isExpanding = false;
    }

    onAnimationFinish(open) {
      this.details.open = open;
      this.animation = null;
      this.isClosing = false;
      this.isExpanding = false;

      this.details.classList.remove('is-closing', 'is-opening');
      this.details.style.height = this.details.style.overflow = '';
    }

    changeState() {
      this.hasAttribute('data-open-screen') && window.matchMedia(this.getAttribute('data-open-screen')).matches && (this.querySelector('details').open = true);
      this.hasAttribute('data-close-screen') && window.matchMedia(this.getAttribute('data-close-screen')).matches && (this.querySelector('details').open = false);
    }
  })