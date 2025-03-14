const { inViewPort, addEvent } = theme;
const customElementsName = 'popup-component';

!window.customElements.get(customElementsName) &&
  window.customElements.define(customElementsName, class extends HTMLElement {
    constructor() {
      super();
      this.isOpen = false;

      this.config = {
        activeClass: ['active', 'show'],
        bodyClass: ['show-popup', 'overflow-hidden']
      }

      if (this.hasAttribute('data-body-class')) {
        this.config.customBodyClass = this.getAttribute('data-body-class').split(',');
      }
    }

    connectedCallback() {
      this.addEventListener('click', e => {
        const currentTarget = e.target;

        if (!currentTarget.closest('.popup-content') || currentTarget.closest('.jsClose')) {
          this.close();
          e.stopPropagation();
        }
      });

      window.addEventListener('resize', () => {
        if (!this.isOpen) return;

        const popupContent = this.querySelector('.popup-content');
        if (!popupContent) return;

        inViewPort(popupContent, (isVisible) => {
          if (!isVisible) {
            this.close();
          }
        });
      });

      this.autoAppend();
      this.autoShow();
    }

    close() {
      this.classList.remove(...this.config.activeClass);
      // stopVideo
      this.querySelectorAll('video-component').forEach(item => item.videoStop?.());
      if (this.config.customBodyClass)
        document.body.classList.remove(...this.config.customBodyClass);

      this.removeAttribute('role');
      this.removeAttribute('aria-modal');

      const visibilityCheck = () => {
        const isVisible = window.getComputedStyle(this).opacity;

        if (isVisible != '0')
          requestAnimationFrame(visibilityCheck)
        else {

          this.isOpen = false;

          if (Array.from(document.querySelectorAll('popup-component')).some(i => i.isOpen == true)) return;

          document.body.classList.remove(...this.config.bodyClass);
        }
      }

      requestAnimationFrame(visibilityCheck);
    }

    open(callback = null) {
      this.setAttribute('role', 'dialog');
      this.setAttribute('aria-modal', 'true');
      this.classList.add(...this.config.activeClass);

      document.body.classList.add(...this.config.bodyClass);

      if (this.config.customBodyClass)
        document.body.classList.add(...this.config.customBodyClass);

      const visibilityCheck = () => {
        const isVisible = window.getComputedStyle(this).opacity;

        if (isVisible != '0') {
          this.isOpen = true;

          this.autoHide();

          setTimeout(() => {
            this.querySelector('[auto-focus]')?.focus();
          }, 100)

          callback && callback();
        }
        else {
          requestAnimationFrame(visibilityCheck)
        }
      }

      requestAnimationFrame(visibilityCheck);

    }

    autoAppend() {
      if (!this.hasAttribute("auto-append")) return;

      this.removeAttribute("auto-append");

      const existingNode = document.getElementById(this.id);

      if (existingNode && existingNode !== this) {
        existingNode.after(this);
        existingNode.remove();
      }
    }

    autoShow() {
      if (!this.hasAttribute("auto-show")) return;

      this.removeAttribute("auto-show");
      setTimeout(() => {
        this.open();
      }, 300);
    }

    autoHide() {
      if (!this.hasAttribute("auto-hide")) return;
      if (this.isHiding != null)
        clearTimeout(this.isHiding)

      this.isHiding = setTimeout(() => {
        this.close();
        this.isHiding = null;
      }, +this.getAttribute('auto-hide'));
    }
  });