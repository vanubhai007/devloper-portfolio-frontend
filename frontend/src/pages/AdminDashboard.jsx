import { useCallback, useEffect, useState } from 'react';
import { FiAlertCircle, FiCalendar, FiInbox, FiLogOut, FiMail, FiMessageSquare, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import MessageDetail from '../components/admin/MessageDetail';
import MessageList from '../components/admin/MessageList';
import StatCard from '../components/admin/StatCard';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/adminService';
import styles from './Admin.module.css';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
];
const PAGE_SIZE = 10;

function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const query = useDebounced(search.trim());
  const [reloadToken, setReloadToken] = useState(0);
  // `result.key` records which request produced the data, so "loading" is derived
  // (the current request key differs from the last completed one).
  const requestKey = `${page}|${filter}|${query}|${reloadToken}`;
  const [result, setResult] = useState({ key: null, items: [], total: 0, pages: 1, error: '' });
  const loading = result.key !== requestKey;
  const data = result;
  const error = loading ? '' : result.error;
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Dashboard | Vanraj Admin';
  }, []);

  const loadStats = useCallback(() => {
    adminService.stats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    let cancelled = false;
    adminService
      .messages({ page, limit: PAGE_SIZE, status: filter, search: query || undefined })
      .then((res) => {
        if (cancelled) return;
        // If the page no longer exists (e.g. after deleting the last item), step back.
        if (res.pagination.pages < page && page > 1) {
          setPage(Math.max(1, res.pagination.pages));
          return;
        }
        setResult({ key: requestKey, items: res.data, total: res.pagination.total, pages: res.pagination.pages, error: '' });
      })
      .catch((err) => {
        if (!cancelled) setResult((r) => ({ ...r, key: requestKey, error: err.message }));
      });
    return () => {
      cancelled = true;
    };
  }, [page, filter, query, requestKey]);

  const loadMessages = () => setReloadToken((t) => t + 1);

  const replaceMessage = (updated) => {
    setResult((r) => ({ ...r, items: r.items.map((m) => (m._id === updated._id ? updated : m)) }));
    setSelected((s) => (s?._id === updated._id ? updated : s));
  };

  const select = async (message) => {
    setSelected(message);
    if (!message.isRead) {
      try {
        replaceMessage(await adminService.setRead(message._id, true));
        loadStats();
      } catch {
        /* non-critical — the message still opens */
      }
    }
  };

  const toggleRead = async () => {
    setBusy(true);
    try {
      replaceMessage(await adminService.setRead(selected._id, !selected.isRead));
      loadStats();
    } catch (err) {
      window.alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete the message from ${selected.name}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await adminService.remove(selected._id);
      setSelected(null);
      loadStats();
      loadMessages();
    } catch (err) {
      window.alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const refresh = () => {
    loadStats();
    loadMessages();
  };

  let listContent;
  if (loading && data.items.length === 0) {
    listContent = (
      <div className={styles.state} role="status">
        <span className="spinner" aria-hidden="true" /> Loading messages…
      </div>
    );
  } else if (error) {
    listContent = (
      <div className={styles.state} role="alert">
        <FiAlertCircle aria-hidden="true" />
        <p style={{ margin: 0 }}>{error}</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={loadMessages}>
          <FiRefreshCw aria-hidden="true" /> Try again
        </button>
      </div>
    );
  } else if (data.items.length === 0) {
    listContent = (
      <div className={styles.state}>
        <FiInbox aria-hidden="true" />
        <p style={{ margin: 0 }}>{query || filter !== 'all' ? 'No messages match your filters.' : 'No messages yet.'}</p>
      </div>
    );
  } else {
    listContent = (
      <>
        <MessageList messages={data.items} selectedId={selected?._id} onSelect={select} />
        <div className={styles.pager}>
          <button type="button" className="btn btn-ghost btn-sm" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>
          <span>
            Page {page} of {data.pages} · {data.total} total
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={page >= data.pages || loading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </>
    );
  }

  return (
    <div className={styles.layout}>
      <header className={styles.topbar}>
        <div className={`container ${styles.topbarInner}`}>
          <Link to="/" className={styles.brand}>
            <span className="gradient-text">Vanraj</span>
            <small>Admin</small>
          </Link>
          <div className={styles.topActions}>
            <span className={styles.adminEmail}>{admin?.email}</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={refresh} aria-label="Refresh">
              <FiRefreshCw aria-hidden="true" />
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
              <FiLogOut aria-hidden="true" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className={`container ${styles.main}`}>
        <h1 className="sr-only">Messages dashboard</h1>
        <section className={styles.stats} aria-label="Statistics">
          <StatCard Icon={FiMessageSquare} label="Total messages" value={stats?.total} />
          <StatCard Icon={FiMail} label="Unread" value={stats?.unread} />
          <StatCard Icon={FiCalendar} label="Last 7 days" value={stats?.lastWeek} />
          <StatCard Icon={FiInbox} label="Today" value={stats?.today} />
        </section>

        <div className={styles.toolbar}>
          <div className={styles.search}>
            <FiSearch aria-hidden="true" />
            <label htmlFor="admin-search" className="sr-only">
              Search messages
            </label>
            <input
              id="admin-search"
              className="input"
              type="search"
              placeholder="Search name, email, subject or message…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className={styles.filters} role="group" aria-label="Filter by status">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`${styles.filter} ${filter === f.value ? styles.filterActive : ''}`}
                aria-pressed={filter === f.value}
                onClick={() => {
                  setFilter(f.value);
                  setPage(1);
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.panes}>
          <GlassCard className={`${styles.list} ${selected ? styles.hideOnMobile : ''}`} interactive={false}>
            {listContent}
          </GlassCard>
          <GlassCard className={`${styles.detail} ${selected ? '' : styles.hideOnMobile}`} interactive={false}>
            {selected ? (
              <MessageDetail
                message={selected}
                busy={busy}
                onToggleRead={toggleRead}
                onDelete={remove}
                onBack={() => setSelected(null)}
              />
            ) : (
              <div className={styles.state}>
                <FiMail aria-hidden="true" />
                <p style={{ margin: 0 }}>Select a message to read it.</p>
              </div>
            )}
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
