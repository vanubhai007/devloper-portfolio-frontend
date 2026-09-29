import { FiBriefcase, FiGlobe, FiMapPin, FiUser } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import TiltCard from '../components/TiltCard';
import { siteConfig } from '../config/siteConfig';
import styles from './About.module.css';

const STACK = ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'Git', 'REST APIs'];

export default function About() {
  const { about } = siteConfig;
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading
          id="about-title"
          eyebrow="01 — About me"
          title="Turning ideas into"
          highlight="working products."
        />
        <div className={styles.grid}>
          <Reveal className={styles.visual}>
            <TiltCard max={6}>
              <GlassCard className={styles.card} interactive={false}>
                <div className={styles.cardHead} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <pre className={styles.code} aria-label="Developer profile summary">
                  <span className={styles.k}>const</span> developer = {'{'}
                  {'\n  '}name: <span className={styles.s}>&apos;{siteConfig.shortName}&apos;</span>,
                  {'\n  '}role: <span className={styles.s}>&apos;{siteConfig.role}&apos;</span>,
                  {'\n  '}base: <span className={styles.s}>&apos;Surat, India&apos;</span>,
                  {'\n  '}stack: [<span className={styles.s}>&apos;React&apos;</span>, <span className={styles.s}>&apos;Node&apos;</span>, <span className={styles.s}>&apos;Express&apos;</span>, <span className={styles.s}>&apos;MongoDB&apos;</span>],
                  {'\n  '}
                  <span className={styles.p}>learning</span>: <span className={styles.k}>true</span>,
                  {'\n'}
                  {'}'};
                </pre>
              </GlassCard>
            </TiltCard>
            <div className={styles.stats}>
              {about.highlights.map((h) => (
                <GlassCard key={h.label} className={styles.stat}>
                  <span className={`${styles.statValue} gradient-text`}>{h.value}</span>
                  <span className={styles.statLabel}>{h.label}</span>
                </GlassCard>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className={styles.lead}>{about.intro}</p>
            {about.body.map((para) => (
              <p key={para.slice(0, 24)} className={styles.body}>
                {para}
              </p>
            ))}
            <ul className={styles.facts}>
              <li className={styles.fact}>
                <FiUser aria-hidden="true" />
                <div>
                  <strong>Full name</strong>
                  <span>{siteConfig.name}</span>
                </div>
              </li>
              <li className={styles.fact}>
                <FiMapPin aria-hidden="true" />
                <div>
                  <strong>Location</strong>
                  <span>{siteConfig.location}</span>
                </div>
              </li>
              <li className={styles.fact}>
                <FiGlobe aria-hidden="true" />
                <div>
                  <strong>Languages</strong>
                  <span>{siteConfig.languages.join(', ')}</span>
                </div>
              </li>
              <li className={styles.fact}>
                <FiBriefcase aria-hidden="true" />
                <div>
                  <strong>Currently</strong>
                  <span>Full Stack Developer Intern</span>
                </div>
              </li>
            </ul>
            <ul className={styles.tags} aria-label="Technologies I work with">
              {STACK.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
