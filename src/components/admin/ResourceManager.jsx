import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmButton from './ConfirmButton.jsx';

/**
 * Generic list-based manager: inline editable items ordered by `order`.
 *
 * Props:
 * - title: page title
 * - api: { list, create, update, remove } from portfolioApi
 * - fields: [{ key, label, type, placeholder, rows, tags }]
 *     type: 'text' | 'textarea' | 'number' | 'tags'
 * - newRecord: () => object (defaults used when creating)
 * - renderSummary?: (item) => string (for collapsed title)
 */
export default function ResourceManager({ title, api, fields, newRecord, renderSummary }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.list();
      setItems(list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    } catch (e) {
      toast.error(e.friendlyMessage || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (id, key, value) => {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, [key]: value, _dirty: true } : it)));
  };

  async function save(item) {
    setSaving((s) => ({ ...s, [item.id]: true }));
    try {
      const { id, _dirty, _new, createdAt, updatedAt, ...payload } = item;
      if (_new) {
        const saved = await api.create(payload);
        setItems((list) => list.map((it) => (it.id === id ? { ...saved, _dirty: false } : it)));
      } else {
        const saved = await api.update(id, payload);
        setItems((list) => list.map((it) => (it.id === id ? { ...saved, _dirty: false } : it)));
      }
      toast.success('Saved');
    } catch (e) {
      toast.error(e.friendlyMessage || 'Save failed');
    } finally {
      setSaving((s) => ({ ...s, [item.id]: false }));
    }
  }

  async function remove(item) {
    if (item._new) {
      setItems((list) => list.filter((it) => it.id !== item.id));
      return;
    }
    try {
      await api.remove(item.id);
      setItems((list) => list.filter((it) => it.id !== item.id));
      toast.success('Deleted');
    } catch (e) {
      toast.error(e.friendlyMessage || 'Delete failed');
    }
  }

  function addNew() {
    const nextOrder = items.length ? Math.max(...items.map((i) => i.order ?? 0)) + 1 : 1;
    const draft = { id: `draft-${Date.now()}`, _new: true, _dirty: true, order: nextOrder, ...newRecord() };
    setItems((list) => [...list, draft]);
  }

  const summary = useMemo(
    () =>
      renderSummary ||
      ((it) => it.title || it.name || it.role || it.label || it.text?.slice(0, 40) || 'Untitled'),
    [renderSummary],
  );

  return (
    <>
      <div className="admin-header">
        <h1>{title}</h1>
        <span className="crumbs">{items.length} items</span>
      </div>

      <div className="admin-toolbar">
        <button className="btn primary" onClick={addNew}>
          + Add new
        </button>
        <button className="btn" onClick={load} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {!loading && items.length === 0 ? (
        <div className="empty-state">No items yet. Click “Add new” to create the first.</div>
      ) : null}

      <div className="resource-list">
        {items.map((item) => (
          <div key={item.id} className="resource-item">
            <div className="row-top">
              <strong>{summary(item)}</strong>
              <div className="actions">
                <button
                  className="btn primary"
                  disabled={!item._dirty || saving[item.id]}
                  onClick={() => save(item)}
                >
                  {saving[item.id] ? 'Saving…' : item._new ? 'Create' : 'Save'}
                </button>
                <ConfirmButton onConfirm={() => remove(item)}>Delete</ConfirmButton>
              </div>
            </div>
            <div className="grid-2">
              {fields.map((f) => (
                <FieldControl key={f.key} field={f} value={item[f.key]} onChange={(v) => setField(item.id, f.key, v)} />
              ))}
              <FieldControl
                field={{ key: 'order', label: 'Order', type: 'number' }}
                value={item.order ?? 0}
                onChange={(v) => setField(item.id, 'order', v)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function FieldControl({ field, value, onChange }) {
  const { key, label, type = 'text', placeholder, rows = 3 } = field;
  if (type === 'textarea') {
    return (
      <label className="form-group" style={{ gridColumn: '1 / -1' }}>
        <span>{label}</span>
        <textarea
          className="textarea"
          rows={rows}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }
  if (type === 'number') {
    return (
      <label className="form-group">
        <span>{label}</span>
        <input
          className="input"
          type="number"
          value={value ?? 0}
          placeholder={placeholder}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </label>
    );
  }
  if (type === 'tags') {
    const str = Array.isArray(value) ? value.join(', ') : value || '';
    return (
      <label className="form-group" style={{ gridColumn: '1 / -1' }}>
        <span>{label} (comma separated)</span>
        <input
          className="input"
          type="text"
          value={str}
          placeholder={placeholder}
          onChange={(e) =>
            onChange(
              e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
        />
      </label>
    );
  }
  return (
    <label className="form-group">
      <span>{label}</span>
      <input
        className="input"
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
