import { useEffect, useState } from 'react';
import { FiAlertCircle, FiLock, FiLogIn } from 'react-icons/fi';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../utils/validators';
import styles from './Admin.module.css';

export default function AdminLogin() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Admin Login | Vanraj';
  }, []);

  if (status === 'authenticated') {
    return <Navigate to={location.state?.from || '/admin/dashboard'} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email) || !password) {
      setError('Enter a valid email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || '/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className={styles.loginWrap}>
      <GlassCard as="form" className={styles.loginCard} onSubmit={onSubmit} noValidate interactive={false}>
        <span className={styles.loginIcon} aria-hidden="true">
          <FiLock />
        </span>
        <div>
          <h1 className={styles.loginTitle}>Admin login</h1>
          <p className={styles.loginSub}>Sign in to manage contact messages.</p>
        </div>
        <div className="field">
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            className="input"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <div className="alert alert-error" role="alert">
            <FiAlertCircle aria-hidden="true" style={{ marginTop: 3 }} />
            <span>{error}</span>
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading || status === 'checking'}>
          {loading ? <span className="spinner" aria-hidden="true" /> : <FiLogIn aria-hidden="true" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <Link to="/" className={styles.back}>
          ← Back to portfolio
        </Link>
      </GlassCard>
    </main>
  );
}
