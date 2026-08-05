"use client";

import { useState, useTransition } from "react";
import { login } from "@/app/painel/actions";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      window.location.reload();
    });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6">
      <h1 className="mb-8 text-2xl">Painel</h1>
      <form action={handleSubmit} className="flex w-full flex-col gap-4">
        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="Senha"
          className="rounded border border-[var(--color-gold)]/30 bg-transparent px-4 py-2 text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
        />

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-[var(--color-gold)] px-6 py-3 text-sm font-medium tracking-wide text-[var(--color-bg)] transition-colors hover:bg-[var(--color-gold-light)] disabled:opacity-50"
        >
          {isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
