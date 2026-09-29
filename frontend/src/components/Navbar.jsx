import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { siteConfig } from '../config/siteConfig';
import SocialLinks from './SocialLinks';
import styles from './Navbar.module.css';

const SECTION_IDS = ['home', ...siteConfig.navLinks.map((l) => l.id)];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`${styles.header} ${scrolled || open ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#home" className={styles.brand} onClick={close} aria-label={`${siteConfig.shortName} — back to top`}>
          <span className={`${styles.mark} gradient-text`} aria-hidden="true">
            V
          </span>
          <span>
            {siteConfig.shortName}
            <span className={styles.brandRole}> / dev</span>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.links}>
            {siteConfig.navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`${styles.link} ${active === link.id ? styles.active : ''}`}
                  aria-current={active === link.id ? 'true' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#contact" className={`btn btn-primary btn-sm ${styles.cta}`}>
            Hire Me
          </a>
        </nav>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className={styles.mobileMenu}
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            <ul className={styles.mobileLinks}>
              {siteConfig.navLinks.map((link, i) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className={styles.mobileLink} onClick={close}>
                    {link.label}
                    <span>0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className={styles.mobileFooter}>
              <a href="#contact" className="btn btn-primary" onClick={close}>
                Hire Me
              </a>
              <SocialLinks />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
