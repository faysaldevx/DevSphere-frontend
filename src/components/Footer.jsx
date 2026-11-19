import Link from "next/link";
import Logo from "@/components/Logo";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/events", label: "Upcoming Events" },
      { href: "/#features", label: "Why DevSphere" },
      { href: "/#how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Register" },
      { href: "/create-event", label: "Create an Event" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v7h4v-7h3l1-4h-4V9c0-.6.4-1 1-1z" fill="currentColor" />
    ),
  },
  {
    // New X logo (not the old Twitter bird)
    label: "X",
    href: "https://x.com",
    icon: (
      <path d="M17.8 3h3.2l-7 8 8.2 10h-6.4l-5-6.3L5 21H1.8l7.5-8.6L1.5 3H8l4.6 5.8L17.8 3zm-1.1 16.2h1.8L7.3 4.7H5.4l11.3 14.5z" fill="currentColor" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <path d="M4.5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 8.5h3V21H3V8.5zm6 0h2.9v1.7h.1c.4-.8 1.4-1.9 3.2-1.9 3.4 0 4 2.2 4 5.1V21h-3v-6.6c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V21H9V8.5z" fill="currentColor" />
    ),
  },
];

// Fixed year: new Date() is not allowed during prerender in newer Next.js versions
const YEAR = 2026;

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--muted)]">
            A place for people to find social development events near them, join in, and see real change happen.
          </p>

          <div className="mt-6 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--brand-text)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-[var(--ink)]">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[var(--muted)] transition hover:text-[var(--brand-text)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--line)]">
        <p className="mx-auto max-w-6xl px-5 py-5 text-sm text-[var(--muted)] sm:px-8">
          © {YEAR} DevSphere. Connecting people, inspiring progress.
        </p>
      </div>
    </footer>
  );
}