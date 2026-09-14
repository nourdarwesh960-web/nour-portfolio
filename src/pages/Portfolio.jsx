import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolioData } from '../hooks/usePortfolioData.js';
import { useReveal } from '../hooks/useReveal.js';
import PortraitSVG from '../components/PortraitSVG.jsx';
import ContactForm from '../components/ContactForm.jsx';
import {
  fallbackProfile,
  fallbackProjects,
  fallbackExperience,
  fallbackStack,
  fallbackTestimonials,
  fallbackMetrics,
  fallbackNow,
  fallbackTicker,
} from '../utils/fallback.js';

function CountUp({ target, suffix }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState('0');
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (ents) => {
        ents.forEach((en) => {
          if (!en.isIntersecting) return;
          ob.unobserve(en.target);
          const tgt = Number(target) || 0;
          const dur = 1400;
          const start = performance.now();
          function step(t) {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const n = eased * tgt;
            setDisplay(tgt >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${Math.floor(n)}`);
            if (p < 1) requestAnimationFrame(step);
            else setDisplay(tgt >= 1000 ? `${(tgt / 1000).toFixed(1)}k` : `${tgt}`);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [target]);
  return (
    <span className="num" ref={ref}>
      <span className="n">{display}</span>
      {suffix ? <sup>{suffix}</sup> : null}
    </span>
  );
}

function SplitWord({ word, italic = false, offset = 0 }) {
  return (
    <span className={italic ? 'italic' : ''}>
      {word.split('').map((c, i) => (
        <span
          className="letter"
          key={`${c}-${i}`}
          style={{ animationDelay: `${offset + i * 0.05 + 0.1}s` }}
        >
          {c === ' ' ? '\u00a0' : c}
        </span>
      ))}
    </span>
  );
}

export default function Portfolio() {
  const { data, loading } = usePortfolioData();

  const profile = data.profile || fallbackProfile;
  const projects = data.projects.length ? data.projects : fallbackProjects;
  const experience = data.experience.length ? data.experience : fallbackExperience;
  const stack = data.stack.length ? data.stack : fallbackStack;
  const testimonials = data.testimonials.length ? data.testimonials : fallbackTestimonials;
  const metrics = data.metrics.length ? data.metrics : fallbackMetrics;
  const nowItems = data.now.length ? data.now : fallbackNow;
  const ticker = data.ticker.length ? data.ticker : fallbackTicker;
  const testimonial = testimonials[0];

  const hasProjects = projects.length > 0;
  const hasExperience = experience.length > 0;
  const hasStack = stack.length > 0;
  const hasMetrics = metrics.length > 0;
  const hasNow = nowItems.length > 0;
  const hasTicker = ticker.length > 0;

  const [clock, setClock] = useState('—');
  const [heroTime, setHeroTime] = useState('—');
  const [scanSec, setScanSec] = useState(4);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setClock(`${h}:${m}:${s}`);
      setHeroTime(`${h}:${m}`);
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setScanSec((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const [hoverLink, setHoverLink] = useState(false);
  const cursorRef = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(max-width: 960px)').matches) return;
    const onMove = (e) => {
      cursorRef.current.mx = e.clientX;
      cursorRef.current.my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    document.addEventListener('mousemove', onMove);
    let raf = 0;
    const loop = () => {
      const c = cursorRef.current;
      c.rx += (c.mx - c.rx) * 0.18;
      c.ry += (c.my - c.ry) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${c.rx}px, ${c.ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const linkHandlers = useMemo(
    () => ({
      onMouseEnter: () => setHoverLink(true),
      onMouseLeave: () => setHoverLink(false),
    }),
    [],
  );

  useReveal('.reveal', [loading]);

  const canHover = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches,
    [],
  );
  const [previewActive, setPreviewActive] = useState(false);
  const previewRef = useRef(null);

  const handlePreviewMove = (e) => {
    const el = previewRef.current;
    if (!el) return;
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
  };

  useEffect(() => {
    if (!canHover) return;
    const onScroll = () => setPreviewActive(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [canHover]);

  const magnetHandlers = (strength = 4) => ({
    onMouseMove: (e) => {
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
      el.style.transition = 'transform .15s linear';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = '';
      e.currentTarget.style.transition = 'transform .5s cubic-bezier(0.22, 1, 0.36, 1)';
    },
  });

  const [firstName, ...restName] = (profile.name || 'Name').split(' ');
  const lastName = restName.join(' ') || '';

  const socialLinks = [
    profile.email && {
      k: 'Email',
      href: `mailto:${profile.email}`,
      label: profile.email,
    },
    profile.github && {
      k: 'GitHub',
      href: profile.github,
      label: profile.githubLabel || profile.github,
    },
    profile.linkedin && {
      k: 'LinkedIn',
      href: profile.linkedin,
      label: profile.linkedinLabel || profile.linkedin,
    },
    profile.readcv && {
      k: profile.readcvKey || 'Personal',
      href: profile.readcv,
      label: profile.readcvLabel || profile.readcv,
    },
  ].filter(Boolean);

  const currentYear = new Date().getFullYear();

  return (
    <div
      className={`pf${hoverLink ? ' hover-link' : ''}`}
      data-accent="mono"
      data-portrait="duotone"
      data-cursor="on"
    >
      <div className="backdrop" />
      <div className="noise" />
      <div className="cur" ref={dotRef}>
        <div className="cur-dot" />
      </div>
      <div className="cur-ring" ref={ringRef} />

      <nav className="pf-top">
        <a href="#" className="brand" {...linkHandlers} {...magnetHandlers()}>
          <div className="brand-mark" />
          <span>{profile.name}</span>
        </a>
        <div className="nav-links">
          {hasProjects && profile.navWorkLabel ? (
            <a href="#work" {...linkHandlers} {...magnetHandlers()}>
              <span className="nr">01</span>
              {profile.navWorkLabel}
            </a>
          ) : null}
          {hasExperience && profile.navExperienceLabel ? (
            <a href="#experience" {...linkHandlers} {...magnetHandlers()}>
              <span className="nr">02</span>
              {profile.navExperienceLabel}
            </a>
          ) : null}
          {hasStack && profile.navStackLabel ? (
            <a href="#stack" {...linkHandlers} {...magnetHandlers()}>
              <span className="nr">03</span>
              {profile.navStackLabel}
            </a>
          ) : null}
          {profile.navContactLabel ? (
            <a href="#contact" {...linkHandlers} {...magnetHandlers()}>
              <span className="nr">04</span>
              {profile.navContactLabel}
            </a>
          ) : null}
        </div>
        <div className="nav-time">
          <span className="status">{profile.availability || 'Available'}</span>
          <span>{clock}</span>
          <span>{profile.timezone || ''}</span>
        </div>
      </nav>

      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-left">
              <div className="tag-label">
                {[profile.heroTagBefore, profile.heroTagAfter].filter(Boolean).join(' · ')}
              </div>
              <h1 className="hero-name">
                <SplitWord word={firstName || ''} />
                {lastName ? (
                  <>
                    {' '}
                    <SplitWord word={lastName} italic offset={0.6} />
                  </>
                ) : null}
              </h1>
            </div>

            <div className="portrait-wrap" {...magnetHandlers(6)}>
              <div className="portrait">
                {profile.photoUrl ? (
                  <img
                    className="portrait-img"
                    src={profile.photoUrl}
                    alt={profile.name}
                    loading="lazy"
                  />
                ) : (
                  <PortraitSVG />
                )}
              </div>
              <div className="portrait-tag">
                <span>
                  <span className="mark" />
                  &nbsp;&nbsp;{profile.timezone || ''}
                </span>
                <span>{heroTime}</span>
              </div>
            </div>

            <div className="hero-right">
              <p className="hero-bio">{profile.bio}</p>
              {profile.heroScrollHint ? (
                <div className="hero-bottom-meta">{profile.heroScrollHint}</div>
              ) : null}
            </div>
          </div>

          <div className="hero-role-bar">
            <div className="role-item">
              <div className="k">Currently</div>
              <div className="v">
                {profile.currentRole}
                {profile.currentCompany ? (
                  <span className="tail"> @ {profile.currentCompany}</span>
                ) : null}
              </div>
            </div>
            <div className="role-item">
              <div className="k">Experience</div>
              <div className="v big">
                {String(profile.yearsExperience || 0).padStart(2, '0')}
                <span className="tail">yrs</span>
              </div>
            </div>
            <div className="role-item">
              <div className="k">Shipped</div>
              <div className="v big">
                {profile.shipped || 0}
                <span className="tail">+</span>
              </div>
            </div>
            <div className="role-item">
              <div className="k">Based</div>
              <div className="v">{profile.location}</div>
            </div>
          </div>
        </div>
      </section>

      {hasTicker ? (
        <div className="ticker">
          <div className="ticker-track">
            {[0, 1].map((dup) => (
              <span
                key={dup}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                {ticker.map((t, idx) => (
                  <span key={`${dup}-${t.id || idx}`} style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                    <span className={`ticker-item ${t.style === 'default' ? '' : t.style}`}>
                      {t.text}
                      {t.sup ? <span className="sup">{t.sup}</span> : null}
                    </span>
                    {idx < ticker.length - 1 ? <span className="ticker-star" /> : null}
                  </span>
                ))}
                <span className="ticker-star" />
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {hasMetrics ? (
        <section className="scan">
          <div className="wrap">
            <div className="scan-head">
              <h3>{profile.scanTitle || 'The 60-second scan'}</h3>
              <span className="timer">
                {String(Math.floor(scanSec / 60)).padStart(2, '0')}:
                {String(scanSec % 60).padStart(2, '0')} → read on
              </span>
            </div>
            <div className="scan-grid">
              {metrics.map((m) => (
                <div key={m.id} className="scan-cell reveal">
                  <CountUp target={m.value} suffix={m.displaySuffix} />
                  <div className="lbl">{m.label}</div>
                  <div className="desc">{m.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasProjects ? (
        <section className="work" id="work">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                {profile.workEyebrow ? (
                  <span className="eyebrow">{profile.workEyebrow}</span>
                ) : null}
                <h2 className="section-title">
                  {profile.workTitleBefore}{' '}
                  {profile.workTitleItalic ? (
                    <span className="it">{profile.workTitleItalic}</span>
                  ) : null}{' '}
                  {profile.workTitleAfter}
                </h2>
              </div>
              {profile.workSubtitle ? (
                <div
                  style={{
                    color: 'var(--fg-1)',
                    fontSize: 15,
                    maxWidth: '40ch',
                    justifySelf: 'end',
                    alignSelf: 'end',
                  }}
                >
                  {profile.workSubtitle}
                </div>
              ) : null}
            </div>

            <div
              className="work-list"
              onMouseEnter={canHover ? () => setPreviewActive(true) : undefined}
              onMouseMove={canHover ? handlePreviewMove : undefined}
              onMouseLeave={canHover ? () => setPreviewActive(false) : undefined}
            >
              {projects.map((p, i) => (
                <a
                  key={p.id}
                  className="work-row reveal"
                  href={p.href || '#'}
                  target={p.href && p.href !== '#' ? '_blank' : undefined}
                  rel="noreferrer"
                  {...linkHandlers}
                >
                  <div className="work-num">/ {String(i + 1).padStart(2, '0')}</div>
                  <div className="work-title">
                    {p.title}{' '}
                    {p.italicPart ? <span className="it">{p.italicPart}</span> : null}
                  </div>
                  <div className="work-desc">{p.description}</div>
                  <div className="work-tech">{p.tech}</div>
                  <div className="work-year">{p.year}</div>
                </a>
              ))}
            </div>
          </div>

          <div
            className={`work-preview${previewActive ? ' is-active' : ''}`}
            ref={previewRef}
            aria-hidden="true"
          >
            <div className="mock">
              <div className="mock-row">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
              <div className="mock-row">
                <div className="bar a" />
                <div className="bar b" />
              </div>
              <div className="mock-row">
                <div className="bar" />
              </div>
              <div className="mock-row">
                <div className="bar" />
                <div className="bar b" />
              </div>
              <div className="mock-row" style={{ marginTop: 'auto', gap: 3 }}>
                {[0.5, 0.5, 0.8, 0.5, 1, 0.6, 0.7].map((op, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${30 + op * 35}px`,
                      background: 'linear-gradient(180deg,var(--accent-a),transparent)',
                      borderRadius: 2,
                      opacity: op,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {hasNow ? (
        <section className="now">
          <div className="now-left">
            {profile.nowEyebrow ? <span className="eyebrow">{profile.nowEyebrow}</span> : null}
            <h2>
              {profile.nowTitleBefore}{' '}
              {profile.nowTitleItalic ? (
                <span className="it">{profile.nowTitleItalic}</span>
              ) : null}
              {profile.nowTitleAfter}
            </h2>
            {profile.nowBlurb ? (
              <p style={{ color: 'var(--fg-1)', maxWidth: '40ch', fontSize: 15 }}>
                {profile.nowBlurb}
              </p>
            ) : null}
          </div>
          <div className="now-card reveal">
            <h3>{profile.nowTitle || 'This month'}</h3>
            <div className="sub">{profile.nowSub || 'Focus · Deep work · Shipping'}</div>
            <ul className="now-list">
              {nowItems.map((n) => (
                <li key={n.id}>
                  {n.text}
                  {n.meta ? <span className="meta">{n.meta}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {hasExperience ? (
        <section className="experience" id="experience">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                {profile.experienceEyebrow ? (
                  <span className="eyebrow">{profile.experienceEyebrow}</span>
                ) : null}
                <h2 className="section-title">
                  {profile.experienceTitleBefore}{' '}
                  {profile.experienceTitleItalic ? (
                    <span className="it">{profile.experienceTitleItalic}</span>
                  ) : null}{' '}
                  {profile.experienceTitleAfter}
                </h2>
              </div>
              {profile.experienceSubtitle ? (
                <div
                  style={{
                    color: 'var(--fg-1)',
                    fontSize: 15,
                    maxWidth: '40ch',
                    justifySelf: 'end',
                    alignSelf: 'end',
                  }}
                >
                  {profile.experienceSubtitle}
                </div>
              ) : null}
            </div>

            <div className="xp-list">
              {experience.map((x) => (
                <div key={x.id} className="xp-row reveal" {...magnetHandlers()}>
                  <div className="xp-year">{x.year}</div>
                  <div className="xp-title">
                    {x.role} <span className="at">at</span>
                  </div>
                  <div className="xp-company">{x.company}</div>
                  <div className="xp-loc">{x.location}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {hasStack ? (
        <section className="stack" id="stack">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                {profile.stackEyebrow ? (
                  <span className="eyebrow">{profile.stackEyebrow}</span>
                ) : null}
                <h2 className="section-title">
                  {profile.stackTitleBefore}{' '}
                  {profile.stackTitleItalic ? (
                    <span className="it">{profile.stackTitleItalic}</span>
                  ) : null}{' '}
                  {profile.stackTitleAfter}
                </h2>
              </div>
              {profile.stackSubtitle ? (
                <div
                  style={{
                    color: 'var(--fg-1)',
                    fontSize: 15,
                    maxWidth: '40ch',
                    justifySelf: 'end',
                    alignSelf: 'end',
                  }}
                >
                  {profile.stackSubtitle}
                </div>
              ) : null}
            </div>

            <div className="stack-grid">
              {stack.map((s, i) => (
                <div key={s.id} className="stack-cell reveal">
                  <div className="stack-num">/ {String(i + 1).padStart(2, '0')}</div>
                  <div className="stack-title">
                    {s.title}{' '}
                    {s.italicPart ? <span className="it">{s.italicPart}</span> : null}
                  </div>
                  <p className="stack-desc">{s.description}</p>
                  <div className="stack-tags">
                    {(s.tags || []).map((t) => (
                      <span key={t} className="pf-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {testimonial ? (
        <section className="testi">
          <div className="wrap">
            {profile.testimonialEyebrow ? (
              <span className="eyebrow" style={{ justifyContent: 'center' }}>
                {profile.testimonialEyebrow}
              </span>
            ) : null}
            <p className="testi-quote">{testimonial.quote}</p>
            <div className="testi-meta">
              <div className="testi-ava">
                {testimonial.initials ||
                  testimonial.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
              </div>
              <div className="testi-who">
                <div className="testi-name">{testimonial.name}</div>
                <div className="testi-role">{testimonial.role}</div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="contact" id="contact">
        <div className="wrap">
          {profile.contactEyebrow ? (
            <span className="eyebrow">{profile.contactEyebrow}</span>
          ) : null}
          <h2>
            <a
              href={profile.email ? `mailto:${profile.email}` : '#'}
              {...linkHandlers}
              {...magnetHandlers()}
            >
              {profile.contactCtaBefore}{' '}
              {profile.contactCtaItalic ? (
                <span className="it">{profile.contactCtaItalic}</span>
              ) : null}
              {profile.contactCtaAfter}
            </a>
          </h2>

          {socialLinks.length ? (
            <div className="contact-meta">
              {socialLinks.map((s) => (
                <div key={s.k} className="cmeta">
                  <div className="k">{s.k}</div>
                  <div className="v">
                    <a href={s.href} {...linkHandlers}>
                      {s.label}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <ContactForm />
        </div>
      </section>

      <footer className="pf-footer">
        <span>
          © {currentYear} {profile.name}
          {profile.footerTagline ? ` — ${profile.footerTagline}` : ''}
        </span>
        <span>Local · {clock}</span>
        <span>
          {profile.footerVersion ? `${profile.footerVersion} · ` : ''}
          <Link to="/admin" style={{ letterSpacing: '.08em' }}>
            Admin ↗
          </Link>
        </span>
      </footer>
    </div>
  );
}
