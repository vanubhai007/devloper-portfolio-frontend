import { FiArrowLeft, FiCheck, FiMail, FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import { formatDateTime } from '../../utils/formatDate';
import styles from '../../pages/Admin.module.css';

export default function MessageDetail({ message, busy, onToggleRead, onDelete, onBack }) {
  const replyHref = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`;
  return (
    <article aria-labelledby="message-subject">
      <button type="button" className={`btn btn-ghost btn-sm ${styles.backBtn}`} onClick={onBack}>
        <FiArrowLeft aria-hidden="true" /> All messages
      </button>
      <div className={styles.detailHead}>
        <div>
          <h2 id="message-subject" className={styles.detailSubject}>
            {message.subject}
          </h2>
          <span className="tag">{message.isRead ? 'Read' : 'Unread'}</span>
        </div>
      </div>
      <dl className={styles.detailMeta}>
        <div>
          <dt className="sr-only">From</dt>
          <dd style={{ margin: 0 }}>
            <strong style={{ color: 'var(--text)' }}>{message.name}</strong> ·{' '}
            <a href={`mailto:${message.email}`}>{message.email}</a>
          </dd>
        </div>
        {message.phone && (
          <div>
            <dt className="sr-only">Phone</dt>
            <dd style={{ margin: 0 }}>
              <a href={`tel:${message.phone}`}>{message.phone}</a>
            </dd>
          </div>
        )}
        <div>
          <dt className="sr-only">Received</dt>
          <dd style={{ margin: 0 }}>{formatDateTime(message.createdAt)}</dd>
        </div>
      </dl>
      <p className={styles.detailBody}>{message.message}</p>
      <div className={styles.detailActions}>
        <a className="btn btn-primary btn-sm" href={replyHref}>
          <FiMail aria-hidden="true" /> Reply
        </a>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onToggleRead} disabled={busy}>
          {message.isRead ? <FiRotateCcw aria-hidden="true" /> : <FiCheck aria-hidden="true" />}
          {message.isRead ? 'Mark as unread' : 'Mark as read'}
        </button>
        <button type="button" className={`btn btn-ghost btn-sm ${styles.danger}`} onClick={onDelete} disabled={busy}>
          <FiTrash2 aria-hidden="true" /> Delete
        </button>
      </div>
    </article>
  );
}
