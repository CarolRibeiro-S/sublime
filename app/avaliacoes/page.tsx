import Testimonials from "@/components/avaliacoes/Testimonials";

export default function AvaliacoesPage() {
  return (
    <div className="pt-32">
      <h1 className="text-center text-3xl">Avaliações</h1>
      <p className="mx-auto mt-2 max-w-xl px-6 text-center text-sm font-light text-[var(--color-text-secondary)]">
        O que nossos clientes dizem sobre a experiência com a Sublime.
      </p>
      <Testimonials />
    </div>
  );
}
