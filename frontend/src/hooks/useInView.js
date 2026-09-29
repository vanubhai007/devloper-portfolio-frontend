import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether an element is in the viewport.
 * With `once: true` it stops observing after the first intersection.
 */
export function useInView({ rootMargin = '0px', threshold = 0, once = false } = {}) {
  const ref = useRef(null);
  // Without IntersectionObserver support, treat everything as visible.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView];
}
