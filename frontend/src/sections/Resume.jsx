import { FiDownload, FiEye } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import MagneticButton from '../components/MagneticButton';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { siteConfig } from '../config/siteConfig';
import styles from './Resume.module.css';

const POINTS = ['Full Stack Developer Intern', 'React · Node · Express · MongoDB', 'Full Stack Certification — A+'];

export default function Resume() {
  return (
    <section id="resume" className="section" aria-labelledby="resume-title">
      <div className="container">
        <SectionHeading id="resume-title" eyebrow="09 — Resume" title="My" highlight="resume." />
        <Reveal>
          <GlassCard className={styles.card} interactive={false}>
            <div>
              <h3 className={styles.title}>Everything in one page.</h3>
              <p className={styles.text}>
                My education, skills, experience and projects — ready to view online or download as a PDF.
              </p>
              <ul className={styles.points}>
                {POINTS.map((p) => (
                  <li key={p} className="tag">
                    {p}
                  </li>
                ))}
              </ul>
              <div className={styles.actions}>
                <MagneticButton href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <FiEye aria-hidden="true" /> View Resume
                </MagneticButton>
                <MagneticButton href={siteConfig.resumeUrl} download={siteConfig.resumeFileName} className="btn-primary">
                  <FiDownload aria-hidden="true" /> Download Resume
                </MagneticButton>
              </div>
            </div>
            <div className={styles.visual} aria-hidden="true">
              <div className={styles.doc}>
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} />
                ))}
                <b className={styles.pdf}>PDF</b>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
