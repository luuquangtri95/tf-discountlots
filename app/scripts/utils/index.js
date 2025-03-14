import storage from './localStorage.js';
import addEvent from './addEvent.js';
import debounceTime from './debounceTime.js';
import resizeObserver from './resizeObserver.js';
import inViewPort from './inViewPort.js';

window.theme = Object.assign(window.theme, {
    addEvent,
    storage,
    debounceTime,
    resizeObserver,
    inViewPort,
});