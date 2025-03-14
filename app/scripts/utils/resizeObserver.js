export default function resizeObserver(selector, callback, debounceTimeout = 300) {
  const { debounceTime } = theme;

  let lastWidth = selector.clientWidth;

  const debounce = debounceTime(e => {

    let newestWidth = selector.clientWidth;

    if (newestWidth == lastWidth) return;

    callback.apply(selector);

    lastWidth = newestWidth;

  }, debounceTimeout);

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver((entries) => {
      debounce.call(selector);
    });
    resizeObserver.observe(selector);
  }
  else {
    window.addEventListener('resize', () => debounce.bind(selector));
  }
}