import Image from "next/image";

const TIMELINE_ITEMS = [
  {
    year: "1862",
    image: "/images/timeline/1862.jpeg",
    alt: "Ilustração de um bar do século XIX, época do nascimento da coquetelaria",
    text: "O nascimento da coquetelaria. Jerry Thomas publica o primeiro livro de receitas de coquetéis e começa a popularizar a coqueteleira de metal, criando as bases da técnica que existe até hoje.",
  },
  {
    year: "Anos 1920",
    image: "/images/timeline/1920.png",
    alt: "Ambiente de bar clandestino da década de 1920",
    text: "A era dos bares clandestinos. Durante a Lei Seca nos Estados Unidos, a proibição não freia a coquetelaria. Nascem os speakeasies, bares secretos onde bartenders criativos driblam as restrições e a mixologia ganha ainda mais criatividade.",
  },
  {
    year: "Hoje",
    image: "/images/timeline/socios-sublime.jpg",
    alt: "Fernando e Van, sócios da Sublime Coquetelaria",
    text: "A Sublime. Décadas depois, essa tradição chega até Fernando e Van, que transformam técnica e paixão em experiências únicas para cada evento.",
  },
];

export default function TimelineHistoria() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-20">
      <span
        aria-hidden
        className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-[var(--color-gold)] md:block"
      />

      <div className="flex flex-col gap-16 md:gap-24">
        {TIMELINE_ITEMS.map((item, index) => {
          const isRight = index % 2 === 1;

          return (
            <div key={item.year} className="relative md:grid md:grid-cols-2 md:gap-12">
              <span
                aria-hidden
                className="absolute left-1/2 top-8 hidden h-3 w-3 -translate-x-1/2 rounded-full border border-[var(--color-gold)] bg-[var(--color-bg)] md:block"
              />

              <div
                className={
                  isRight
                    ? "flex flex-col items-center gap-4 text-center md:col-start-2 md:items-start md:text-left"
                    : "flex flex-col items-center gap-4 text-center md:col-start-1 md:items-end md:text-right"
                }
              >
                <div className="relative aspect-square w-28 overflow-hidden rounded-sm border border-[var(--color-gold)]">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>

                <span className="font-[family-name:var(--font-heading)] text-xl text-[var(--color-gold)]">
                  {item.year}
                </span>

                <p className="max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
