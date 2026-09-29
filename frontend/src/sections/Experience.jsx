import { FiBriefcase, FiCode } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { siteConfig } from '../config/siteConfig';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container">
        <SectionHeading
          id="experience-title"
          eyebrow="03 — Experience"
          title="Where I've been"
          highlight="building."
        />
        <ol className={styles.timeline}>
          {siteConfig.experience.map((exp, i) => {
            const isDev = i === 0;
            const Icon = isDev ? FiCode : FiBriefcase;
            const meta = [exp.organization, exp.type].filter(Boolean).join(' · ');
            return (
              <Reveal as="li" key={exp.title} delay={i * 0.1} className={`${styles.item} ${isDev ? '' : styles.secondary}`}>
                <span className={styles.node} aria-hidden="true" />
                <GlassCard>
                  <div className={styles.head}>
                    <div className={styles.titleRow}>
                      <span className={styles.icon} aria-hidden="true">
                        <Icon />
                      </span>
                      <div>
                        <h3 className={styles.title}>{exp.title}</h3>
                        {meta && <span className={styles.org}>{meta}</span>}
                      </div>
                    </div>
                    {exp.period && <span className={`tag ${styles.period}`}>{exp.period}</span>}
                  </div>
                  <ul className={styles.points}>
                    {exp.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
