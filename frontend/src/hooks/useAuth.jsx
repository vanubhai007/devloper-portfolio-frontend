import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { adminService } from '../services/adminService';
import { tokenStore } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState(() => (tokenStore.get() ? 'checking' : 'guest'));

  // Validate an existing token on first load.
  useEffect(() => {
    if (status !== 'checking') return undefined;
    let cancelled = false;
    adminService
      .me()
      .then((data) => {
        if (cancelled) return;
        setAdmin(data);
        setStatus('authenticated');
      })
      .catch(() => {
        if (cancelled) return;
        tokenStore.clear();
        setStatus('guest');
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  const logout = useCallback(() => {
    tokenStore.clear();
    setAdmin(null);
    setStatus('guest');
  }, []);

  useEffect(() => {
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const { token, admin: profile } = await adminService.login(email, password);
    tokenStore.set(token);
    setAdmin(profile);
    setStatus('authenticated');
  }, []);

  const value = useMemo(() => ({ admin, status, login, logout }), [admin, status, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
