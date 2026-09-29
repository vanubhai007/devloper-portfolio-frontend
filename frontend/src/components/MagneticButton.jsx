import { useRef } from 'react';
import { useFinePointer } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Button/link that gently follows the cursor. Renders <a> when `href` is set.
 * Falls back to a normal button on touch devices or reduced motion.
 */
export default function MagneticButton({ href, strength = 0.25, className = '', children, ...rest }) {
  const ref = useRef(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const enabled = finePointer && !reducedMotion;

  const onMove = (event) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    ref.current.style.transform = '';
  };

  const handlers = enabled ? { onMouseMove: onMove, onMouseLeave: onLeave } : {};
  const Tag = href ? 'a' : 'button';
  return (
    <Tag ref={ref} href={href} className={`btn ${className}`} {...handlers} {...rest}>
      {children}
    </Tag>
  );
}
