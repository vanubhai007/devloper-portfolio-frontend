import { FiArrowUp } from 'react-icons/fi';
import { siteConfig } from '../config/siteConfig';
import SocialLinks from './SocialLinks';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <p className={styles.brand}>
              <span className="gradient-text">{siteConfig.shortName}</span> — {siteConfig.role}
            </p>
            <p className={styles.muted}>{siteConfig.tagline}</p>
            <SocialLinks />
          </div>
          <nav aria-label="Footer">
            <p className={styles.colTitle}>Navigate</p>
            <ul className={styles.links}>
              {siteConfig.navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className={styles.colTitle}>Contact</p>
            <ul className={styles.links}>
              <li>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
              <li>
                <span className={styles.muted}>{siteConfig.location}</span>
              </li>
              <li>
                <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer">
                  Resume (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>
            © {year} {siteConfig.name}. Built with React, Three.js & Node.js.
          </span>
          <a href="#home" className={styles.toTop} aria-label="Back to top">
            <FiArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
