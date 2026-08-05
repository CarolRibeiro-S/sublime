import Image from "next/image";

const TIMELINE_ITEMS = [
  {
    year: "1862",
    image: "/images/timeline/1862.jpeg",
    alt: "Ilustração de um bar do século XIX, época do nascimento da coquetelaria",
    text: "Jerry Thomas publica o primeiro livro de receitas de coquetéis e cria as bases da técnica que existe até hoje.",
  },
  {
    year: "Anos 1920",
    image: "/images/timeline/1920.png",
    alt: "Ambiente de bar clandestino da década de 1920",
    text: "Durante a Lei Seca nos Estados Unidos, nascem os speakeasies, bares secretos onde a criatividade dos bartenders floresce.",
  },
  {
    year: "Hoje",
    image: "/images/timeline/socios-sublime.jpg",
    alt: "Fernando e Van, sócios da Sublime Coquetelaria",
    text: "Essa tradição chega até Fernando e Van, que transformam técnica e paixão em experiências únicas para cada evento.",
  },
];

function TimelinePhoto({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative aspect-square w-24 overflow-hidden rounded-full border border-[var(--color-gold)]">
      <Image src={image} alt={alt} fill sizes="96px" className="object-cover" />
    </div>
  );
}

function TimelineDot() {
  return (
    <span
      aria-hidden
      className="h-2 w-2 shrink-0 rotate-45 bg-[var(--color-gold)]"
    />
  );
}

function TimelineConnector() {
  return (
    <svg
      aria-hidden
      width="24"
      height="28"
      viewBox="0 0 24 28"
      fill="none"
      className="text-[var(--color-gold)]"
    >
      <path
        d="M12 0C19 7 5 14 12 21C15 23.5 12 25 12 28"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function TimelineHistoria() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="mb-2 text-center text-3xl">Uma Arte com História</h2>
      <p className="mb-14 text-center text-sm font-light text-[var(--color-text-secondary)]">
        Conheça alguns marcos que moldaram a coquetelaria até chegar à Sublime.
      </p>

      {/* Desktop: linha horizontal com blocos em zigue-zague acima/abaixo */}
      <div className="hidden md:grid md:grid-cols-3 md:items-start">
        {TIMELINE_ITEMS.map((item, index) => {
          const isAbove = index % 2 === 0;
          return (
            <div key={`${item.year}-top`} className="flex flex-col items-center px-4">
              {isAbove && (
                <>
                  <TimelinePhoto image={item.image} alt={item.alt} />
                  <span className="mt-4 font-[family-name:var(--font-heading)] text-xl text-[var(--color-gold)]">
                    {item.year}
                  </span>
                  <p className="mt-4 text-center text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {item.text}
                  </p>
                  <TimelineConnector />
                </>
              )}
            </div>
          );
        })}

        <div className="relative col-span-3">
          <span
            aria-hidden
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[linear-gradient(to_right,transparent,var(--color-gold)_15%,var(--color-gold)_85%,transparent)]"
          />
          <div className="relative grid grid-cols-3">
            {TIMELINE_ITEMS.map((item) => (
              <div key={`${item.year}-dot`} className="flex justify-center">
                <TimelineDot />
              </div>
            ))}
          </div>
        </div>

        {TIMELINE_ITEMS.map((item, index) => {
          const isAbove = index % 2 === 0;
          return (
            <div key={`${item.year}-bottom`} className="flex flex-col items-center px-4">
              {!isAbove && (
                <>
                  <TimelineConnector />
                  <TimelinePhoto image={item.image} alt={item.alt} />
                  <span className="mt-4 font-[family-name:var(--font-heading)] text-xl text-[var(--color-gold)]">
                    {item.year}
                  </span>
                  <p className="mt-4 text-center text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {item.text}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: coluna única empilhada, com um conector curvo entre os blocos */}
      <div className="flex flex-col items-center md:hidden">
        {TIMELINE_ITEMS.map((item, index) => (
          <div key={item.year} className="flex flex-col items-center">
            {index > 0 && (
              <div className="flex flex-col items-center">
                <TimelineConnector />
                <TimelineDot />
              </div>
            )}
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <TimelinePhoto image={item.image} alt={item.alt} />
              <span className="font-[family-name:var(--font-heading)] text-xl text-[var(--color-gold)]">
                {item.year}
              </span>
              <p className="max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
