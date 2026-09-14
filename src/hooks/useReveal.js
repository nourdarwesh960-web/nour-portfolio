import { useEffect } from 'react';

export function useReveal(selector = '.reveal', deps = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll(selector);
    if (!nodes.length) return;
    const ob = new IntersectionObserver(
      (ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            ob.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    nodes.forEach((n) => ob.observe(n));
    return () => ob.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
