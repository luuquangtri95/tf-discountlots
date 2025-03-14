export default function inViewPort(el, callback, once = false) {
  if (!el || typeof callback !== 'function') return;

  const options = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0 // trigger when element first appears in viewport
  };

  const observer = new IntersectionObserver((entries) => {
    const isIntersecting = entries[0].isIntersecting;

    callback(isIntersecting, entries);

    if (isIntersecting && once) {
      observer.disconnect();
    }
  }, options);

  observer.observe(el);

  // Return function to cleanup observer when needed
  return () => observer.disconnect();
}
