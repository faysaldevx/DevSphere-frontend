"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { authClient } from "@/lib/auth-client";
import { apiFetch, formatDate, getAllEvents, sortByDate } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventForm from "@/components/EventForm";

export default function ManageEventsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const email = user?.email;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // only logged-in users can open this page
  useEffect(() => {
    if (!isPending && !user) router.replace("/login");
  }, [isPending, user, router]);

  const load = async () => {
    try {
      const all = await getAllEvents();

      // keep only the events this user created
      const mine = all.filter((event) => event.createdBy === email);

      setEvents(sortByDate(mine));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) load();
  }, [email]);

  const handleDelete = async (id) => {
    const r = await Swal.fire({
      title: "Delete this event?",
      text: "People who joined it will lose it from their list too.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete",
    });
    if (!r.isConfirmed) return;

    try {
      await apiFetch(`/events/${id}`, { method: "DELETE" }, true);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success("Event deleted.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdate = async (values) => {
    setSaving(true);
    try {
      await apiFetch(`/events/${editing._id}`, { method: "PATCH", body: JSON.stringify(values) }, true);
      toast.success("Event updated successfully!");
      setEditing(null);
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isPending || !user) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[60vh] items-center justify-center text-slate-500">Loading…</main>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: "#04353A", color: "#fff", fontSize: "14px" } }} />
      <Navbar />

      <main className="bg-[#f7faf8]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#04353A]">Manage events</h1>
          <p className="mt-2 text-slate-600">Update or delete the events you created.</p>

          {loading ? (
            <div className="mt-10 h-48 animate-pulse rounded-2xl bg-slate-200" />
          ) : events.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <p className="text-lg font-semibold text-[#04353A]">No events to show yet</p>
              <Link href="/create-event" className="mt-3 inline-block text-sm font-semibold text-[#1B8F3F] hover:underline">
                Create your first event →
              </Link>
            </div>
          ) : (
            <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[720px] text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-[#04353A]">
                  <tr>
                    <th className="p-4">Event</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={e._id} className="border-t border-slate-100">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={e.thumbnail} alt="" className="h-12 w-16 rounded-md object-cover" />
                          <span className="font-semibold text-[#04353A]">{e.title}</span>
                        </div>
                      </td>
                      <td className="p-4">{e.eventType}</td>
                      <td className="p-4">{e.location}</td>
                      <td className="p-4">{formatDate(e.eventDate)}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditing(e)}
                            className="rounded-lg bg-[#1B8F3F] px-3.5 py-1.5 font-semibold text-white hover:bg-[#157a34]"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(e._id)}
                            className="rounded-lg border border-red-300 px-3.5 py-1.5 font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4">
          <div className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#04353A]">Update event</h2>
              <button
                onClick={() => setEditing(null)}
                aria-label="Close"
                className="text-2xl leading-none text-slate-500 hover:text-slate-800"
              >
                ×
              </button>
            </div>
            <EventForm initial={editing} onSubmit={handleUpdate} submitText="Save changes" loading={saving} />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}