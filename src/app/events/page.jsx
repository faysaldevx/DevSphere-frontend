"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { getAllEvents, onlyUpcoming, EVENT_TYPES } from "@/lib/api";

function Icon({ children, className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}


export default function UpcomingEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllEvents()
      .then((all) => setEvents(onlyUpcoming(all)))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);


  const countOf = (t) => (t === "all" ? events.length : events.filter((e) => e.eventType === t).length);

  // Search + type filter
  const text = search.trim().toLowerCase();
  const shownEvents = events.filter((event) => {
    const typeMatches = type === "all" || event.eventType === type;
    const title = (event.title || "").toLowerCase();
    const location = (event.location || "").toLowerCase();
    const textMatches = text === "" || title.includes(text) || location.includes(text);
    return typeMatches && textMatches;
  });

  const clearFilters = () => {
    setType("all");
    setSearch("");
  };

  const chips = ["all", ...EVENT_TYPES];

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: "#04353A", color: "#fff", fontSize: "14px" } }} />
      <Navbar />

      <main className="min-h-screen bg-[var(--page)]">
        {/* ---------- Page header ---------- */}
        <section className="relative isolate overflow-hidden border-b border-[var(--line)] bg-gradient-to-b from-[var(--soft)] to-[var(--page)]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#1B8F3F]/15 blur-3xl" />
            <div className="absolute -right-24 top-0 h-64 w-64 rounded-full bg-[#F28C1B]/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  Happening soon
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--ink)] sm:text-5xl">Upcoming Events</h1>
                <p className="mt-3 leading-relaxed text-[var(--muted)]">
                  Browse community drives that are still ahead and pick one to join. Events whose dates have passed are
                  hidden for you.
                </p>
              </div>

              <Link
                href="/create-event"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1B8F3F]/20 transition hover:bg-[var(--brand-hover)]"
              >
                <Icon><path d="M12 5v14M5 12h14" /></Icon>
                Create Event
              </Link>
            </div>

            <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">

              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0">
                {chips.map((t) => {
                  const active = type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-[var(--brand)] text-white shadow-sm"
                          : "text-[var(--muted)] hover:bg-[var(--page)] hover:text-[var(--ink)]"
                      }`}
                    >
                      {t === "all" ? "All" : t}
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                          active ? "bg-white/20 text-white" : "bg-[var(--page)] text-[var(--muted)]"
                        }`}
                      >
                        {countOf(t)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-72">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                  <Icon><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title or location"
                  aria-label="Search events"
                  className="w-full rounded-lg border border-[var(--line)] bg-[var(--page)] py-2.5 pl-10 pr-9 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-4 focus:ring-[#1B8F3F]/15"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--muted)] hover:text-[var(--ink)]"
                  >
                    <Icon className="h-3.5 w-3.5"><path d="M6 6l12 12M18 6L6 18" /></Icon>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Results ---------- */}
        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          {!loading && (
            <p className="mb-6 text-sm text-[var(--muted)]">
              Showing <span className="font-semibold text-[var(--ink)]">{shownEvents.length}</span> of {events.length}{" "}
              upcoming {events.length === 1 ? "event" : "events"}
              {type !== "all" && <> in <span className="font-semibold text-[var(--ink)]">{type}</span></>}
              {text && <> for “<span className="font-semibold text-[var(--ink)]">{search.trim()}</span>”</>}
            </p>
          )}

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[400px] animate-pulse rounded-2xl bg-[var(--line)]" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-16 text-center">
              <p className="text-lg font-semibold text-[var(--ink)]">No upcoming events yet</p>
              <Link href="/create-event" className="mt-3 inline-block text-sm font-semibold text-[var(--brand-text)] hover:underline">
                Be the first to create one →
              </Link>
            </div>
          ) : shownEvents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-16 text-center">
              <p className="text-lg font-semibold text-[var(--ink)]">No events match your search</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Try another type or a different word.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--brand)] hover:text-[var(--brand-text)]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shownEvents.map((e) => (
                <EventCard key={e._id} event={e} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}