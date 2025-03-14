!window.customElements.get("product-form") &&
    customElements.define(
        "product-form",
        class extends HTMLElement {
            constructor() {
                super();

                window.addEventListener("konfigurator:updated", this.handleKonfiguratorUpdated.bind(this));

                this.form = this.querySelector("product-cart-form form");
                if (this.form) this.spoObserver();
            }

            spoObserver() {
                const callback = (mutationList, observer) => {
                    for (const mutation of mutationList) {
                        if (mutation.type === "childList") {
                            mutation.addedNodes.forEach((node) => {
                                if (node.tagName === "INPUT" && node.name === "properties[_spo_option_settings]") {
                                    this.additionalPriceObserver();
                                    observer.disconnect();
                                }
                            });
                        }
                    }
                };

                const observer = new MutationObserver(callback);
                observer.observe(this.form, { childList: true, subtree: true });
            }

            additionalPriceObserver() {
                this.spoEmbed = this.querySelector('spo-embed');
                if (!this.spoEmbed) return;

                this.spoEmbed.addEventListener('change', (e)=>{
                    setTimeout(()=>{
                        const currentValue = this.querySelector('input[name="properties[_spo_option_settings]"]').value;
                        const json = JSON.parse(currentValue);
                        const totalPriceAdjustment = json.reduce((sum, item) => {
                            const price_adjustment = item.price_adjustment || 0;
                            return sum + price_adjustment;
                        }, 0);
                        const mainPrice = this.querySelector(".js-main-price");
                        if (!mainPrice) return;

                        if (this.originalPrice == undefined) this.originalPrice = +mainPrice.dataset.value;
                        const updatedPrice = this.originalPrice + totalPriceAdjustment * 100;
                        mainPrice.set(updatedPrice);
                    }, 500);
                });
            }

            handleKonfiguratorUpdated({ detail }) {
                const { updatedPrice } = detail;

                this.querySelector(".js-main-price")?.set(updatedPrice);
            }

            connectedCallback() {
                this.scriptElement = this.querySelector('script[type="application/json"].object-product');

                this.JSON = this.scriptElement ? JSON.parse(this.scriptElement.textContent).product : window.theme.product;
                this.linkOptions();
                this.addEventListener("change", this.onChange.bind(this));
                //this.template = this.querySelector("[data-variant-template]")?.content || null;

                this.container = this.closest("popup-component") || this.closest(".shopify-section");
            }

            async onChange(event) {
                const target = event.target;

                if (!target.classList.contains("js-variant-change")) return;

                let index = +target.name.replace(/[^\d]/g, "");

                if (index == 1) {
                    this.updateOptionsInSelector(2);
                    this.updateOptionsInSelector(3);
                }

                if (index == 2) {
                    this.updateOptionsInSelector(3);
                }

                if (!this.getVariant()) return;

                this.updateMedia();

                if (this.closest(".shopify-section-main-product")) {
                    this.updateURL();
                }

                if (this.currentVariant) {
                    this.updateId();
                    this.updateAffirm();
                    // this.updateContent();
                    await this.updateContentNew();
                } else {
                    this.setUnavailable();
                }

                this.closest(".product-container")?.classList.toggle("variant-soldout", !this.currentVariant?.available || false);
                this.closest("product-card")?.classList.toggle("card__soldout", !this.currentVariant?.available || false);

                const { swatchId } = target.dataset;
                this.querySelector(swatchId)?.classList.remove("active");
            }

            updateAffirm() {
                this.querySelector(".affirm-as-low-as").setAttribute("data-amount", this.currentVariant.price);
                affirm?.ui?.refresh();
            }

            updateId() {
                if (this.currentVariant) {
                    const masterID = this.querySelector('[name="id"]');
                    if (masterID.tagName == "SELECT") {
                        masterID.value = this.currentVariant.id;
                        masterID.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                }
            }

            getCurrentOptions() {
                let currentOptions = [];
                this.JSON.options.forEach((option, index) => {
                    let optionName = `[name="option${index + 1}"]`;

                    if (this.querySelector(optionName).tagName == "INPUT") {
                        currentOptions.push(this.querySelector(optionName + ":checked")?.value);
                    } else {
                        currentOptions.push(this.querySelector(optionName)?.value);
                    }
                });

                return currentOptions;
            }

            getVariant() {
                const options = this.getCurrentOptions();

                this.currentVariant = this.JSON.variants.find((variant) => {
                    return !variant.options
                        .map((option, index) => {
                            return options[index] === option;
                        })
                        .includes(false);
                });

                if (!this.currentVariant) {
                    let selectOptions = Array.from(this.querySelectorAll("select[name*=option], input[name*=option]:checked")).filter((i) => i != null);

                    if (this.JSON.options.length != selectOptions.length) return false;
                }

                return true;
            }

            updateURL() {
                if (!this.currentVariant) return;
                window.history.replaceState({}, "", `${this.dataset.url}?variant=${this.currentVariant.id}`);
            }

            async updateContentNew() {
                try {
                    const response = await fetch(`${this.dataset.url}?variant=${this.currentVariant.id}`);
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                    const text = await response.text();
                    const html = new DOMParser().parseFromString(text, "text/html");
                    const mainProductSection = html.querySelector(".shopify-section-main-product") || html.querySelector("product-form");
                    if (!mainProductSection) {
                        console.warn("mainProductSection not found!!!");
                        return;
                    }

                    Array.from(this.querySelectorAll(".jsVariantUpdate")).forEach((node) => {
                        const selector = Array.from(node.classList)
                            .map((cls) => `.${CSS.escape(cls)}`)
                            .join("");
                        const newNode = mainProductSection.querySelector(selector);

                        if (newNode) {
                            node.replaceWith(newNode);
                        }
                    });
                } catch (error) {
                    console.error("error::", error);
                }
            }

            // updateContent() {
            //     const template = this.template.querySelector(`[data-variant-id="${this.currentVariant?.id}"]`);

            //     Array.from(document.querySelectorAll(".jsVariantUpdate")).forEach((node) => {
            //         const { updateId } = node.dataset;

            //         if (!updateId.includes(this.dataset.formId)) return;

            //         const target = template?.querySelector(`.jsVariantUpdate[data-update-id="${node.dataset.updateId}"]`);
            //         node.innerHTML = target?.innerHTML || "";

            //         target && (node.className = target.className);
            //     });

            //     this.querySelectorAll("select[name*=option], input[name*=option]:checked").forEach(item => {
            //         this.querySelector(`.js-variant-update-label[data-option="${item.getAttribute('name')}"]`).innerHTML = item.getAttribute('value');
            //     })
            //     // document.querySelectorAll('.js-dynamic-checkout button')?.forEach(button=>button.toggleAttribute('disabled', !this.currentVariant.available));
            // }

            updateMedia() {
                if (!this.currentVariant || !this.currentVariant.featured_media) return;
                const index = this.currentVariant.featured_media.position - 1;

                this.container.querySelector("product-slider-component.slide-initialized.js-slider-main")?.goTo(index);
            }

            setUnavailable() {
                this.querySelectorAll(".add-to-cart")?.forEach((item) => {
                    item.innerHTML = theme.string.unavailable;
                });

                this.querySelectorAll('.jsVariantUpdate[data-update-id*="price"]')?.forEach((item) => {
                    item.innerHTML = `<span class="price">${theme.string.unavailable}</span>`;
                });
            }

            linkOptions() {
                this.optionsMap = {};
                this.availableOptions = {};

                for (var i = 0; i < this.JSON.variants.length; i++) {
                    let variant = this.JSON.variants[i];

                    this.optionsMap["root"] = this.optionsMap["root"] || [];
                    this.optionsMap["root"].push(variant.option1);
                    this.optionsMap["root"] = [...new Set(this.optionsMap["root"])];

                    if (this.JSON.options.length > 1) {
                        var key = variant.option1;
                        this.optionsMap[key] = this.optionsMap[key] || [];
                        this.optionsMap[key].push(variant.option2);
                        this.optionsMap[key] = [...new Set(this.optionsMap[key])];
                    }

                    if (this.JSON.options.length === 3) {
                        var key = variant.option1 + " / " + variant.option2;
                        this.optionsMap[key] = this.optionsMap[key] || [];
                        this.optionsMap[key].push(variant.option3);
                        this.optionsMap[key] = [...new Set(this.optionsMap[key])];
                    }

                    if (variant.available) {
                        this.availableOptions["root"] = this.availableOptions["root"] || [];
                        this.availableOptions["root"].push(variant.option1);
                        this.availableOptions["root"] = [...new Set(this.availableOptions["root"])];

                        if (this.JSON.options.length > 1) {
                            var key = variant.option1;
                            this.availableOptions[key] = this.availableOptions[key] || [];
                            this.availableOptions[key].push(variant.option2);
                            this.availableOptions[key] = [...new Set(this.availableOptions[key])];
                        }

                        if (this.JSON.options.length === 3) {
                            var key = variant.option1 + " / " + variant.option2;
                            this.availableOptions[key] = this.availableOptions[key] || [];
                            this.availableOptions[key].push(variant.option3);
                            this.availableOptions[key] = [...new Set(this.availableOptions[key])];
                        }
                    }
                }

                if (!Array.from(this.querySelectorAll("select[name*=option], input[name*=option]:checked")).filter((i) => i != null).length) return;

                this.updateOptionsInSelector(1);
                this.JSON.options.length > 1 && this.updateOptionsInSelector(2);
                this.JSON.options.length === 3 && this.updateOptionsInSelector(3);
            }

            updateOptionsInSelector(index) {
                let key;
                let selector;

                const optionEl = {
                    option1: Array.from(this.querySelectorAll("select[name=option1], input[name=option1]:checked")).find((i) => i != null),
                    option2: Array.from(this.querySelectorAll("select[name=option2], input[name=option2]:checked")).find((i) => i != null),
                    option3: Array.from(this.querySelectorAll("select[name=option3], input[name=option3]:checked")).find((i) => i != null),
                };

                switch (index) {
                    case 1:
                        key = "root";
                        selector = optionEl.option1;
                        break;

                    case 2:
                        key = optionEl.option1?.value;
                        selector = optionEl.option2;
                        break;

                    default:
                        key = optionEl.option1?.value;
                        selector = optionEl.option3;
                        key += " / " + optionEl.option2?.value;
                        index = 3;
                }

                if (!selector) {
                    selector = Array.from(this.querySelectorAll(`select[name=option${index}], input[name=option${index}]`)).find((i) => i != null);
                }

                const availableOptions = this.optionsMap[key] || [];
                const optionsValid = this.availableOptions[key] || [];
                const initialValue = selector?.value || "null";

                if (!selector) return;

                if (selector.tagName == "SELECT") {
                    Array.from(selector.querySelectorAll("option")).forEach((option) => {
                        availableOptions.includes(option.value) ? option.removeAttribute("hidden") : option.setAttribute("hidden", "");
                    });

                    if (availableOptions.length && !availableOptions.includes(initialValue)) {
                        selector.value = availableOptions[0];
                    }
                } else {
                    Array.from(this.querySelectorAll(`[name=${selector.name}]`)).forEach((input) => {
                        input.classList.toggle("disabled", !optionsValid.includes(input.value));
                    });

                    if (availableOptions.length && !availableOptions.includes(initialValue)) {
                        const tempInput = document.createElement("input");
                        tempInput.type = "text";
                        tempInput.value = availableOptions[0];

                        const findAvailableInput = Array.from(this.querySelectorAll(`[name=${selector.name}]`)).find((input) => input.value == tempInput.value);
                        findAvailableInput && (findAvailableInput.checked = true);
                    }
                }
            }
        }
    );
