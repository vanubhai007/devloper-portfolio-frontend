import styles from './GlassCard.module.css';

export default function GlassCard({ as: Tag = 'div', interactive = true, className = '', children, ...rest }) {
  return (
    <Tag className={`glass ${styles.card} ${interactive ? styles.interactive : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
