import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', textAlign: 'center' }}>
      <div>
        <p className="mono" style={{ color: 'var(--primary)' }}>
          Error 404
        </p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
          Page <span className="gradient-text">not found.</span>
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>The page you are looking for doesn&apos;t exist or was moved.</p>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
