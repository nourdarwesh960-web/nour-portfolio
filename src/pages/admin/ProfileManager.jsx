import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { portfolioApi } from '../../api/client.js';
import PhotoUploader from '../../components/admin/PhotoUploader.jsx';

const INITIAL = {
  // Identity
  name: '',
  role: '',
  tagline: '',
  bio: '',
  location: '',
  timezone: '',
  availability: 'Open to work',
  establishedYear: '',
  // Photo
  photoUrl: '',
  photoPath: '',
  // Contact
  email: '',
  github: '',
  linkedin: '',
  readcv: '',
  githubLabel: '',
  linkedinLabel: '',
  readcvLabel: '',
  readcvKey: 'Personal',
  // Current role
  currentRole: '',
  currentCompany: '',
  yearsExperience: 0,
  shipped: 0,
  // Hero
  heroTagBefore: '',
  heroTagAfter: '',
  heroScrollHint: '',
  // Nav
  navWorkLabel: 'Work',
  navExperienceLabel: 'Experience',
  navStackLabel: 'Stack',
  navContactLabel: 'Contact',
  // Sections
  scanTitle: 'The 60-second scan',
  workEyebrow: '',
  workTitleBefore: '',
  workTitleItalic: '',
  workTitleAfter: '',
  workSubtitle: '',
  nowEyebrow: '',
  nowTitleBefore: '',
  nowTitleItalic: '',
  nowTitleAfter: '',
  nowBlurb: '',
  nowTitle: 'This month',
  nowSub: '',
  experienceEyebrow: '',
  experienceTitleBefore: '',
  experienceTitleItalic: '',
  experienceTitleAfter: '',
  experienceSubtitle: '',
  stackEyebrow: '',
  stackTitleBefore: '',
  stackTitleItalic: '',
  stackTitleAfter: '',
  stackSubtitle: '',
  testimonialEyebrow: '',
  contactEyebrow: '',
  contactCtaBefore: '',
  contactCtaItalic: '',
  contactCtaAfter: '',
  footerTagline: '',
  footerVersion: '',
};

