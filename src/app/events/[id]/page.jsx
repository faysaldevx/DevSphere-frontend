"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch, formatDate, hasJoined } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TIPS = [
  "Reach the location a little early so the team can brief you.",
  "Wear comfortable clothes and carry a water bottle.",
  "Bring a friend. More hands finish the work faster.",
];

function organizerName(event) {
  if (event.creatorName) return event.creatorName;
  if (event.createdBy) return event.createdBy.split("@")[0];
  return "DevSphere member";
}

function daysLeftText(dateValue) {
  const days = Math.ceil((new Date(dateValue) - new Date()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

function Icon({ children, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function StripItem({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1B8F3F]/15 text-[var(--brand-text)]">
        <Icon>{icon}</Icon>
      </span>
      <div className="min-w-0">
        <p className="text-xs text-[var(--muted)]">{label}</p>
        <p className="truncate text-sm font-semibold text-[var(--ink)]">{value}</p>
      </div>
    </div>
  );
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    apiFetch(`/events/${id}`)
      .then(setEvent)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      toast.error("Please log in to join this event.");
      router.push("/login");
      return;
    }

    setJoining(true);
    try {
      const fresh = await apiFetch(`/events/${id}`);
      if (!fresh) throw new Error("This event no longer exists.");

      if (hasJoined(fresh, user.email)) {
        setEvent(fresh);
        toast.error("You have already joined this event.");
        return;
      }

      const joinedUsers = [
        ...(fresh.joinedUsers || []),
        { email: user.email, name: user.name, image: user.image || "", joinedAt: new Date().toISOString() },
      ];

      await apiFetch(`/events/${id}`, { method: "PATCH", body: JSON.stringify({ joinedUsers }) }, true);

      setEvent({ ...fresh, joinedUsers });
      toast.success("You have joined this event!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setJoining(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied!");
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  const isPast = event ? new Date(event.eventDate) < new Date() : false;
  const joined = event && user ? hasJoined(event, user.email) : false;
  const people = event?.joinedUsers || [];
  const organizer = event ? organizerName(event) : "";

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: "#04353A", color: "#fff", fontSize: "14px" } }} />
      <Navbar />

      <main className="min-h-screen bg-[var(--page)]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--brand-text)]">
            <Icon className="h-4 w-4"><path d="M19 12H5M11 18l-6-6 6-6" /></Icon>
            Back to all events
          </Link>

          {loading || isPending ? (
            <div className="mt-4 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]">
              <div className="h-80 animate-pulse bg-[var(--line)]" />
              <div className="space-y-4 p-8">
                <div className="h-16 animate-pulse rounded-2xl bg-[var(--line)]" />
                <div className="h-40 animate-pulse rounded-2xl bg-[var(--line)]" />
              </div>
            </div>
          ) : !event ? (
            <div className="mt-4 rounded-3xl border border-[var(--line)] bg-[var(--surface)] px-6 py-24 text-center">
              <p className="text-2xl font-bold text-[var(--ink)]">Event not found</p>
              <p className="mt-2 text-[var(--muted)]">It may have been removed by its organizer.</p>
            </div>
          ) : (
            <article className="mt-4 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-sm">
              {/* ---------- Cover ---------- */}
              <div className="relative">
                <img src={event.thumbnail} alt={event.title} className="h-72 w-full object-cover sm:h-[400px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                <div className="absolute left-5 top-5 flex flex-wrap gap-2 sm:left-8 sm:top-8">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0F6B3A] backdrop-blur">
                    {event.eventType}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold text-white backdrop-blur ${isPast ? "bg-red-500/90" : "bg-[#E07D10]/90"
                      }`}
                  >
                    {isPast ? "Ended" : daysLeftText(event.eventDate)}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                  <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-[44px]">
                    {event.title}
                  </h1>
                  <p className="mt-2 text-sm text-white/80">Hosted by {organizer}</p>
                </div>
              </div>

              {/* ---------- Info strip + actions ---------- */}
              <div className="border-b border-[var(--line)] p-5 sm:p-8">
                <div className="flex flex-col gap-6 rounded-2xl border border-[var(--line)] bg-[var(--page)] p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="grid flex-1 gap-5 sm:grid-cols-3">
                    <StripItem
                      label="Date & time"
                      value={formatDate(event.eventDate)}
                      icon={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>}
                    />
                    <StripItem
                      label="Location"
                      value={event.location}
                      icon={<><path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" /><circle cx="12" cy="11" r="2" /></>}
                    />
                    <StripItem
                      label="Volunteers"
                      value={`${people.length} joined`}
                      icon={<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20c0-2.6-1.6-4.4-4-5.1" /></>}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleShare}
                      aria-label="Copy event link"
                      title="Copy event link"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition hover:border-[var(--brand)] hover:text-[var(--brand-text)]"
                    >
                      <Icon><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" /></Icon>
                    </button>
                    <button
                      onClick={handleJoin}
                      disabled={joined || joining || isPast}
                      className="h-12 flex-1 whitespace-nowrap rounded-xl bg-[var(--brand)] px-7 text-[15px] font-semibold text-white shadow-lg shadow-[#1B8F3F]/20 transition hover:bg-[var(--brand-hover)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none lg:flex-none"
                    >
                      {isPast ? "Event ended" : joined ? "✓ You're in" : joining ? "Joining…" : "Join this event"}
                    </button>
                  </div>
                </div>
                {!user && !isPast && (
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    <Link href="/login" className="font-semibold text-[var(--brand-text)] hover:underline">Log in</Link> to join this event.
                  </p>
                )}
              </div>

              {/* ---------- Body ---------- */}
              <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_320px]">
                {/* Left: about + tips */}
                <div>
                  <h2 className="text-xl font-bold text-[var(--ink)]">About this event</h2>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-[var(--muted)]">{event.description}</p>

                  <div className="mt-8 rounded-2xl border border-dashed border-[var(--line)] p-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                      <Icon className="h-4 w-4 text-[var(--accent)]"><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></Icon>
                      Before you come
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {TIPS.map((tip) => (
                        <li key={tip} className="flex gap-3 text-sm text-[var(--muted)]">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-text)]"><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right: organizer + volunteers */}
                <aside className="space-y-5">
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--page)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Organizer</p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#22A653] to-[#0A6B5A] text-lg font-bold text-white">
                        {organizer.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[var(--ink)]">{organizer}</p>
                        {event.createdBy && <p className="truncate text-xs text-[var(--muted)]">{event.createdBy}</p>}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2.5 border-t border-[var(--line)] pt-4 text-sm">
                      <p className="flex items-center gap-2 text-[var(--muted)]">
                        <Icon className="h-4 w-4 shrink-0 text-[var(--brand-text)]">
                          <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
                          <path d="M9 12l2 2 4-4" />
                        </Icon>
                        Registered DevSphere member
                      </p>
                      {event.createdAt && (
                        <p className="flex items-center gap-2 text-[var(--muted)]">
                          <Icon className="h-4 w-4 shrink-0 text-[var(--brand-text)]">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M16 3v4M8 3v4M3 10h18" />
                          </Icon>
                          Posted on{" "}
                          {new Date(event.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--page)] p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                      Volunteers ({people.length})
                    </p>
                    {people.length === 0 ? (
                      <p className="mt-4 text-sm text-[var(--muted)]">No one has joined yet. Be the first!</p>
                    ) : (
                      <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                        {people.map((p) => (
                          <li key={p.email} className="flex items-center gap-3">
                            {p.image ? (
                              <img src={p.image} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full object-cover" />
                            ) : (
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
                                {(p.name || p.email).charAt(0).toUpperCase()}
                              </span>
                            )}
                            <span className="truncate text-sm font-medium text-[var(--ink)]">{p.name || p.email}</span>
                            {user && p.email === user.email && (
                              <span className="ml-auto rounded-full bg-[#1B8F3F]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--brand-text)]">
                                You
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </aside>
              </div>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}