import Link from "next/link";

const STATS = [
  { value: "1,450+", label: "Active Volunteers", color: "text-[var(--brand-text)]" },
  { value: "180+", label: "Events Completed", color: "text-[var(--ink)]" },
  { value: "24,000+", label: "Lives Impacted", color: "text-[var(--brand-text)]" },
  { value: "100%", label: "Community Driven", color: "text-[var(--accent)]" },
];

function SphereArt() {
  return (
    <svg viewBox="0 0 520 520" className="h-auto w-full" fill="none" role="img" aria-label="People connected around a globe">
      <defs>
        <linearGradient id="globe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a6b5a" />
          <stop offset="1" stopColor="#04353A" />
        </linearGradient>
      </defs>

      {/* rings */}
      <circle cx="260" cy="260" r="110" stroke="#1B8F3F" strokeOpacity="0.6" strokeWidth="1.5" />
      <circle cx="260" cy="260" r="170" stroke="#1B8F3F" strokeOpacity="0.4" strokeWidth="1.5" />
      <circle cx="260" cy="260" r="230" stroke="#1B8F3F" strokeOpacity="0.22" strokeWidth="1.5" />

      {/* connections (colour follows day/night) */}
      <g className="stroke-[var(--ink)]" strokeOpacity="0.2" strokeWidth="1.5">
        <line x1="355.3" y1="315" x2="407.2" y2="175" />
        <line x1="407.2" y1="175" x2="375" y2="60.8" />
        <line x1="156.6" y1="222.4" x2="100.2" y2="318.1" />
        <line x1="260" y1="430" x2="145" y2="459.2" />
        <line x1="355.3" y1="315" x2="260" y2="430" />
        <line x1="156.6" y1="222.4" x2="181.3" y2="43.8" />
      </g>

      {/* globe */}
      <circle cx="260" cy="260" r="82" fill="url(#globe)" />
      <path d="M213 236c10-18 30-24 44-16 8 5 4 18-6 22-12 4-14 16-28 14-8-2-14-12-10-20z" fill="#6bb36d" fillOpacity="0.9" />
      <path d="M270 262c14-8 32-2 36 12 4 12-6 26-18 28-10 2-14-8-20-14-6-8-6-20 2-26z" fill="#6bb36d" fillOpacity="0.75" />

      {/* orange arc, echoing the logo */}
      <path d="M60.8 145 A230 230 0 0 1 375 60.8" stroke="#F28C1B" strokeWidth="7" strokeLinecap="round" />
      <circle cx="375" cy="60.8" r="10" fill="#F28C1B" />

      {/* people */}
      <g className="stroke-[var(--surface)]" strokeWidth="4">
        <circle cx="355.3" cy="315" r="14" fill="#F28C1B" />
        <circle cx="156.6" cy="222.4" r="14" fill="#1B8F3F" />
        <circle cx="260" cy="430" r="16" fill="#0a6b5a" />
        <circle cx="407.2" cy="175" r="16" fill="#1B8F3F" />
        <circle cx="100.2" cy="318.1" r="14" fill="#F28C1B" />
        <circle cx="476.1" cy="338.7" r="12" fill="#0a6b5a" />
        <circle cx="181.3" cy="43.8" r="12" fill="#F28C1B" />
        <circle cx="145" cy="459.2" r="14" fill="#1B8F3F" />
      </g>
    </svg>
  );
}

export default function Hero() {
  return (
    // Fades from a soft green at the top into the normal page colour at the bottom
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[var(--soft)] via-[var(--page)] to-[var(--page)]">
      {/* Background glows + dotted pattern that fades out */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#1B8F3F]/15 blur-3xl" />
        <div className="absolute -right-32 top-20 h-[380px] w-[380px] rounded-full bg-[#F28C1B]/10 blur-3xl" />
        <div className="absolute inset-0 [background-image:radial-gradient(var(--line)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Text + buttons + stats */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium tracking-wide text-[var(--muted)] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Social development events near you
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-[56px]">
            Good work happens when people{" "}
            <span className="text-[var(--brand-text)]">find each other.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
            DevSphere connects you with community events in your area, so good intentions turn into visible action.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-6 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[#1B8F3F]/20 transition hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1B8F3F]/30"
            >
              Explore Upcoming Events
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/create-event"
              className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-6 py-3.5 text-[15px] font-semibold text-[var(--ink)] transition hover:border-[var(--brand)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1B8F3F]/20"
            >
              Create an Event
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-5 shadow-sm">
                <p className={`text-2xl font-extrabold tracking-tight ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs text-[var(--muted)] sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Art */}
        <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
          <div aria-hidden="true" className="absolute inset-8 rounded-full bg-[#1B8F3F]/15 blur-2xl" />
          <div className="relative rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xl">
            <SphereArt />
          </div>
        </div>
      </div>
    </section>
  );
}