export default function ProfileManager() {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await portfolioApi.profile.get();
        if (data) setForm((f) => ({ ...f, ...data }));
      } catch (e) {
        toast.error(e.friendlyMessage || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (k) => (e) => {
    const v = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await portfolioApi.profile.update(form);
      toast.success('Profile saved');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <form onSubmit={save}>
      <div className="admin-header">
        <h1>Profile</h1>
        <span className="crumbs">Everything visible on the site</span>
      </div>

      <div className="card">
        <h3>Profile photo</h3>
        <PhotoUploader
          currentUrl={form.photoUrl}
          onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
        />
      </div>

      <div className="card">
        <h3>Identity</h3>
        <div className="grid-2">
          <Field label="Full name" value={form.name} onChange={set('name')} required />
          <Field label="Role / title" value={form.role} onChange={set('role')} />
          <Field label="Established year" value={form.establishedYear} onChange={set('establishedYear')} />
        </div>
        <Field
          label="Bio (hero paragraph — 1-3 sentences)"
          value={form.bio}
          onChange={set('bio')}
          textarea
          rows={4}
          full
          placeholder="Software engineer building web applications and internal tools. Currently at..."
        />
      </div>

      <div className="card">
        <h3>Location &amp; availability</h3>
        <div className="grid-2">
          <Field label="Location" value={form.location} onChange={set('location')} />
          <Field label="Timezone code (3 letters)" value={form.timezone} onChange={set('timezone')} placeholder="DHK" />
          <Field label="Availability badge" value={form.availability} onChange={set('availability')} />
          <Field label="Email" value={form.email} onChange={set('email')} type="email" />
        </div>
      </div>

      <div className="card">
        <h3>Social links</h3>
        <div className="grid-2">
          <Field label="GitHub URL" value={form.github} onChange={set('github')} />
          <Field label="GitHub display label" value={form.githubLabel} onChange={set('githubLabel')} placeholder="/hasib41 ↗" />
          <Field label="LinkedIn URL" value={form.linkedin} onChange={set('linkedin')} />
          <Field label="LinkedIn display label" value={form.linkedinLabel} onChange={set('linkedinLabel')} />
          <Field label="4th link — key (e.g. Read.cv, Twitter)" value={form.readcvKey} onChange={set('readcvKey')} />
          <Field label="4th link URL" value={form.readcv} onChange={set('readcv')} />
          <Field label="4th link display label" value={form.readcvLabel} onChange={set('readcvLabel')} full />
        </div>
      </div>

      <div className="card">
        <h3>Current role &amp; stats</h3>
        <div className="grid-2">
          <Field label="Current role" value={form.currentRole} onChange={set('currentRole')} />
          <Field label="Current company" value={form.currentCompany} onChange={set('currentCompany')} />
          <Field label="Years experience" value={form.yearsExperience} onChange={set('yearsExperience')} type="number" />
          <Field label="Projects shipped" value={form.shipped} onChange={set('shipped')} type="number" />
        </div>
      </div>

      <div className="card">
        <h3>Hero strip</h3>
        <div className="grid-2">
          <Field label="Left tag" value={form.heroTagBefore} onChange={set('heroTagBefore')} placeholder="Software Engineer" />
          <Field label="Right tag" value={form.heroTagAfter} onChange={set('heroTagAfter')} placeholder="Est. 2022" />
          <Field label="Scroll hint" value={form.heroScrollHint} onChange={set('heroScrollHint')} full />
        </div>
      </div>

      <div className="card">
        <h3>Navigation labels</h3>
        <div className="grid-2">
          <Field label="Work" value={form.navWorkLabel} onChange={set('navWorkLabel')} />
          <Field label="Experience" value={form.navExperienceLabel} onChange={set('navExperienceLabel')} />
          <Field label="Stack" value={form.navStackLabel} onChange={set('navStackLabel')} />
          <Field label="Contact" value={form.navContactLabel} onChange={set('navContactLabel')} />
        </div>
      </div>

      <div className="card">
        <h3>Section — 60-second scan</h3>
        <Field label="Title" value={form.scanTitle} onChange={set('scanTitle')} full />
      </div>

      <div className="card">
        <h3>Section — Work</h3>
        <div className="grid-2">
          <Field label="Eyebrow" value={form.workEyebrow} onChange={set('workEyebrow')} />
          <Field label="Title — italic word" value={form.workTitleItalic} onChange={set('workTitleItalic')} />
          <Field label="Title — text before italic" value={form.workTitleBefore} onChange={set('workTitleBefore')} />
          <Field label="Title — text after italic" value={form.workTitleAfter} onChange={set('workTitleAfter')} />
        </div>
        <Field label="Subtitle" value={form.workSubtitle} onChange={set('workSubtitle')} textarea rows={3} full />
      </div>

      <div className="card">
        <h3>Section — Now</h3>
        <div className="grid-2">
          <Field label="Eyebrow" value={form.nowEyebrow} onChange={set('nowEyebrow')} />
          <Field label="Title — italic word" value={form.nowTitleItalic} onChange={set('nowTitleItalic')} />
          <Field label="Title — before italic" value={form.nowTitleBefore} onChange={set('nowTitleBefore')} />
          <Field label="Title — after italic" value={form.nowTitleAfter} onChange={set('nowTitleAfter')} />
        </div>
        <Field label="Blurb" value={form.nowBlurb} onChange={set('nowBlurb')} textarea rows={2} full />
        <div className="grid-2">
          <Field label="Card title" value={form.nowTitle} onChange={set('nowTitle')} />
          <Field label="Card subtitle" value={form.nowSub} onChange={set('nowSub')} />
        </div>
      </div>

      <div className="card">
        <h3>Section — Experience</h3>
        <div className="grid-2">
          <Field label="Eyebrow" value={form.experienceEyebrow} onChange={set('experienceEyebrow')} />
          <Field label="Title — italic word" value={form.experienceTitleItalic} onChange={set('experienceTitleItalic')} />
          <Field label="Title — before italic" value={form.experienceTitleBefore} onChange={set('experienceTitleBefore')} />
          <Field label="Title — after italic" value={form.experienceTitleAfter} onChange={set('experienceTitleAfter')} />
        </div>
        <Field label="Subtitle" value={form.experienceSubtitle} onChange={set('experienceSubtitle')} textarea rows={3} full />
      </div>

      <div className="card">
        <h3>Section — Stack</h3>
        <div className="grid-2">
          <Field label="Eyebrow" value={form.stackEyebrow} onChange={set('stackEyebrow')} />
          <Field label="Title — italic word" value={form.stackTitleItalic} onChange={set('stackTitleItalic')} />
          <Field label="Title — before italic" value={form.stackTitleBefore} onChange={set('stackTitleBefore')} />
          <Field label="Title — after italic" value={form.stackTitleAfter} onChange={set('stackTitleAfter')} />
        </div>
        <Field label="Subtitle" value={form.stackSubtitle} onChange={set('stackSubtitle')} textarea rows={3} full />
      </div>

      <div className="card">
        <h3>Section — Testimonial &amp; Contact</h3>
        <div className="grid-2">
          <Field label="Testimonial eyebrow" value={form.testimonialEyebrow} onChange={set('testimonialEyebrow')} />
          <Field label="Contact eyebrow" value={form.contactEyebrow} onChange={set('contactEyebrow')} />
          <Field label="CTA — before italic" value={form.contactCtaBefore} onChange={set('contactCtaBefore')} placeholder="Let's" />
          <Field label="CTA — italic" value={form.contactCtaItalic} onChange={set('contactCtaItalic')} placeholder="talk" />
          <Field label="CTA — after italic (arrow etc.)" value={form.contactCtaAfter} onChange={set('contactCtaAfter')} placeholder="→" full />
        </div>
      </div>

      <div className="card">
        <h3>Footer</h3>
        <div className="grid-2">
          <Field label="Tagline" value={form.footerTagline} onChange={set('footerTagline')} />
          <Field label="Version / meta" value={form.footerVersion} onChange={set('footerVersion')} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
        <button className="btn primary" disabled={busy}>
          {busy ? 'Saving…' : 'Save profile'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = 'text', required, placeholder, textarea, rows = 3, full }) {
  return (
    <label className="form-group" style={full ? { gridColumn: '1 / -1' } : undefined}>
      <span>{label}</span>
      {textarea ? (
        <textarea className="textarea" rows={rows} value={value ?? ''} onChange={onChange} placeholder={placeholder} required={required} />
      ) : (
        <input className="input" type={type} value={value ?? ''} onChange={onChange} placeholder={placeholder} required={required} />
      )}
    </label>
  );
}
