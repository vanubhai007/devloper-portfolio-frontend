import Reveal from './Reveal';
import styles from './SectionHeading.module.css';

export default function SectionHeading({ eyebrow, title, highlight, subtitle, center = false, id }) {
  return (
    <Reveal className={`${styles.heading} ${center ? styles.center : ''}`}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2 className={styles.title} id={id}>
        {title} {highlight && <span className="gradient-text">{highlight}</span>}
      </h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </Reveal>
  );
}
