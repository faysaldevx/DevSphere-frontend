import Link from "next/link";

function dateParts(d) {
  const date = new Date(d);
  return {
    day: date.toLocaleString("en-US", { day: "2-digit" }),
    month: date.toLocaleString("en-US", { month: "short" }),
    time: date.toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" }),
  };
}

// Name of the person who created the event
function organizerName(event) {
  if (event.creatorName) return event.creatorName;
  if (event.createdBy) return event.createdBy.split("@")[0];
  return "DevSphere member";
}

export default function EventCard({ event }) {
  const { day, month, time } = dateParts(event.eventDate);
  const organizer = organizerName(event);
  const joined = event.joinedUsers?.length || 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-xl">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.thumbnail}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Event type */}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0F6B3A] shadow-sm backdrop-blur">
          {event.eventType}
        </span>

        {/* Date badge */}
        <div className="absolute right-4 top-4 flex w-14 flex-col items-center rounded-xl bg-white/95 py-1.5 shadow-sm">
          <span className="text-lg font-extrabold leading-none text-[#0F2A2E]">{day}</span>
          <span className="mt-0.5 text-[11px] font-semibold uppercase text-[#E07D10]">{month}</span>
        </div>

        {/* Joined count */}
        <span className="absolute bottom-3 left-4 text-xs font-medium text-white">
          {joined} {joined === 1 ? "volunteer" : "volunteers"} joined
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[var(--ink)]">{event.title}</h3>

        <div className="mt-3 space-y-1.5 text-sm text-[var(--muted)]">
          <p className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--brand-text)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" />
              <circle cx="12" cy="11" r="2" />
            </svg>
            <span className="line-clamp-1">{event.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--brand-text)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {time}
          </p>
        </div>

        {/* Organizer + button */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4 mt-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
              {organizer.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 leading-tight">
              <p className="text-[11px] text-[var(--muted)]">Organized by</p>
              <p className="truncate text-sm font-semibold text-[var(--ink)]">{organizer}</p>
            </div>
          </div>

          <Link
            href={`/events/${event._id}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-hover)]"
          >
            View Event
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}