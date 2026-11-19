"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiFetch, formatDate } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventForm from "@/components/EventForm";


function PreviewCard({ values, user }) {
  const hasImage = /^https?:\/\/\S+$/i.test(values.thumbnail || "");
  const date = values.eventDate ? formatDate(values.eventDate) : "Event date";

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-sm">
      <div className="relative h-44 bg-gradient-to-br from-[var(--soft)] to-[var(--page)]">
        {hasImage ? (
          <img src={values.thumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">Cover image preview</div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0F6B3A]">
          {values.eventType || "Event type"}
        </span>
      </div>
      <div className="space-y-1.5 p-5">
        <p className="line-clamp-2 text-lg font-bold text-[var(--ink)]">{values.title || "Your event title"}</p>
        <p className="text-sm text-[var(--muted)]">📍 {values.location || "Location"}</p>
        <p className="text-sm text-[var(--muted)]">🗓 {date}</p>
        <p className="border-t border-[var(--line)] pt-3 text-xs text-[var(--muted)]">
          Organized by <span className="font-semibold text-[var(--ink)]">{user?.name}</span>
        </p>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState({});

  const [formKey, setFormKey] = useState(0);

  // only logged-in users can open this page
  useEffect(() => {
    if (!isPending && !user) router.replace("/login");
  }, [isPending, user, router]);


  const resetForm = () => {
    setLoading(false);
    setPreview({});
    setFormKey((k) => k + 1);
  };

  const handleCreate = async (values) => {
    setLoading(true);
    try {

      const newEvent = {
        ...values,
        createdBy: user.email,
        creatorName: user.name,
        createdAt: new Date().toISOString(),
        joinedUsers: [],
      };

      await apiFetch("/event", { method: "POST", body: JSON.stringify(newEvent) }, true);

      toast.success("Event created successfully!");
      resetForm(); 
      router.push("/events");
    } catch (err) {
      toast.error(err.message);
      setLoading(false); 
    }
  };

  if (isPending || !user) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center bg-[var(--page)] text-[var(--muted)]">Loading…</main>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: "#04353A", color: "#fff", fontSize: "14px" } }} />
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-[var(--soft)] via-[var(--page)] to-[var(--page)]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <Link href="/events" className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--brand-text)]">
            ← Back to events
          </Link>

          <div className="mt-6 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">New event</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">Start a community drive</h1>
            <p className="mt-3 text-[var(--muted)]">
              Fill in the details below. The preview shows exactly how people will see your event.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* Form */}
            <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm sm:p-8">
              <EventForm
                key={formKey}
                onSubmit={handleCreate}
                submitText="Publish event"
                loading={loading}
                onValuesChange={setPreview}
              />
            </section>

            {/* Preview + organizer */}
            <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Live preview</p>
              <PreviewCard values={preview} user={user} />

              <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
                {user.image ? (
                  <img src={user.image} alt="" referrerPolicy="no-referrer" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand)] font-bold text-white">
                    {(user.name || "?").charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-xs text-[var(--muted)]">Publishing as</p>
                  <p className="truncate text-sm font-semibold text-[var(--ink)]">{user.email}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}