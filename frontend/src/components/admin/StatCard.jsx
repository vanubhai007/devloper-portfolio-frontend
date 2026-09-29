import GlassCard from '../GlassCard';
import styles from '../../pages/Admin.module.css';

export default function StatCard({ Icon, label, value }) {
  return (
    <GlassCard className={styles.stat} interactive={false}>
      <span className={styles.statIcon} aria-hidden="true">
        <Icon />
      </span>
      <div>
        <span className={styles.statValue}>{value ?? '—'}</span>
        <span className={styles.statLabel}>{label}</span>
      </div>
    </GlassCard>
  );
}
