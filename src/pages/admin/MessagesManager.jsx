import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { portfolioApi } from '../../api/client.js';
import ConfirmButton from '../../components/admin/ConfirmButton.jsx';

export default function MessagesManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await portfolioApi.messages.list();
      setItems(list);
    } catch (e) {
      toast.error(e.friendlyMessage || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRead(m) {
    try {
      const updated = await portfolioApi.messages.markRead(m.id, !m.read);
      setItems((list) => list.map((it) => (it.id === m.id ? { ...it, read: updated.read } : it)));
    } catch (e) {
      toast.error(e.friendlyMessage || 'Failed to update');
    }
  }

  async function remove(m) {
    try {
      await portfolioApi.messages.remove(m.id);
      setItems((list) => list.filter((it) => it.id !== m.id));
      toast.success('Deleted');
    } catch (e) {
      toast.error(e.friendlyMessage || 'Delete failed');
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Messages</h1>
        <span className="crumbs">
          {items.length} total · {items.filter((m) => !m.read).length} unread
        </span>
      </div>

      <div className="admin-toolbar">
        <button className="btn" onClick={load} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {!loading && items.length === 0 ? (
        <div className="empty-state">No messages yet.</div>
      ) : null}

      <div className="resource-list">
        {items.map((m) => (
          <div key={m.id} className="resource-item">
            <div className="row-top">
              <div>
                <strong>{m.name}</strong>{' '}
                <span style={{ color: 'var(--fg-2)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  &lt;{m.email}&gt;
                </span>
                {!m.read ? <span className="badge unread" style={{ marginLeft: 8 }}>New</span> : null}
              </div>
              <div className="actions">
                <button className="btn" onClick={() => toggleRead(m)}>
                  Mark {m.read ? 'unread' : 'read'}
                </button>
                <a className="btn" href={`mailto:${m.email}?subject=Re:%20${encodeURIComponent(m.subject || 'your message')}`}>
                  Reply
                </a>
                <ConfirmButton onConfirm={() => remove(m)}>Delete</ConfirmButton>
              </div>
            </div>
            {m.subject ? (
              <div style={{ color: 'var(--fg-1)', fontWeight: 500 }}>{m.subject}</div>
            ) : null}
            <div style={{ color: 'var(--fg-1)', whiteSpace: 'pre-wrap', fontSize: 14 }}>
              {m.message}
            </div>
            <div style={{ color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              {new Date(m.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
