import Image from "next/image";

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <h1 className="mb-10 text-center text-3xl">Nossa História</h1>

      <div className="flex flex-col gap-6 text-base leading-relaxed text-[var(--color-text-secondary)]">
        <p>
          Nossa trajetória na coquetelaria começou há mais de 10 anos, movida
          pela paixão em transformar bons drinks em experiências
          inesquecíveis. Ao longo desse caminho, eu, Fernando, e meu sócio,
          Van, acumulamos experiência em eventos de todos os portes, sempre
          buscando aperfeiçoar nossas técnicas, atendimento e apresentação.
        </p>
        <p>
          Com o tempo, percebemos que compartilhávamos os mesmos valores:
          profissionalismo, dedicação e o compromisso de superar as
          expectativas de cada cliente. Foi dessa parceria que nasceu a
          Sublime Coquetelaria, unindo nossa experiência para oferecer um
          serviço elegante, personalizado e de alto padrão.
        </p>
        <p>
          Hoje, temos a satisfação de fazer parte de momentos especiais,
          levando muito mais do que drinks: criamos experiências que tornam
          cada celebração única.
        </p>
      </div>

      <div className="relative mt-20 aspect-[16/10] w-full overflow-hidden rounded-sm border border-[var(--color-gold)]">
        <Image
          src="/images/socios-sublime-pb.jpg"
          alt="Fernando e Van, sócios da Sublime Coquetelaria"
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover object-top"
        />
      </div>
      <p className="mt-4 text-center text-sm italic text-[var(--color-text-secondary)]">
        Fernando e Van, sócios da Sublime Coquetelaria
      </p>
    </div>
  );
}
