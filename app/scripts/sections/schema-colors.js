export const section = {
    type: 'schema-colors'
    , onLoad: function () {
        const bodyClass = this.container.closest('popup-component').dataset.bodyClass;
        document.body.classList.add(bodyClass);
    }
    , onSelect: function () {
        const bodyClass = this.container.closest('popup-component').dataset.bodyClass;
        document.body.classList.add(bodyClass);
    }
    , onDeselect: function (evt) {
        const bodyClass = this.container.closest('popup-component').dataset.bodyClass;
        document.body.classList.remove(bodyClass);
    }
    , onBlockSelect: function (e) {
        const bodyClass = this.container.closest('popup-component').dataset.bodyClass;
        document.body.classList.add(bodyClass);

    }
    , onBlockDeselect: function (e) {
        const bodyClass = this.container.closest('popup-component').dataset.bodyClass;
        document.body.classList.remove(bodyClass);
    }
};