const FEATURES = [
  {
    title: "Discover nearby",
    text: "Filter events by type and search by title or location to find the work that fits your area and your schedule.",
    icon: <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  },
  {
    title: "Join in a single tap",
    text: "Sign in, press join, and your name is added to the event's volunteer list straight away.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.5 2.5L16 9.5" />
      </>
    ),
  },
  {
    title: "Organise your own events",
    text: "Publish a drive, update the details whenever plans change, or remove it once it is over.",
    icon: <path d="M4 20h4L19 9l-4-4L4 16v4z" />,
  },
  {
    title: "Only what is still ahead",
    text: "Events whose dates have passed are hidden automatically, so every listing is one you can still attend.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-[var(--page)]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Why DevSphere</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
            Everything you need to run community action
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
            Find events, join them, and manage your own, all in one place.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="flex h-full flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1B8F3F]/15 text-[var(--brand-text)]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {f.icon}
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-semibold text-[var(--ink)]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}