import { motion, useReducedMotion as useFmReducedMotion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { FaNodeJs, FaReact } from 'react-icons/fa';
import { FiArrowRight, FiDownload, FiMail, FiMapPin } from 'react-icons/fi';
import { SiExpress, SiMongodb } from 'react-icons/si';
import ErrorBoundary from '../components/ErrorBoundary';
import MagneticButton from '../components/MagneticButton';
import SocialLinks from '../components/SocialLinks';
import TypingText from '../components/TypingText';
import { siteConfig } from '../config/siteConfig';
import { useInView } from '../hooks/useInView';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useWebGLSupport } from '../hooks/useWebGLSupport';
import SceneFallback from '../three/SceneFallback';
import styles from './Hero.module.css';

// Three.js is only downloaded when the device can actually render it.
const HeroScene = lazy(() => import('../three/HeroScene'));

const CHIPS = [
  { label: 'React', Icon: FaReact, color: '#61dafb', style: { top: '22%', right: '8%', animationDelay: '0s' } },
  { label: 'Node.js', Icon: FaNodeJs, color: '#8cc84b', style: { top: '64%', right: '30%', animationDelay: '1.2s' } },
  { label: 'MongoDB', Icon: SiMongodb, color: '#47a248', style: { top: '76%', right: '6%', animationDelay: '2.1s' } },
  { label: 'Express', Icon: SiExpress, color: '#e8ecf8', style: { top: '30%', right: '34%', animationDelay: '0.6s' } },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const { canRender3D } = useWebGLSupport();
  const isMobile = useIsMobile();
  const [ref, inView] = useInView();
  const reduce = useFmReducedMotion();

  return (
    <section id="home" ref={ref} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.scene}>
        {canRender3D ? (
          <ErrorBoundary fallback={<SceneFallback />}>
            <Suspense fallback={<SceneFallback />}>
              <HeroScene active={inView} mobile={isMobile} />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <SceneFallback />
        )}
      </div>

      <div className={styles.chips} aria-hidden="true">
        {CHIPS.map(({ label, Icon, color, style }) => (
          <span key={label} className={styles.chip} style={style}>
            <Icon style={{ color }} />
            {label}
          </span>
        ))}
      </div>

      <div className="container">
        <motion.div
          className={styles.content}
          variants={container}
          initial={reduce ? false : 'hidden'}
          animate="show"
        >
          <motion.p variants={item} className={styles.badge}>
            <span className={styles.pulse} aria-hidden="true" />
            {siteConfig.availability}
          </motion.p>

          <motion.p variants={item} className={styles.greeting}>
            {'<hello world />'}
          </motion.p>

          <motion.h1 variants={item} id="hero-title" className={styles.title}>
            Hi, I&apos;m <span className="gradient-text">{siteConfig.shortName}</span>
            <span className="sr-only"> — {siteConfig.role}</span>
          </motion.h1>

          <motion.div variants={item}>
            <TypingText words={siteConfig.typingWords} className={styles.role} />
          </motion.div>

          <motion.p variants={item} className={styles.subtitle}>
            {siteConfig.tagline}
          </motion.p>

          <motion.div variants={item} className={styles.actions}>
            <MagneticButton href="#projects" className="btn-primary">
              View My Work <FiArrowRight aria-hidden="true" />
            </MagneticButton>
            <MagneticButton href={siteConfig.resumeUrl} download={siteConfig.resumeFileName} className="btn-ghost">
              <FiDownload aria-hidden="true" /> Download Resume
            </MagneticButton>
            <MagneticButton href="#contact" className="btn-ghost">
              <FiMail aria-hidden="true" /> Contact Me
            </MagneticButton>
          </motion.div>

          <motion.div variants={item} className={styles.meta}>
            <SocialLinks />
            <span className={styles.location}>
              <FiMapPin aria-hidden="true" /> {siteConfig.location}
            </span>
          </motion.div>
        </motion.div>
      </div>

      <a href="#about" className={styles.scroll} aria-label="Scroll to About section">
        <span className={styles.mouse} aria-hidden="true">
          <span />
        </span>
        Scroll
      </a>
    </section>
  );
}
