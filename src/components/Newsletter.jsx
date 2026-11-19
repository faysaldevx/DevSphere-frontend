"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const POINTS = ["New events near you", "One email a week", "Unsubscribe any time"];

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thanks! You're on the list.");
    setEmail("");
  };

  return (
    <section id="newsletter" className="scroll-mt-20 bg-[var(--page)] px-5 py-20 sm:px-8">
      <Toaster position="top-center" toastOptions={{ style: { background: "#04353A", color: "#fff", fontSize: "14px" } }} />

      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--soft)] via-[var(--surface)] to-[var(--surface)] px-6 py-12 sm:px-12 sm:py-14">
        {/* soft glows */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#F28C1B]/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#1B8F3F]/15 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_440px]">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand)] text-white shadow-lg shadow-[#1B8F3F]/25">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              Never miss a drive in your area
            </h2>
            <p className="mt-3 max-w-lg text-[var(--muted)]">
              Get a short weekly email with new cleanups, donation drives and relief work happening near you.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-[var(--ink)]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-[var(--brand-text)]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm sm:p-6">
            <label htmlFor="newsletter-email" className="text-sm font-semibold text-[var(--ink)]">
              Your email
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[var(--line)] bg-[var(--page)] px-4 py-3 text-[15px] text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-4 focus:ring-[#1B8F3F]/15"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-[var(--brand)] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[var(--brand-hover)]"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">We respect your inbox. No spam, ever.</p>
          </form>
        </div>
      </div>
    </section>
  );
}