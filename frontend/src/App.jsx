import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Admin pages are split out so visitors never download them.
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function AdminFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }} role="status">
      <span className="spinner" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin/*"
          element={
            <AuthProvider>
              <Suspense fallback={<AdminFallback />}>
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="login" element={<AdminLogin />} />
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}
