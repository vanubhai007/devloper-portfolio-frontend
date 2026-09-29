import GlassCard from '../components/GlassCard';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { siteConfig } from '../config/siteConfig';
import { FallbackIcon, techIcons } from '../utils/icons';
import styles from './Skills.module.css';

function LevelDots({ dots, accent }) {
  return (
    <span className={styles.dots} aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <span key={n} className={`${styles.dot} ${n <= dots ? styles.dotOn : ''}`} style={{ '--skill-accent': accent }} />
      ))}
    </span>
  );
}

export default function Skills() {
  const { skills, skillLevels } = siteConfig;
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading
          id="skills-title"
          eyebrow="02 — Skills"
          title="Tools I use to"
          highlight="ship real products."
          subtitle="Indicators describe how I use each technology — not a made-up percentage."
        />

        <ul className={styles.legend} aria-label="Skill indicator legend">
          {Object.values(skillLevels).map((lvl) => (
            <li key={lvl.label} className={styles.legendItem}>
              <LevelDots dots={lvl.dots} accent="var(--primary)" />
              {lvl.label}
            </li>
          ))}
        </ul>

        <div className={styles.grid}>
          {skills.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 0.08}>
              <GlassCard>
                <h3 className={styles.cardTitle}>
                  {group.category}
                  <span className={styles.count}>{String(group.items.length).padStart(2, '0')} skills</span>
                </h3>
                <ul className={styles.list}>
                  {group.items.map((skill) => {
                    const Icon = techIcons[skill.icon] || FallbackIcon;
                    const level = skillLevels[skill.level];
                    return (
                      <li key={skill.name} className={styles.skill} style={{ '--skill-accent': group.accent }} title={level.label}>
                        <span className={styles.skillTop}>
                          <Icon className={styles.skillIcon} aria-hidden="true" />
                          {skill.name}
                        </span>
                        <LevelDots dots={level.dots} accent={group.accent} />
                        <span className="sr-only">{level.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
