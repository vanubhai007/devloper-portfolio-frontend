import { useMemo } from 'react';
import { hasWebGL, isLowPowerDevice } from '../utils/detectDevice';
import { useReducedMotion } from './useReducedMotion';

/**
 * Decides whether a live 3D scene should render.
 * Falls back when WebGL is missing, the device is low-powered,
 * or the user prefers reduced motion.
 */
export function useWebGLSupport() {
  const reducedMotion = useReducedMotion();
  const capable = useMemo(() => hasWebGL() && !isLowPowerDevice(), []);
  return { canRender3D: capable && !reducedMotion, reducedMotion };
}
