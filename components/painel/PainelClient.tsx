"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Booking } from "@/db/schema";
import { formatDateBR } from "@/lib/date";
import { logout, updateBookingStatus } from "@/app/painel/actions";

const REQUEST_TYPE_LABELS: Record<string, string> = {
  orcamento: "Orçamento",
  agendamento: "Agendamento",
};

const STATUS_LABELS: Record<string, string> = {
  confirmado: "Confirmado",
  recusado: "Recusado",
};

function BookingCard({
  booking,
  showActions,
}: {
  booking: Booking;
  showActions: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleAction(status: "confirmado" | "recusado") {
    startTransition(async () => {
      await updateBookingStatus(booking.id, status);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-gold)]/20 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1 text-sm text-[var(--color-text-secondary)]">
        <span className="text-base text-[var(--color-gold-light)]">
          {booking.clientName}
        </span>
        <span>Data: {formatDateBR(booking.eventDate)}</span>
        <span>Horário: {booking.eventTime}</span>
        <span>Tipo de evento: {booking.eventType}</span>
        <span>Pessoas: {booking.guestCount}</span>
        <span>
          Pedido: {REQUEST_TYPE_LABELS[booking.requestType] ?? booking.requestType}
        </span>
        {!showActions && (
          <span>Status: {STATUS_LABELS[booking.status] ?? booking.status}</span>
        )}
      </div>

      {showActions && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleAction("confirmado")}
            disabled={isPending}
            className="rounded bg-[var(--color-gold)] px-4 py-2 text-xs font-medium tracking-wide text-[var(--color-bg)] transition-colors hover:bg-[var(--color-gold-light)] disabled:opacity-50"
          >
            Confirmar
          </button>
          <button
            type="button"
            onClick={() => handleAction("recusado")}
            disabled={isPending}
            className="rounded border border-[var(--color-gold)]/40 px-4 py-2 text-xs font-medium tracking-wide text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-gold)] disabled:opacity-50"
          >
            Recusar
          </button>
        </div>
      )}
    </div>
  );
}

export default function PainelClient({
  pending,
  history,
}: {
  pending: Booking[];
  history: Booking[];
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [isLoggingOut, startLogoutTransition] = useTransition();

  function handleLogout() {
    startLogoutTransition(async () => {
      await logout();
      window.location.reload();
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl">Painel</h1>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-gold-light)] disabled:opacity-50"
        >
          Sair
        </button>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl text-[var(--color-gold)]">Pedidos pendentes</h2>
        {pending.length === 0 && (
          <p className="text-sm text-[var(--color-text-secondary)]">
            Nenhum pedido pendente no momento.
          </p>
        )}
        {pending.map((booking) => (
          <BookingCard key={booking.id} booking={booking} showActions />
        ))}
      </section>

      <section className="mt-12">
        <button
          type="button"
          onClick={() => setShowHistory((prev) => !prev)}
          className="text-sm text-[var(--color-gold-light)] transition-colors hover:text-[var(--color-gold)]"
        >
          {showHistory ? "Ocultar histórico" : "Ver histórico"}
        </button>

        {showHistory && (
          <div className="mt-4 flex flex-col gap-4">
            {history.length === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)]">
                Ainda não há bookings confirmados ou recusados.
              </p>
            )}
            {history.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                showActions={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
