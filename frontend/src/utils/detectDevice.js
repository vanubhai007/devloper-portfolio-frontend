let cachedWebGL;

/** True when the browser can create a WebGL context. Result is cached. */
export function hasWebGL() {
  if (cachedWebGL !== undefined) return cachedWebGL;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    cachedWebGL = Boolean(gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cachedWebGL = false;
  }
  return cachedWebGL;
}

/** Rough heuristic for devices that will struggle with a live 3D scene. */
export function isLowPowerDevice() {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const saveData = navigator.connection?.saveData === true;
  return saveData || cores <= 2 || memory <= 2;
}
