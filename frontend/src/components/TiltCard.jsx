import { useRef } from 'react';
import { useFinePointer } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Adds a subtle 3D tilt + moving highlight on mouse move.
 * Writes CSS variables directly (no React state) to avoid re-renders.
 */
export default function TiltCard({ children, max = 8, className = '', style, ...rest }) {
  const ref = useRef(null);
  const frame = useRef(0);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const enabled = finePointer && !reducedMotion;

  const handleMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${(0.5 - py) * max}deg`);
      el.style.setProperty('--ry', `${(px - 0.5) * max}deg`);
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={enabled ? handleMove : undefined}
      onMouseLeave={enabled ? reset : undefined}
      style={{
        transform: 'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
