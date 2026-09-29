import { timeAgo } from '../../utils/formatDate';
import styles from '../../pages/Admin.module.css';

export default function MessageList({ messages, selectedId, onSelect }) {
  return (
    <ul aria-label="Messages">
      {messages.map((m) => (
        <li key={m._id}>
          <button
            type="button"
            className={`${styles.item} ${selectedId === m._id ? styles.itemActive : ''}`}
            onClick={() => onSelect(m)}
            aria-current={selectedId === m._id ? 'true' : undefined}
          >
            <span className={styles.itemTop}>
              <span className={styles.itemName}>
                {!m.isRead && <span className={styles.unreadDot} aria-label="Unread" />}
                <span>{m.name}</span>
              </span>
              <time className={styles.itemTime} dateTime={m.createdAt}>
                {timeAgo(m.createdAt)}
              </time>
            </span>
            <span className={styles.itemSubject}>{m.subject}</span>
            <span className={styles.itemPreview}>{m.message}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
