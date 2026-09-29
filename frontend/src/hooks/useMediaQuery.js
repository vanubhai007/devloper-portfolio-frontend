import { useCallback, useSyncExternalStore } from 'react';

/** Subscribe to a CSS media query. Safe for SSR/older browsers. */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );
  const getSnapshot = () =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false;
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
