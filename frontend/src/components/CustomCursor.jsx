import { useEffect, useRef } from 'react';
import { useFinePointer } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './CustomCursor.module.css';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label';

/** Desktop-only custom cursor. Uses rAF + direct DOM writes, no React re-renders. */
export default function CustomCursor() {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const enabled = finePointer && !reducedMotion;
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    document.body.classList.add('has-custom-cursor');
    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      dotRef.current.classList.remove(styles.hidden);
      ringRef.current.classList.remove(styles.hidden);
    };
    const onOver = (e) => {
      ringRef.current.classList.toggle(styles.active, Boolean(e.target.closest?.(INTERACTIVE)));
    };
    const onLeave = () => {
      dotRef.current.classList.add(styles.hidden);
      ringRef.current.classList.add(styles.hidden);
    };
    const loop = () => {
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;
      ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ringRef} className={`${styles.ring} ${styles.hidden}`} aria-hidden="true" />
      <div ref={dotRef} className={`${styles.dot} ${styles.hidden}`} aria-hidden="true" />
    </>
  );
}
