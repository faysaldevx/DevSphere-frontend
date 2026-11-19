"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import { getAllEvents, onlyUpcoming } from "@/lib/api";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getAllEvents()
      .then((all) => setEvents(onlyUpcoming(all).slice(0, 6)))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);
  return (
    <section id="upcoming" className="scroll-mt-20 bg-[var(--page)]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Happening soon</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">Upcoming events</h2>
            <p className="mt-2 text-[var(--muted)]">Pick an event near you and be part of the change.</p>
          </div>
          <Link href="/events" className="text-sm font-semibold text-[var(--brand-text)] hover:underline">
            View all events →
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[400px] animate-pulse rounded-2xl bg-[var(--line)]" />
            ))}
          </div>
        ) : failed ? (
          <p className="mt-10 text-[var(--muted)]">Events couldn&apos;t be loaded right now. Please try again later.</p>
        ) : events.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-14 text-center">
            <p className="text-lg font-semibold text-[var(--ink)]">No upcoming events yet</p>
            <Link href="/create-event" className="mt-3 inline-block text-sm font-semibold text-[var(--brand-text)] hover:underline">
              Be the first to create one →
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}