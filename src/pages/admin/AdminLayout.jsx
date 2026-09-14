import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', nr: '00' },
  { to: '/admin/profile', label: 'Profile', nr: '01' },
  { to: '/admin/projects', label: 'Projects', nr: '02' },
  { to: '/admin/experience', label: 'Experience', nr: '03' },
  { to: '/admin/stack', label: 'Stack', nr: '04' },
  { to: '/admin/metrics', label: 'Metrics', nr: '05' },
  { to: '/admin/now', label: 'Now', nr: '06' },
  { to: '/admin/ticker', label: 'Ticker', nr: '07' },
  { to: '/admin/testimonials', label: 'Testimonials', nr: '08' },
  { to: '/admin/messages', label: 'Messages', nr: '09' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  async function handleLogout() {
    await logout();
    toast.success('Signed out');
    nav('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-mark" />
          <span>Portfolio CMS</span>
        </div>
        <nav className="admin-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              <span>{n.label}</span>
              <span className="nr">{n.nr}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <span className="admin-user-email">{user?.email}</span>
          <button className="btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
