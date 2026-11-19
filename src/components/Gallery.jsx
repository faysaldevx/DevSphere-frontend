
const PHOTOS = [
  {
    src: "https://unsplash.com/photos/kylBMLIliWM/download?force=true&w=1000",
    title: "Park cleanup",
    place: "Volunteers clearing a city park",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://unsplash.com/photos/_WOHOgkLw2M/download?force=true&w=700",
    title: "Forest drive",
    place: "Collecting waste from the woods",
    span: "",
  },
  {
    src: "https://unsplash.com/photos/0tPD48uD9Fk/download?force=true&w=700",
    title: "Street pickup",
    place: "One bag at a time",
    span: "",
  },
  {
    src: "https://unsplash.com/photos/9tA7YYd9XuA/download?force=true&w=700",
    title: "Team check-in",
    place: "Organizers tracking the day's work",
    span: "",
  },
  {
    src: "https://unsplash.com/photos/NgmEMrYHsAM/download?force=true&w=700",
    title: "Beach cleanup",
    place: "What one morning of work collected",
    span: "",
  },
  {
    src: "https://unsplash.com/photos/K0E6E0a0R3A/download?force=true&w=1000",
    title: "Donation drive",
    place: "Small gifts that make a change",
    span: "md:col-span-2",
  },
];
export default function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-20 bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Moments from the field</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
              What community work looks like
            </h2>
          </div>
          <p className="max-w-sm text-[var(--muted)]">
            Real people giving their time. These are the moments DevSphere helps bring together.
          </p>
        </div>
        <div className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {PHOTOS.map((p) => (
            <figure
              key={p.title}
              className={`group relative overflow-hidden rounded-2xl bg-[var(--line)] ${p.span}`}
            >
              <img
                src={p.src}
                alt={p.place}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 transition group-hover:opacity-100" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-lg font-semibold text-white">{p.title}</p>
                <p className="mt-0.5 translate-y-1 text-sm text-white/80 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {p.place}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}