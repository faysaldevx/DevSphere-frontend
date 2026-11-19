"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getAllEvents, hasJoined, sortByDate } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";

export default function JoinedEventsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const email = user?.email;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // only logged-in users can open this page
  useEffect(() => {
    if (!isPending && !user) router.replace("/login");
  }, [isPending, user, router]);

  useEffect(() => {
    if (!email) return;

    getAllEvents()
      .then((all) => {
        // keep only the events this user joined, nearest date first
        const joined = all.filter((event) => hasJoined(event, email));
        setEvents(sortByDate(joined));
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [email]);

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
          <h1 className="text-3xl font-bold tracking-tight text-[#04353A]">Joined events</h1>
          <p className="mt-2 text-slate-600">Events you have joined, sorted by date.</p>

          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[380px] animate-pulse rounded-2xl bg-slate-200" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <p className="text-lg font-semibold text-[#04353A]">You haven&apos;t joined any events yet</p>
              <Link href="/events" className="mt-3 inline-block text-sm font-semibold text-[#1B8F3F] hover:underline">
                Browse upcoming events →
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
      </main>

      <Footer />
    </>
  );
}