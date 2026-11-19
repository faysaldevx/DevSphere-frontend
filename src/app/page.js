import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UpcomingEvents from "@/components/UpcomingEvents";
import Gallery from "@/components/Gallery";
import Newsletter from "@/components/Newsletter";

export const metadata = {
  title: "DevSphere | Connecting People, Inspiring Progress",
  description:
    "Find social development events near you, join volunteers, and see real change happen together.",
};

export default function HomePage() {
  return (
    <div className="bg-[var(--page)] text-[var(--ink)]">
      <Navbar />

      <main>
        <Hero />

        <Features />

        {/* Upcoming events from the database */}
        <UpcomingEvents />

        <Gallery />

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}