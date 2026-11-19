"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const LINKS = [{ href: "/events", label: "Upcoming Events" }];

const PROFILE_MENU = [
  { href: "/create-event", label: "Create Event" },
  { href: "/manage-events", label: "Manage Events" },
  { href: "/joined-events", label: "Joined Events" },
];

function Avatar({ user, size = "h-9 w-9" }) {
  if (user.image) {
    return (
      <img
        src={user.image}
        alt={user.name || "Profile"}
        referrerPolicy="no-referrer"
        className={`${size} rounded-full border border-slate-200 object-cover`}
      />
    );
  }
  return (
    <span className={`${size} flex items-center justify-center rounded-full bg-[#04353A] text-sm font-semibold text-white`}>
      {(user.name || user.email || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function ProfileMenu({ user }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex items-center">
      {/* Profile icon + arrow. Clicking this opens the menu. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-1.5 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1B8F3F]/30"
      >
        <Avatar user={user} />
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-4 w-4 text-slate-600 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#04353A]">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <ul className="py-1.5">
            {PROFILE_MENU.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#1B8F3F]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const logout = async () => {
    await authClient.signOut();

    window.location.href = "/";
  };

  const ghostBtn =
    "rounded-lg px-4 py-2 text-sm font-semibold text-[#04353A] transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B8F3F]";
  const solidBtn =
    "rounded-lg bg-[#1B8F3F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#157a34] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1B8F3F]/30";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm font-medium text-slate-700 transition hover:text-[#1B8F3F]">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth area */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isPending ? (
            <span className="h-9 w-32" />
          ) : user ? (
            <>
              <ProfileMenu user={user} />
              <button onClick={logout} className={ghostBtn}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className={solidBtn}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile: theme toggle + menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-2 text-[#04353A] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B8F3F]"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-5 pb-5 pt-3 md:hidden">
          <ul className="space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-slate-800 hover:bg-slate-50"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {!isPending && user && (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2.5 px-3 pb-2">
                <Avatar user={user} />
                <span className="truncate text-sm font-semibold text-[#04353A]">{user.name}</span>
              </div>
              <ul className="space-y-1">
                {PROFILE_MENU.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-slate-800 hover:bg-slate-50"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 border-t border-slate-100 pt-4">
            {isPending ? null : user ? (
              <button onClick={logout} className={`${ghostBtn} w-full border border-slate-300`}>
                Logout
              </button>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className={`${solidBtn} block text-center`}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}