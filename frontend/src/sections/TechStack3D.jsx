import { lazy, Suspense } from 'react';
import { FiDatabase, FiMonitor, FiServer } from 'react-icons/fi';
import ErrorBoundary from '../components/ErrorBoundary';
import GlassCard from '../components/GlassCard';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { siteConfig } from '../config/siteConfig';
import { useInView } from '../hooks/useInView';
import { useFinePointer } from '../hooks/useMediaQuery';
import { useWebGLSupport } from '../hooks/useWebGLSupport';
import styles from './TechStack3D.module.css';

const TechnologyScene = lazy(() => import('../three/TechnologyScene'));

const TECH_NAMES = [...new Set(siteConfig.skills.flatMap((g) => g.items.map((s) => s.name)))];

const LAYERS = [
  { Icon: FiMonitor, title: 'Frontend', text: 'React components, Vite tooling and responsive CSS that works on every screen.' },
  { Icon: FiServer, title: 'Backend', text: 'Node.js + Express REST APIs with validation, authentication and error handling.' },
  { Icon: FiDatabase, title: 'Data & Deploy', text: 'MongoDB / MySQL data models, Atlas in the cloud, Vercel + Render deployments.' },
];

function StaticCloud() {
  return (
    <ul className={styles.fallbackCloud} aria-label="Technologies">
      {TECH_NAMES.map((name) => (
        <li key={name} className="tech-label">
          {name}
        </li>
      ))}
    </ul>
  );
}

export default function TechStack3D() {
  const { canRender3D } = useWebGLSupport();
  const finePointer = useFinePointer();
  // Mount the canvas only once the section is near the viewport; pause it when off-screen.
  const [nearRef, near] = useInView({ rootMargin: '300px', once: true });
  const [visibleRef, visible] = useInView();

  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <div className="container">
        <SectionHeading
          id="stack-title"
          eyebrow="07 — Technology"
          title="My full stack,"
          highlight="in orbit."
          subtitle="The technologies I combine to take a project from idea to deployment."
        />
        <div className={styles.grid}>
          <div ref={nearRef}>
            <div ref={visibleRef} className={styles.stage}>
              {canRender3D && near ? (
                <ErrorBoundary fallback={<StaticCloud />}>
                  <Suspense fallback={<StaticCloud />}>
                    <TechnologyScene items={TECH_NAMES} active={visible} interactive={finePointer} />
                  </Suspense>
                </ErrorBoundary>
              ) : (
                <StaticCloud />
              )}
            </div>
            {canRender3D && finePointer && <p className={styles.hint}>Drag to rotate</p>}
          </div>
          <ul className={styles.list}>
            {LAYERS.map(({ Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 0.1}>
                <GlassCard className={styles.row}>
                  <span className={styles.rowIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
