"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { EVENT_TYPES } from "@/lib/api";

const toLocalInput = (d) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 16);
};

const MAX_DESC = 600;

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function Field({ id, label, hint, error, icon, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
        {label} <span className="text-[var(--accent)]">*</span>
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-3.5 text-[var(--muted)]">
            <Icon>{icon}</Icon>
          </span>
        )}
        {children}
      </div>
      {error ? (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-[var(--muted)]">{hint}</p>
      )}
    </div>
  );
}

export default function EventForm({ initial, onSubmit, submitText, loading, onValuesChange }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    eventType: initial?.eventType || "",
    thumbnail: initial?.thumbnail || "",
    location: initial?.location || "",
    eventDate: initial?.eventDate ? toLocalInput(initial.eventDate) : "",
  });
  const [errors, setErrors] = useState({});

  // send the values to the page for the preview card
  useEffect(() => {
    if (onValuesChange) onValuesChange(form);
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = (v) => {
    const er = {};
    if (v.title.length < 3) er.title = "Enter an event title (at least 3 characters).";
    if (!v.eventType) er.eventType = "Choose an event type.";
    if (!v.eventDate) er.eventDate = "Choose the event date and time.";
    else if (new Date(v.eventDate).getTime() <= Date.now()) er.eventDate = "The event date must be in the future.";
    if (!v.location) er.location = "Enter the event location.";
    if (!/^https?:\/\/\S+$/i.test(v.thumbnail)) er.thumbnail = "Enter a valid image URL starting with http:// or https://";
    if (v.description.length < 10) er.description = "Describe the event in at least 10 characters.";

    setErrors(er);
    const first = Object.values(er)[0];
    if (first) toast.error(first);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return; // stops a double click from saving twice

    const values = {
      title: form.title.trim(),
      description: form.description.trim(),
      eventType: form.eventType,
      thumbnail: form.thumbnail.trim(),
      location: form.location.trim(),
      eventDate: form.eventDate,
    };
    if (!validate(values)) return;
    onSubmit({ ...values, eventDate: new Date(values.eventDate).toISOString() });
  };

  const box = (name, withIcon = true) =>
    `w-full rounded-xl border bg-[var(--page)] py-3 pr-3.5 text-[15px] text-[var(--ink)] placeholder:text-[var(--muted)] outline-none transition focus:ring-4 ${
      withIcon ? "pl-10" : "pl-3.5"
    } ${
      errors[name]
        ? "border-red-400 focus:border-red-400 focus:ring-red-500/15"
        : "border-[var(--line)] focus:border-[var(--brand)] focus:ring-[#1B8F3F]/15"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Field id="title" label="Event title" error={errors.title} icon={<path d="M4 7V5h16v2M12 5v14M9 19h6" />}>
        <input id="title" name="title" type="text" placeholder="Blanket distribution at Kamalapur station"
          value={form.title} onChange={onChange} className={box("title")} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="eventType" label="Event type" error={errors.eventType}
          icon={<><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>}>
          <select id="eventType" name="eventType" value={form.eventType} onChange={onChange}
            className={`${box("eventType")} appearance-none`}>
            <option value="">Select a type</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field id="eventDate" label="Date & time" hint="Only future dates can be chosen." error={errors.eventDate}
          icon={<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>}>
          <input id="eventDate" name="eventDate" type="datetime-local" min={toLocalInput(new Date())}
            value={form.eventDate} onChange={onChange} className={box("eventDate")} />
        </Field>
      </div>

      <Field id="location" label="Location" error={errors.location}
        icon={<><path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" /><circle cx="12" cy="11" r="2" /></>}>
        <input id="location" name="location" type="text" placeholder="Mirpur 10, Dhaka"
          value={form.location} onChange={onChange} className={box("location")} />
      </Field>

      <Field id="thumbnail" label="Cover image URL" hint="Paste a direct link to a photo (it shows in the preview)." error={errors.thumbnail}
        icon={<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></>}>
        <input id="thumbnail" name="thumbnail" type="url" placeholder="https://images.unsplash.com/..."
          value={form.thumbnail} onChange={onChange} className={box("thumbnail")} />
      </Field>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="description" className="text-sm font-semibold text-[var(--ink)]">
            Description <span className="text-[var(--accent)]">*</span>
          </label>
          <span className={`text-xs ${form.description.length > MAX_DESC ? "text-red-500" : "text-[var(--muted)]"}`}>
            {form.description.length}/{MAX_DESC}
          </span>
        </div>
        <textarea id="description" name="description" rows={5} maxLength={MAX_DESC}
          placeholder="What is the goal, how many volunteers you need, and what people should bring."
          value={form.description} onChange={onChange} className={`${box("description", false)} resize-y`} />
        {errors.description && <p className="mt-1.5 text-sm text-red-500">{errors.description}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-[#1B8F3F]/20 transition hover:bg-[var(--brand-hover)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1B8F3F]/30 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          <Icon><path d="M5 12l5 5L20 7" /></Icon>
        )}
        {loading ? "Please wait…" : submitText}
      </button>
    </form>
  );
}