import { useEffect, useRef, useState } from 'react';

/**
 * useInView — triggers when an element enters the viewport.
 * Useful for firing anime.js animations on scroll.
 *
 * @param {Object} options
 * @param {number} options.threshold - 0 to 1, how much of element must be visible
 * @param {string} options.rootMargin - CSS margin string
 * @param {boolean} options.once - if true, fires only once
 */
export function useInView({ threshold = 0.2, rootMargin = '0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
