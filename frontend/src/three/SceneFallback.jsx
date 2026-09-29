import styles from './SceneFallback.module.css';

/** Pure-CSS stand-in for the 3D scene (no WebGL, low-power or reduced motion). */
export default function SceneFallback() {
  return (
    <div className={styles.fallback} aria-hidden="true">
      <div className={styles.orb}>
        <span className={styles.ring} />
        <span className={styles.ring} />
      </div>
    </div>
  );
}
