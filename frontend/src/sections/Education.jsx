import { FiAward, FiBookOpen } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { siteConfig } from '../config/siteConfig';
import styles from './Education.module.css';

export default function Education() {
  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <div className="container">
        <SectionHeading
          id="education-title"
          eyebrow="04 — Education"
          title="Learning &"
          highlight="certifications."
        />
        <ul className={styles.grid}>
          {siteConfig.education.map((edu, i) => {
            const Icon = edu.highlight ? FiAward : FiBookOpen;
            return (
              <Reveal as="li" key={edu.title} delay={i * 0.06}>
                <GlassCard className={`${styles.card} ${edu.highlight ? styles.highlight : ''}`}>
                  <div className={styles.top}>
                    <Icon className={styles.icon} aria-hidden="true" />
                    {edu.year && <span className="tag">{edu.year}</span>}
                  </div>
                  <h3 className={styles.title}>{edu.title}</h3>
                  {edu.org && <p className={styles.org}>{edu.org}</p>}
                  <p className={`${styles.result} gradient-text`}>{edu.result}</p>
                </GlassCard>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
