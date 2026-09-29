import { FaGithub, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { siteConfig } from '../config/siteConfig';
import styles from './SocialLinks.module.css';

const ITEMS = [
  { key: 'github', label: 'GitHub', Icon: FaGithub },
  { key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedinIn },
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram },
  { key: 'whatsapp', label: 'WhatsApp', Icon: FaWhatsapp },
  { key: 'email', label: 'Email', Icon: FiMail },
];

export default function SocialLinks({ className = '' }) {
  return (
    <ul className={`${styles.list} ${className}`} aria-label="Social links">
      {ITEMS.filter(({ key }) => siteConfig.socialLinks[key]).map(({ key, label, Icon }) => {
        const href = siteConfig.socialLinks[key];
        const external = !href.startsWith('mailto:');
        return (
          <li key={key}>
            <a
              className={styles.link}
              href={href}
              aria-label={label}
              title={label}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <Icon aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
