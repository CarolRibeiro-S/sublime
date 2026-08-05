import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[var(--color-bg)]">
      <video
        className="h-full w-full object-cover"
        src="/videos/hero-sublime.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div
        className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-5 px-6 sm:bottom-10 sm:gap-6"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <Link
          href="/agenda"
          className="inline-flex min-h-11 items-center justify-center rounded-sm border border-[var(--color-gold)] bg-transparent px-6 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-gold)] transition-colors duration-300 hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)] sm:px-9 sm:py-3 sm:text-xs"
        >
          Agende seu Evento
        </Link>

        <svg
          className="h-6 w-6 animate-bounce text-[var(--color-gold)] opacity-70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
          aria-hidden="true"
        >
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
