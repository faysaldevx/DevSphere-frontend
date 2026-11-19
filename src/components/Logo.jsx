import Link from "next/link";
function LogoIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ds-badge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22A653" />
          <stop offset="1" stopColor="#0A6B5A" />
        </linearGradient>
      </defs>

      {/* green badge */}
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#ds-badge)" />

      {/* globe */}
      <circle cx="24" cy="24" r="11" fill="none" stroke="#ffffff" strokeWidth="2" />
      <ellipse cx="24" cy="24" rx="4.6" ry="11" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeOpacity="0.85" />
      <path d="M13.5 24h21" stroke="#ffffff" strokeWidth="1.6" strokeOpacity="0.85" />

      {/* orange orbit (from the original logo) */}
      <path d="M9 31.5C6.5 25 13 14 25 10.5" fill="none" stroke="#F5A03A" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="25.5" cy="10.4" r="2.6" fill="#F5A03A" />

      {/* people */}
      <circle cx="33.5" cy="33" r="3.2" fill="#F5A03A" stroke="#ffffff" strokeWidth="1.4" />
      <circle cx="15.5" cy="35" r="2.6" fill="#ffffff" />
    </svg>
  );
}

export default function Logo({ light = false, className = "" }) {
  // Text colours follow the day/night theme (from globals.css).
  const devColor = light ? "text-white" : "text-[var(--ink)]";
  const sphereColor = light ? "text-[#6EE7B7]" : "text-[var(--brand-text)]";
  const tagColor = light ? "text-white/70" : "text-[var(--muted)]";

  return (
    <Link
      href="/"
      aria-label="DevSphere home"
      className={`group inline-flex shrink-0 items-center gap-2.5 ${className}`}
    >
      <LogoIcon className="h-10 w-10 transition-transform duration-300 group-hover:rotate-[-6deg] sm:h-11 sm:w-11" />

      <span className="flex flex-col leading-none">
        <span className="text-[22px] font-extrabold tracking-tight sm:text-2xl">
          <span className={devColor}>Dev</span>
          <span className={sphereColor}>Sphere</span>
        </span>
        <span className={`mt-1 hidden text-[10px] font-medium uppercase tracking-[0.18em] sm:block ${tagColor}`}>
          Connecting People
        </span>
      </span>
    </Link>
  );
}