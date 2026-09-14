import { createContext, useContext, useEffect, useState } from 'react';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_TOKEN, ADMIN_TOKEN_KEY } from '../constants/admin.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token === ADMIN_TOKEN) {
      setUser({ email: ADMIN_EMAIL });
    }
    setReady(true);
  }, []);

  const value = {
    user,
    ready,
    async login(email, password) {
      if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
        const err = new Error('Invalid credentials');
        err.code = 'auth/invalid-credential';
        throw err;
      }
      localStorage.setItem(ADMIN_TOKEN_KEY, ADMIN_TOKEN);
      setUser({ email: ADMIN_EMAIL });
      return { email: ADMIN_EMAIL };
    },
    async logout() {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      setUser(null);
    },
    getToken() {
      return localStorage.getItem(ADMIN_TOKEN_KEY);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
