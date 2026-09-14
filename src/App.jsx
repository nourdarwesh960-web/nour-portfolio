import { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import './App.css';

const EASE = [0.22, 1, 0.36, 1];

const EMAIL = 'nourdarwesh960@gmail.com';
const GMAIL_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`;
const LINKEDIN_URL = 'https://www.linkedin.com/in/nour-darwesh-13aa1b38b/';
const GITHUB_URL = 'https://github.com/nourdarwesh960-web';
const INSTAGRAM_URL = 'https://www.instagram.com/nourrdarwesh_/';
const STORE_URL = 'https://cmnriuac3001501ma0wr1dxbk.wuiltstore.com/en';

const TECH_TICKER = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript',
  'React', 'Next.js', 'Tailwind', 'Sass',
  'Framer Motion', 'GSAP', 'Vite', 'Git',
  'Figma', 'Photoshop', 'Illustrator', 'After Effects',
];

const STACK_PILLS = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript',
  'React', 'Next.js', 'Tailwind', 'Sass',
  'Framer Motion', 'GSAP', 'Vite', 'Git',
  'Figma', 'Responsive Design', 'Accessibility',
  'UI/UX', 'Photoshop', 'Illustrator',
  'After Effects', 'Brand Identity', 'Motion Graphics',
];

const T = {
  en: {
    dir: 'ltr',
    nav: { home: 'Home', about: 'About', services: 'Services', work: 'Work', contact: 'Contact' },
    hero: {
      bigWord: 'PORTFOLIO',
      subtitleBold: 'Front-end',
      subtitleItalic: 'Developer',
      contact: 'Contact',
    },
    about: {
      eyebrow: 'ABOUT ME',
      bigWord: 'Intro',
      bio: "A front-end developer from Egypt with a background in graphic design. I spent time at an art production company crafting brand identities and motion graphics before moving into front-end — now I blend that visual eye with clean code, building interfaces that feel effortless to use. I care about responsive layouts, accessibility, and the small details that make a product feel great.",
      cofounder: 'Co-founder at',
    },
    stack: { eyebrow: 'THE STACK' },
    services: {
      title: 'What I do',
      items: [
        {
          title: 'WEB DEVELOPMENT',
          desc: 'Building modern, fast web apps with React, Next.js, and clean, maintainable code that scales with your product.',
          list: ['React', 'Next.js', 'TypeScript', 'Vite', 'Node.js', 'Express'],
        },
        {
          title: 'GRAPHIC DESIGN',
          desc: 'Designing brand identities, visual systems, and motion graphics — the eye for composition and color that now shapes every interface I build.',
          list: ['Brand Identity', 'Logo Design', 'Motion Graphics', 'Photoshop', 'Illustrator', 'After Effects'],
        },
        {
          title: 'UI & LAYOUT',
          desc: 'Translating designs into pixel-perfect, responsive interfaces with great attention to detail and accessibility.',
          list: ['Tailwind CSS', 'CSS / SCSS', 'Responsive Design', 'Figma', 'Accessibility', 'Design Systems'],
        },
        {
          title: 'MOTION & INTERACTION',
          desc: 'Adding smooth animations and micro-interactions that make interfaces feel alive without sacrificing performance.',
          list: ['Framer Motion', 'GSAP', 'Scroll Animations', 'Micro-interactions', 'Page Transitions', 'SVG Animation'],
        },
        {
          title: 'PERFORMANCE & SEO',
          desc: 'Optimizing load times, bundle size, and search visibility so your product reaches the right people, fast.',
          list: ['Lighthouse Audits', 'Code Splitting', 'Lazy Loading', 'Meta Tags', 'SSR / SSG', 'Core Web Vitals'],
        },
        {
          title: 'DEPLOYMENT & TOOLING',
          desc: 'Handling the full shipping pipeline — from version control to CI/CD to production monitoring.',
          list: ['Git & GitHub', 'Vercel', 'Netlify', 'CI/CD', 'Environment Config', 'Monitoring'],
        },
      ],
    },
    work: {
      title: 'Selected Work',
      items: [
        { title: 'Portfolio Website', summary: 'A personal portfolio with a cinematic intro, word-by-word scroll reveals, and a fixed top bar with a sliding active indicator.' },
        { title: "L'Atelier Store", summary: 'A modern e-commerce storefront for a fashion brand. Focused on a clean product grid, smooth cart interactions, and a mobile-first responsive layout.' },
      ],
    },
    contact: {
      title: 'Contact',
      body: "I'm open to new projects, collaborations, or just a friendly chat. Feel free to reach out — I usually reply within a day.",
      email: 'Email', linkedin: 'LinkedIn', github: 'GitHub', instagram: 'Instagram',
    },
    footer: { copy: '© 2026 Nour Darwesh', built: 'Built with care' },
    intro: {
      eyebrow: "Hello, I'm",
      profile: 'Profile',
      taglineA: 'Front-end Developer',
      taglineB: 'Graphic Designer',
      subtitle: 'Crafting interfaces & visuals since 2021',
      enter: 'Enter',
      cornerTl: 'Portfolio / 2026',
      cornerTr: 'Nour Darwesh',
      cornerBl: 'Cairo · Egypt',
      cornerBr: 'Available for work',
    },
  },
  ar: {
    dir: 'rtl',
    nav: { home: 'الرئيسية', about: 'نبذة', services: 'الخدمات', work: 'أعمالي', contact: 'تواصل' },
    hero: {
      bigWord: 'بورتفوليو',
      subtitleBold: 'مطوّر',
      subtitleItalic: 'واجهات',
      contact: 'تواصل',
    },
    about: {
      eyebrow: 'نبذة عني',
      bigWord: 'تعريف',
      bio: 'مطوّر واجهات أمامية من مصر بخلفية في التصميم الجرافيكي. عملت في شركة إنتاج فني حيث صممت هويات بصرية وموشن جرافيك قبل ما أنتقل لتطوير الواجهات — دلوقتي بدمج حس التصميم البصري مع الكود النظيف عشان أبني واجهات تبدو سهلة الاستخدام. بهتم بالتصميم المتجاوب، الوصولية، والتفاصيل الصغيرة اللي تخلي المنتج يبان مميز.',
      cofounder: 'شريك مؤسس في',
    },
    stack: { eyebrow: 'التقنيات' },
    services: {
      title: 'ما أُقدّمه',
      items: [
        {
          title: 'تطوير الويب',
          desc: 'بناء تطبيقات ويب حديثة وسريعة باستخدام React وNext.js وكود نظيف وقابل للتوسع.',
          list: ['React', 'Next.js', 'TypeScript', 'Vite', 'Node.js', 'Express'],
        },
        {
          title: 'التصميم الجرافيكي',
          desc: 'تصميم الهويات البصرية والأنظمة البصرية والموشن جرافيك — حس التكوين والألوان اللي بيشكّل كل واجهة أبنيها.',
          list: ['الهوية البصرية', 'تصميم الشعارات', 'موشن جرافيك', 'Photoshop', 'Illustrator', 'After Effects'],
        },
        {
          title: 'واجهات المستخدم',
          desc: 'تحويل التصاميم إلى واجهات متجاوبة بالبكسل مع اهتمام بالتفاصيل والوصولية.',
          list: ['Tailwind CSS', 'CSS / SCSS', 'التصميم المتجاوب', 'Figma', 'الوصولية', 'أنظمة التصميم'],
        },
        {
          title: 'الحركة والتفاعل',
          desc: 'إضافة حركات سلسة وتفاعلات دقيقة تجعل الواجهات تنبض بالحياة بدون التأثير على الأداء.',
          list: ['Framer Motion', 'GSAP', 'حركات التمرير', 'تفاعلات دقيقة', 'انتقالات الصفحات', 'تحريك SVG'],
        },
        {
          title: 'الأداء وتحسين محركات البحث',
          desc: 'تحسين سرعة التحميل وحجم الحزمة وظهور المنتج في نتائج البحث.',
          list: ['Lighthouse', 'تقسيم الكود', 'Lazy Loading', 'Meta Tags', 'SSR / SSG', 'Core Web Vitals'],
        },
        {
          title: 'النشر والأدوات',
          desc: 'إدارة دورة النشر كاملة من Git إلى CI/CD إلى المراقبة في الإنتاج.',
          list: ['Git & GitHub', 'Vercel', 'Netlify', 'CI/CD', 'متغيرات البيئة', 'المراقبة'],
        },
      ],
    },
    work: {
      title: 'أعمال مختارة',
      items: [
        { title: 'موقع البورتفوليو', summary: 'بورتفوليو شخصي مع مقدمة سينمائية وكشف الكلمات عند التمرير.' },
        { title: "متجر L'Atelier", summary: 'متجر إلكتروني حديث لعلامة أزياء.' },
      ],
    },
    contact: {
      title: 'تواصل',
      body: 'أنا منفتح على المشاريع الجديدة أو التعاون. تواصل معي وسأرد خلال يوم.',
      email: 'البريد', linkedin: 'لينكدإن', github: 'جيت هب', instagram: 'إنستجرام',
    },
    footer: { copy: '© 2026 نور درويش', built: 'صُنع بعناية' },
    intro: {
      eyebrow: 'أهلاً، أنا',
      profile: 'الملف',
      taglineA: 'مطوّر واجهات',
      taglineB: 'مصمم جرافيك',
      subtitle: 'أصمّم وأطوّر منذ 2021',
      enter: 'ادخل',
      cornerTl: 'بورتفوليو / 2026',
      cornerTr: 'نور درويش',
      cornerBl: 'القاهرة · مصر',
      cornerBr: 'متاح للعمل',
    },
  },
};

/* ============================================================
   SCROLL TEXT
   ============================================================ */
function ScrollText({ text, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.55'],
  });
  const words = text.split(' ');

  return (
    <p ref={ref} className={`scroll-text ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span className="scroll-word">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

/* ============================================================
   FADE
   ============================================================ */
function Fade({ children, delay = 0, className = '', y = 30 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   INTRO — longer, cinematic, language-aware
   ============================================================ */
function Intro({ onEnter, lang }) {
  const t = T[lang].intro;
  const isAr = lang === 'ar';
  const name = isAr ? 'نور درويش' : 'Nour Darwesh';

  return (
    <motion.div
      className="intro"
      exit={{ y: '-100%' }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <motion.div
        className="intro-aura"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: EASE }}
      />

      <div className="intro-stage">
        <motion.span
          className="intro-eyebrow"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
          {t.eyebrow}
        </motion.span>

        <div className="intro-word">
          {isAr
            ? name.split(' ').map((word, i) => (
                <span key={i} className="intro-char-wrap">
                  <motion.span
                    className="intro-char"
                    initial={{ y: '110%', opacity: 0, filter: 'blur(10px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    transition={{
                      duration: 1.1,
                      delay: 0.6 + i * 0.45,
                      ease: EASE,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))
            : name.split('').map((ch, i) => (
                <span key={i} className="intro-char-wrap">
                  <motion.span
                    className="intro-char"
                    initial={{ y: '110%', opacity: 0, filter: 'blur(10px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    transition={{
                      duration: 1.05,
                      delay: 0.6 + i * 0.11,
                      ease: EASE,
                    }}
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </motion.span>
                </span>
              ))}
        </div>

        <motion.span
          className="intro-line"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.1, ease: EASE }}
        />

        <motion.div
          className="intro-profile"
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 2.5, ease: EASE }}
        >
          <span className="intro-profile-dot" />
          <span className="intro-profile-text">{t.profile}</span>
        </motion.div>

        <motion.p
          className="intro-tagline"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.0, ease: EASE }}
        >
          {t.taglineA}
          <span className="intro-tagline-sep">·</span>
          {t.taglineB}
        </motion.p>

        <motion.div
          className="intro-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.5, ease: EASE }}
        >
          <span className="intro-subtitle-line" />
          <span className="intro-subtitle-text">{t.subtitle}</span>
          <span className="intro-subtitle-line" />
        </motion.div>

        <motion.button
          className="intro-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 4.1, ease: EASE }}
          onClick={onEnter}
        >
          <span>{t.enter}</span>
          <motion.span
            className="intro-cta-arrow"
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            →
          </motion.span>
        </motion.button>
      </div>

      <motion.div
        className="intro-corner intro-corner-tl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {t.cornerTl}
      </motion.div>

      <motion.div
        className="intro-corner intro-corner-tr"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {t.cornerTr}
      </motion.div>

      <motion.div
        className="intro-corner intro-corner-bl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        {t.cornerBl}
      </motion.div>

      <motion.div
        className="intro-corner intro-corner-br"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        {t.cornerBr}
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   PARTICLES
   ============================================================ */
