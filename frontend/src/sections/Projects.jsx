import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { FiArrowUpRight, FiExternalLink, FiGithub } from 'react-icons/fi';
import constructionCover from '../assets/projects/construction.svg';
import hotelCover from '../assets/projects/hotel.svg';
import securityCover from '../assets/projects/security.svg';
import ProjectModal from '../components/ProjectModal';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import TiltCard from '../components/TiltCard';
import { useProjects } from '../hooks/useProjects';
import styles from './Projects.module.css';

const COVERS = { hotel: hotelCover, construction: constructionCover, security: securityCover };
const coverFor = (project) => project.image || COVERS[project.cover] || hotelCover;

function ProjectCard({ project, onOpen }) {
  return (
    <TiltCard className={styles.tilt} max={5}>
      <article className={styles.card} aria-labelledby={`project-${project.slug}`}>
        <div className={styles.media}>
          <img
            src={coverFor(project)}
            alt={`${project.name} website preview`}
            loading="lazy"
            decoding="async"
            width="800"
            height="500"
          />
          {project.featured && <span className={`${styles.badge} mono`}>Featured</span>}
        </div>
        <div className={styles.content}>
          <span className={`${styles.category} mono`}>{project.category}</span>
          <h3 id={`project-${project.slug}`} className={styles.name}>
            {project.name}
          </h3>
          <p className={styles.summary}>{project.summary}</p>
          <ul className={styles.tech} aria-label="Technologies">
            {project.tech.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            {project.liveUrl ? (
              <a className="btn btn-primary btn-sm" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <FiExternalLink aria-hidden="true" /> Live Demo
              </a>
            ) : (
              <span className={`btn btn-sm ${styles.disabledLink}`} aria-disabled="true">
                Demo coming soon
              </span>
            )}
            {project.repoUrl && (
              <a className="btn btn-ghost btn-sm" href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                <FiGithub aria-hidden="true" /> GitHub
              </a>
            )}
            <button type="button" className={styles.details} onClick={() => onOpen(project)}>
              Details <FiArrowUpRight aria-hidden="true" />
              <span className="sr-only"> about {project.name}</span>
            </button>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export default function Projects() {
  const projects = useProjects();
  const [selected, setSelected] = useState(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          id="projects-title"
          eyebrow="06 — Projects"
          title="Selected"
          highlight="work."
          subtitle="Real projects I have designed and developed — from a full stack booking platform to business websites."
        />
        <div className={styles.grid}>
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.08} className={project.featured ? styles.featured : undefined}>
              <ProjectCard project={project} onOpen={setSelected} />
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} cover={coverFor(selected)} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
