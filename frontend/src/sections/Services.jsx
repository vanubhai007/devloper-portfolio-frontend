import GlassCard from '../components/GlassCard';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { siteConfig } from '../config/siteConfig';
import { FallbackIcon, serviceIcons } from '../utils/icons';
import styles from './Services.module.css';

export default function Services() {
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container">
        <SectionHeading
          id="services-title"
          eyebrow="05 — Services"
          title="What I can"
          highlight="build for you."
          subtitle="From a simple business website to a complete full stack application."
        />
        <ul className={styles.grid}>
          {siteConfig.services.map((service, i) => {
            const Icon = serviceIcons[service.icon] || FallbackIcon;
            return (
              <Reveal as="li" key={service.title} delay={(i % 4) * 0.07}>
                <GlassCard className={styles.card}>
                  <span className={styles.icon} aria-hidden="true">
                    <Icon />
                  </span>
                  <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={styles.title}>{service.title}</h3>
                  <p className={styles.text}>{service.text}</p>
                </GlassCard>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