function Particles() {
  const dots = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2,
    dur: 8 + Math.random() * 12,
    delay: Math.random() * 5,
    opacity: 0.1 + Math.random() * 0.25,
  }));

  return (
    <div className="particles" aria-hidden>
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="particle"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
          }}
          animate={{ y: [0, -30, 0], x: [0, 12, 0] }}
          transition={{
            duration: d.dur,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   ICONS
   ============================================================ */
function GmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.12 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.27 5.69.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

/* ============================================================
   NAV
   ============================================================ */
function Nav({ t, theme, onToggleTheme, lang, onToggleLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('top');

  const navSections = [
    { id: 'top',      label: t.nav.home     },
    { id: 'about',    label: t.nav.about    },
    { id: 'services', label: t.nav.services },
    { id: 'work',     label: t.nav.work     },
    { id: 'contact',  label: t.nav.contact  },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['top', 'about', 'services', 'work', 'contact'];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const onScroll = () => {
      const y = window.scrollY;
      const offset = 160;
      let current = 'top';
      elements.forEach((el) => {
        if (y + offset >= el.offsetTop) current = el.id;
      });
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className={`nav ${scrolled ? 'is-scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <a href="#top" className="nav-brand">
        <span className="nav-name">{lang === 'ar' ? 'نور درويش' : 'NOUR DARWESH'}</span>
      </a>

      <nav className="nav-menu">
        {navSections.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <a key={s.id} href={`#${s.id}`} className={`nav-link ${isActive ? 'is-active' : ''}`}>
              <span className="nav-link-label">{s.label}</span>
              {isActive && (
                <motion.span
                  className="nav-underline"
                  layoutId="nav-underline"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </a>
          );
        })}
      </nav>

      <div className="nav-right">
        <button className="lang-toggle" onClick={onToggleLang} aria-label="Switch language">
          {lang === 'ar' ? 'EN' : 'ع'}
        </button>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </motion.header>
  );
}

/* ============================================================
   HERO — 3D scene + scroll transitions
   ============================================================ */
function Hero({ t }) {
  const heroRef = useRef(null);

  /* mouse parallax */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 90, damping: 20, mass: 0.8 });
  const smy = useSpring(my, { stiffness: 90, damping: 20, mass: 0.8 });

  /* scroll progress of the hero section */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  /* word fades + lifts up as you scroll */
  const wordOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const wordY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const wordScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  /* photo fades + drifts down slightly */
  const photoOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  /* bottom bar fades out first */
  const bottomOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  /* mouse-parallax transforms */
  const tX = useTransform(smx, [-0.5, 0.5], [16, -16]);
  const tY = useTransform(smy, [-0.5, 0.5], [10, -10]);
  const tRotY = useTransform(smx, [-0.5, 0.5], [-5, 5]);
  const tRotX = useTransform(smy, [-0.5, 0.5], [3, -3]);

  const pX = useTransform(smx, [-0.5, 0.5], [-28, 28]);
  const pY = useTransform(smy, [-0.5, 0.5], [-16, 16]);
  const pRotY = useTransform(smx, [-0.5, 0.5], [9, -9]);
  const pRotX = useTransform(smy, [-0.5, 0.5], [-7, 7]);

  return (
    <section
      id="top"
      className="hero"
      ref={heroRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="hero-3d-scene">
        {/* WORD — outer: scroll fade, inner: mouse parallax */}
        <motion.div
          className="hero-bg-layer"
          aria-hidden
          style={{
            opacity: wordOpacity,
            y: wordY,
            scale: wordScale,
          }}
        >
          <motion.div
            style={{
              x: tX,
              y: tY,
              rotateX: tRotX,
              rotateY: tRotY,
              z: -140,
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.h1
              className="hero-bg-text"
              initial={{ y: '-40vh', opacity: 0, rotateX: 45 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ duration: 1.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {t.hero.bigWord}
            </motion.h1>
          </motion.div>
        </motion.div>

        {/* PHOTO — outer: scroll fade, inner: mouse parallax */}
        <motion.div
          className="hero-photo-layer"
          style={{
            opacity: photoOpacity,
            y: photoY,
          }}
        >
          <motion.div
            style={{
              x: pX,
              y: pY,
              rotateX: pRotX,
              rotateY: pRotY,
              z: 40,
              transformStyle: 'preserve-3d',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              width: '100%',
              height: '100%',
            }}
          >
            <motion.img
              src="/WhatsApp_Image_2026-09-14_at_5.31.22_AM-removebg-preview.png"
              alt="Nour Darwesh"
              className="hero-photo-img"
              draggable={false}
              initial={{ y: '100vh', opacity: 0, rotateX: 40, scale: 0.85 }}
              animate={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
              transition={{ duration: 1.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* BOTTOM BAR — fades out on scroll (children keep their own entry animation) */}
      <motion.div
        className="hero-bottom"
        style={{ opacity: bottomOpacity }}
      >
        <motion.div
          className="hero-subtitle"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: EASE }}
        >
          <span className="hero-subtitle-bold">{t.hero.subtitleBold}</span>
          <span className="hero-subtitle-italic">{t.hero.subtitleItalic}</span>
        </motion.div>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.25, ease: EASE }}
        >
          <button className="hero-arrow-btn" onClick={scrollToAbout} aria-label="Scroll down">
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              ↓
            </motion.span>
          </button>

          <a href="#contact" className="hero-contact-btn">
            {t.hero.contact}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   TECH TICKER
   ============================================================ */
function TechTicker() {
  const items = [...TECH_TICKER, ...TECH_TICKER];
  return (
    <section className="ticker" aria-label="Technologies">
      <div className="ticker-fade ticker-fade-left" />
      <div className="ticker-fade ticker-fade-right" />
      <div className="ticker-track">
        {items.map((tech, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-dot" />
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT
   ============================================================ */
function About({ t }) {
  return (
    <section id="about" className="about">
      <motion.div
        className="about-left"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: EASE }}
      >
        <span className="about-eyebrow">{t.about.eyebrow}</span>
        <h2 className="about-big">{t.about.bigWord}</h2>
      </motion.div>

      <motion.div
        className="about-right"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
      >
        <ScrollText
          className="about-bio"
          text={`Hey, I'm Nour. ${t.about.bio}`}
        />

        <a className="about-store" href={STORE_URL} target="_blank" rel="noreferrer">
          <span className="about-store-label">{t.about.cofounder}</span>
          <span className="about-store-name">L'Atelier</span>
          <span className="about-store-arrow">↗</span>
        </a>
      </motion.div>
    </section>
  );
}

/* ============================================================
   STACK
   ============================================================ */
function Stack({ t }) {
  const row1 = STACK_PILLS.slice(0, 8);
  const row2 = STACK_PILLS.slice(8, 16);
  const row3 = STACK_PILLS.slice(16);

  return (
    <section className="stack">
      <motion.div
        className="stack-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <span className="stack-eyebrow">{t.stack.eyebrow}</span>
      </motion.div>

      <div className="stack-marquee">
        <div className="stack-row stack-row-left">
          <div className="stack-row-track">
            {[...row1, ...row1].map((tech, i) => (
              <span key={`r1-${i}`} className="stack-pill">
                <span className="stack-pill-dot" />
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="stack-row stack-row-right">
          <div className="stack-row-track">
            {[...row2, ...row2].map((tech, i) => (
              <span key={`r2-${i}`} className="stack-pill">
                <span className="stack-pill-dot" />
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="stack-row stack-row-left">
          <div className="stack-row-track">
            {[...row3, ...row3].map((tech, i) => (
              <span key={`r3-${i}`} className="stack-pill">
                <span className="stack-pill-dot" />
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SERVICES
   ============================================================ */
function Services({ t }) {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <Section id="services" index="02" title={t.services.title}>
      <div className="services-accordion">
        {t.services.items.map((s, i) => {
          const isOpen = openIndex === i;
          const num = String(i + 1).padStart(2, '0');

          return (
            <div
              key={i}
              className={`service-row ${isOpen ? 'is-open' : ''}`}
            >
              <button
                className="service-header"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                aria-expanded={isOpen}
              >
                <span className="service-num">{num}</span>
                <h3 className="service-row-title">{s.title}</h3>
                <span className="service-arrow" aria-hidden>↘</span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="service-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    <div className="service-body-inner">
                      <ul className="service-list">
                        {s.list.map((item) => (
                          <li key={item}>
                            <span className="service-list-dot" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      <p className="service-body-desc">{s.desc}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ============================================================
   SECTION WRAPPER
   ============================================================ */
function Section({ id, index, title, children }) {
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, amount: 0.2 });

  return (
    <section id={id} className="section">
      <motion.div
        ref={headRef}
        className="section-head"
        initial={{ opacity: 0, y: 30 }}
        animate={headInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <span className="section-index">{index}</span>
        <h2 className="section-title">{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}

/* ============================================================
   PROJECTS
   ============================================================ */
function Projects({ t }) {
  const images = [<SVGPortfolio key="p" />, <SVGStore key="s" />];
  const techs = [
    ['React', 'Framer Motion', 'Vite', 'CSS'],
    ['React', 'CSS', 'Responsive UI'],
  ];
  const links = [GITHUB_URL, STORE_URL];
  const numbers = ['01', '02'];

  return (
    <Section id="work" index="01" title={t.work.title}>
      <div className="projects">
        {t.work.items.map((p, i) => (
          <Fade key={i} delay={i * 0.08}>
            <a className="project" href={links[i]} target="_blank" rel="noreferrer">
              <div className="project-image-wrap">{images[i]}</div>

              <div className="project-content">
                <div className="project-head">
                  <span className="project-number">{numbers[i]}</span>
                  <h3 className="project-title">
                    <span className="project-title-text">{p.title}</span>
                  </h3>
                  <span className="project-year">2026</span>
                </div>
                <p className="project-summary">{p.summary}</p>
                <ul className="project-tech">
                  {techs[i].map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
              </div>

              <span className="project-arrow" aria-hidden>→</span>
            </a>
          </Fade>
        ))}
      </div>
    </Section>
  );
}

function SVGPortfolio() {
  return (
    <svg viewBox="0 0 320 200" className="project-image" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="p1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a1e3d" />
          <stop offset="100%" stopColor="#050b18" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#p1)" />
      <rect x="0" y="0" width="320" height="20" fill="#050b18" />
      <circle cx="12" cy="10" r="3" fill="#ef4444" />
      <circle cx="24" cy="10" r="3" fill="#eab308" />
      <circle cx="36" cy="10" r="3" fill="#22c55e" />
      <rect x="24" y="50" width="160" height="12" rx="2" fill="#3b82f6" />
      <rect x="24" y="70" width="200" height="12" rx="2" fill="#64748b" opacity="0.6" />
      <rect x="24" y="90" width="140" height="12" rx="2" fill="#64748b" opacity="0.4" />
      <rect x="24" y="120" width="70" height="20" rx="10" fill="#3b82f6" />
      <rect x="24" y="160" width="80" height="24" rx="4" fill="#1e3a5f" stroke="#3b82f6" opacity="0.4" />
      <rect x="112" y="160" width="80" height="24" rx="4" fill="#1e3a5f" stroke="#3b82f6" opacity="0.4" />
      <rect x="200" y="160" width="80" height="24" rx="4" fill="#1e3a5f" stroke="#3b82f6" opacity="0.4" />
    </svg>
  );
}

function SVGStore() {
  return (
    <svg viewBox="0 0 320 200" className="project-image" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="p2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0a1e3d" />
          <stop offset="100%" stopColor="#050b18" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#p2)" />
      <rect x="0" y="0" width="320" height="24" fill="#050b18" />
      <text x="16" y="16" fill="#fafafa" fontSize="10" fontFamily="serif" fontStyle="italic">L'Atelier</text>
      <text x="270" y="16" fill="#3b82f6" fontSize="8" fontFamily="sans-serif">CART · 0</text>
      <rect x="24" y="50" width="80" height="60" rx="4" fill="#1e3a5f" />
      <rect x="120" y="50" width="80" height="60" rx="4" fill="#1a3a6b" />
      <rect x="216" y="50" width="80" height="60" rx="4" fill="#1e3a5f" />
      <rect x="24" y="120" width="40" height="6" rx="2" fill="#3b82f6" opacity="0.6" />
      <rect x="120" y="120" width="40" height="6" rx="2" fill="#3b82f6" opacity="0.6" />
      <rect x="216" y="120" width="40" height="6" rx="2" fill="#3b82f6" opacity="0.6" />
      <rect x="24" y="140" width="80" height="40" rx="4" fill="#1e3a5f" />
      <rect x="120" y="140" width="80" height="40" rx="4" fill="#1a3a6b" />
      <rect x="216" y="140" width="80" height="40" rx="4" fill="#1e3a5f" />
    </svg>
  );
}

/* ============================================================
   CONTACT
   ============================================================ */
function Contact({ t }) {
  return (
    <Section id="contact" index="03" title={t.contact.title}>
      <div className="contact">
        <ScrollText text={t.contact.body} />

        <Fade delay={0.15} className="contact-actions">
          <a href={GMAIL_URL} target="_blank" rel="noreferrer" className="contact-btn">
            <span className="contact-btn-icon"><GmailIcon /></span>
            <span className="contact-btn-text">
              <span className="contact-btn-label">{t.contact.email}</span>
              <span className="contact-btn-value">{EMAIL}</span>
            </span>
          </a>

          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="contact-btn">
            <span className="contact-btn-icon"><LinkedInIcon /></span>
            <span className="contact-btn-text">
              <span className="contact-btn-label">{t.contact.linkedin}</span>
              <span className="contact-btn-value">nour-darwesh</span>
            </span>
          </a>

          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="contact-btn">
            <span className="contact-btn-icon"><GitHubIcon /></span>
            <span className="contact-btn-text">
              <span className="contact-btn-label">{t.contact.github}</span>
              <span className="contact-btn-value">nourdarwesh960-web</span>
            </span>
          </a>

          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="contact-btn">
            <span className="contact-btn-icon"><InstagramIcon /></span>
            <span className="contact-btn-text">
              <span className="contact-btn-label">{t.contact.instagram}</span>
              <span className="contact-btn-value">nourrdarwesh_</span>
            </span>
          </a>
        </Fade>
      </div>
    </Section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer({ t }) {
  return (
    <footer className="footer">
      <span>{t.footer.copy}</span>
      <span>{t.footer.built}</span>
    </footer>
  );
}

/* ============================================================
   APP
   ============================================================ */
export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');

  const t = T[lang];

  const toggleTheme = () => setTheme((x) => (x === 'dark' ? 'light' : 'dark'));
  const toggleLang = () => setLang((x) => (x === 'en' ? 'ar' : 'en'));

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  return (
    <div className="app" data-theme={theme} dir={t.dir}>
      <Particles />

      <AnimatePresence>
        {!introDone && (
          <Intro key="intro" lang={lang} onEnter={() => setIntroDone(true)} />
        )}
      </AnimatePresence>

      <Nav t={t} theme={theme} onToggleTheme={toggleTheme} lang={lang} onToggleLang={toggleLang} />

      <main>
        <Hero t={t} />
        <TechTicker />
        <About t={t} />
        <Stack t={t} />
        <Services t={t} />
        <Projects t={t} />
        <Contact t={t} />
      </main>

      <Footer t={t} />
    </div>
  );
}