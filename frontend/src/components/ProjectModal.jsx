import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiCheckCircle, FiExternalLink, FiGithub, FiX } from 'react-icons/fi';
import styles from './ProjectModal.module.css';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Accessible project details dialog: focus trap, Escape to close, scroll lock. */
export default function ProjectModal({ project, cover, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;
    dialog.querySelector(FOCUSABLE)?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab') return;
      const nodes = [...dialog.querySelectorAll(FOCUSABLE)];
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close project details">
          <FiX aria-hidden="true" />
        </button>
        <img className={styles.cover} src={cover} alt={`${project.name} preview`} width="800" height="450" />
        <div className={styles.body}>
          <span className={`${styles.category} mono`}>{project.category}</span>
          <h2 id="project-modal-title" className={styles.title}>
            {project.name}
          </h2>
          <p className={styles.desc}>{project.description}</p>

          <h3 className={styles.subhead}>Key features</h3>
          <ul className={styles.features}>
            {project.features.map((f) => (
              <li key={f}>
                <FiCheckCircle aria-hidden="true" /> {f}
              </li>
            ))}
          </ul>

          <h3 className={styles.subhead}>Tech stack</h3>
          <ul className={styles.tech}>
            {project.tech.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            {project.liveUrl && (
              <a className="btn btn-primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <FiExternalLink aria-hidden="true" /> Live Demo
              </a>
            )}
            {project.repoUrl && (
              <a className="btn btn-ghost" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <FiGithub aria-hidden="true" /> {project.backendRepoUrl ? 'Frontend Code' : 'Source Code'}
              </a>
            )}
            {project.backendRepoUrl && (
              <a className="btn btn-ghost" href={project.backendRepoUrl} target="_blank" rel="noopener noreferrer">
                <FiGithub aria-hidden="true" /> Backend Code
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
