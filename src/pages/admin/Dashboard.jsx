import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { portfolioApi } from '../../api/client.js';

export default function Dashboard() {
  const [counts, setCounts] = useState({
    projects: 0,
    experience: 0,
    stack: 0,
    testimonials: 0,
    messages: 0,
    unread: 0,
  });

  useEffect(() => {
    async function load() {
      const [projects, experience, stack, testimonials, messages] = await Promise.all([
        portfolioApi.projects.list().catch(() => []),
        portfolioApi.experience.list().catch(() => []),
        portfolioApi.stack.list().catch(() => []),
        portfolioApi.testimonials.list().catch(() => []),
        portfolioApi.messages.list().catch(() => []),
      ]);
      setCounts({
        projects: projects.length,
        experience: experience.length,
        stack: stack.length,
        testimonials: testimonials.length,
        messages: messages.length,
        unread: messages.filter((m) => !m.read).length,
      });
    }
    load();
  }, []);

  const stats = [
    { k: 'Projects', v: counts.projects, to: '/admin/projects' },
    { k: 'Experience', v: counts.experience, to: '/admin/experience' },
    { k: 'Stack items', v: counts.stack, to: '/admin/stack' },
    { k: 'Testimonials', v: counts.testimonials, to: '/admin/testimonials' },
    { k: 'Messages', v: counts.messages, to: '/admin/messages' },
    { k: 'Unread', v: counts.unread, to: '/admin/messages' },
  ];

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <span className="crumbs">Overview</span>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <Link key={s.k} to={s.to} className="stat-card">
            <div className="k">{s.k}</div>
            <div className="v">{s.v}</div>
          </Link>
        ))}
      </div>

      <div className="card">
        <h3>Quick actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link className="btn" to="/admin/profile">
            Edit profile
          </Link>
          <Link className="btn" to="/admin/projects">
            Add project
          </Link>
          <Link className="btn" to="/admin/messages">
            View messages
          </Link>
          <a className="btn" href="/" target="_blank" rel="noreferrer">
            Open site ↗
          </a>
        </div>
      </div>
    </>
  );
}
