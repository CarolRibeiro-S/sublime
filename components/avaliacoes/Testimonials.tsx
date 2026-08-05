import { QuoteIcon, StarIcon } from "@/components/icons";

type Testimonial = {
  text: string;
  author: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    text: "Recebi várias mensagens elogiando os drinks. Ainda bem que fiz a escolha certa em fechar com vocês.",
    author: "Cliente Sublime",
  },
  {
    text: "Geeeeente foi sensacional! Todo mundo elogiou, até quem não gosta de destilado confessou que o bar foi um dos melhores contratos da festa. Eu provei todos os drinks do cardápio, todos foram servidos com a mesma sofisticação e o atendimento da equipe foi impecável do início ao fim. Eu já conhecia o serviço de vocês de um outro evento e não me arrependo de ter contratado, super profissionais.",
    author: "Cliente Sublime",
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-sm border border-[var(--color-gold)] bg-[var(--color-bg)] p-8">
      <QuoteIcon className="absolute left-6 top-6 h-14 w-14 text-[var(--color-gold)] opacity-25" />

      <div className="relative mb-6 flex justify-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon key={index} className="h-4 w-4 text-[var(--color-gold)]" />
        ))}
      </div>

      <p className="relative font-[family-name:var(--font-heading)] text-base italic leading-relaxed text-[var(--color-text-secondary)]">
        {testimonial.text}
      </p>

      <p className="relative mt-auto pt-6 text-right text-xs text-[var(--color-text-secondary)]/70">
        {testimonial.author}
      </p>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {TESTIMONIALS.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}
