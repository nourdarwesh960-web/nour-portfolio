import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email.trim(), password);
      toast.success('Signed in');
      nav(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.code === 'auth/invalid-credential' ? 'Invalid credentials' : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>Admin sign-in</h1>
        <p>Portfolio CMS</p>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn primary block" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-2)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            ← Back to site
          </Link>
        </div>
      </form>
    </div>
  );
}
