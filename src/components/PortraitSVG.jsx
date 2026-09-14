export default function PortraitSVG() {
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a33" />
          <stop offset="1" stopColor="#0e0e14" />
        </linearGradient>
        <radialGradient id="pg2" cx="50%" cy="32%" r="45%">
          <stop offset="0" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="300" height="400" fill="url(#pg)" />
      <rect width="300" height="400" fill="url(#pg2)" />
      <g fill="#1a1a22" opacity="0.85">
        <path d="M -20 400 Q 60 260 150 260 Q 240 260 320 400 Z" />
        <rect x="130" y="215" width="40" height="60" rx="16" />
        <ellipse cx="150" cy="165" rx="58" ry="72" />
        <path d="M 92 155 Q 85 95 150 85 Q 215 90 210 155 Q 205 130 180 124 Q 150 118 120 126 Q 98 136 92 155 Z" />
      </g>
      <ellipse cx="130" cy="145" rx="20" ry="28" fill="rgba(255,255,255,0.04)" />
      <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
        <line x1="0" y1="100" x2="300" y2="100" />
        <line x1="0" y1="200" x2="300" y2="200" />
        <line x1="0" y1="300" x2="300" y2="300" />
      </g>
    </svg>
  );
}
