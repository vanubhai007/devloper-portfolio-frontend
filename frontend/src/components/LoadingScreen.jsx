import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

/** Short branded intro. Never blocks longer than ~1.2s so content stays fast. */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const done = () => setTimeout(() => setVisible(false), 350);
    const cap = setTimeout(() => setVisible(false), 1200);
    if (document.readyState === 'complete') done();
    else window.addEventListener('load', done, { once: true });
    return () => {
      clearTimeout(cap);
      window.removeEventListener('load', done);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.screen}
          role="status"
          aria-label="Loading portfolio"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className={styles.inner}>
            <div className={`${styles.logo} gradient-text`}>V</div>
            <div className={styles.bar}>
              <motion.div
                className={styles.fill}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className={`${styles.label} mono`}>Initializing</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
