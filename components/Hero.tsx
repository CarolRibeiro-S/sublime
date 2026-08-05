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

      <div className="absolute inset-x-0 bottom-8 flex justify-center">
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
