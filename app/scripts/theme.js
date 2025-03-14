
import "./utils";
import FastClick from "fastclick";
import "./components/lazyScript.js";
import "./utils/calculateScrollBarWidth.js";
import "./utils/toggleClass.js";
import "./utils/togglePopup.js";
import "./utils/loadTemplate.js";
import "./utils/keyEvents.js";
import "./utils/currencies.js";
import "./utils/cart.js";
import "./components/pictureComponent.js";
import "./components/popupComponent.js";
import "./components/quantity.js";
import "./components/foreignMarkets.js";
import "./components/productCart.js";

document.addEventListener('click', function (e) {
    const { target } = e;
    const el = target.closest(".jsClipboard");

    if (el) {
        el.classList.add("copied");
        navigator.clipboard.writeText(el.dataset.value);
    }
});

document.body.addEventListener("keyup", (e) => {
    e.code == "Escape" &&
        document.querySelectorAll("popup-component.active").forEach((popup) => {
            popup.close();
        });
});

window.addEventListener("resize", () => {
    document.body.classList.add("is-resizing");

    if (theme.isResize) clearTimeout(theme.isResize);

    theme.isResize = setTimeout(() => {
        document.body.classList.remove("is-resizing");
        theme.isResize = null;
    }, 300);
});

FastClick?.(document.body);