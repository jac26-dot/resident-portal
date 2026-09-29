const TARGETS = '.section-title, .doc-card, .info-item, .gallery-item';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-reveal');

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  const scan = () => {
    document.querySelectorAll(TARGETS).forEach((el) => {
      if (!el.dataset.rv) {
        el.dataset.rv = '1';
        io.observe(el);
      }
    });
  };

  new MutationObserver(scan).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  scan();
}
