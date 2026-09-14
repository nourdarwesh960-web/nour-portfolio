import { useState } from 'react';
import toast from 'react-hot-toast';
import { portfolioApi } from '../api/client.js';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Name, email and message are required.');
      return;
    }
    setBusy(true);
    try {
      await portfolioApi.messages.send(form);
      toast.success('Message sent — will reply soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to send message');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <label>
        <span className="lbl-k">Your name</span>
        <input type="text" value={form.name} onChange={update('name')} required maxLength={120} />
      </label>
      <label>
        <span className="lbl-k">Email</span>
        <input type="email" value={form.email} onChange={update('email')} required maxLength={200} />
      </label>
      <label>
        <span className="lbl-k">Subject (optional)</span>
        <input type="text" value={form.subject} onChange={update('subject')} maxLength={200} />
      </label>
      <label>
        <span className="lbl-k">Message</span>
        <textarea rows={5} value={form.message} onChange={update('message')} required maxLength={5000} />
      </label>
      <button type="submit" className="submit" disabled={busy}>
        {busy ? 'Sending…' : 'Send message →'}
      </button>
    </form>
  );
}
