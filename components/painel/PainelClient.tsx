"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "react-day-picker/style.css";
import "@/components/agenda/agenda-calendar.css";
import type { Booking, BookingStatus } from "@/db/schema";
import { formatDateBR } from "@/lib/date";
import { logout, updateBooking, updateBookingStatus } from "@/app/painel/actions";

const REQUEST_TYPE_LABELS: Record<string, string> = {
  orcamento: "Orçamento",
  agendamento: "Agendamento",
};

const SERVICE_TYPE_LABELS: Record<string, string> = {
  completo: "Serviço completo",
  mao_de_obra: "Somente mão de obra",
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  confirmado: { label: "Confirmado", className: "text-[var(--color-gold)]" },
  recusado: {
    label: "Recusado",
    className: "text-[var(--color-text-secondary)]/60 line-through",
  },
  cancelado: { label: "Cancelado", className: "text-red-400" },
};

const MONTH_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

function monthLabel(monthKey: string) {
  const label = MONTH_FORMATTER.format(new Date(`${monthKey}-01T00:00:00`));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function EditForm({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState(booking.eventDate);
  const [eventTime, setEventTime] = useState(booking.eventTime);
  const [guestCount, setGuestCount] = useState(String(booking.guestCount));
  const [address, setAddress] = useState(booking.address);

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await updateBooking(booking.id, {
        eventDate,
        eventTime,
        guestCount: Number(guestCount),
        address,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      router.refresh();
      onClose();
    });
  }

  return (
    <div className="mt-4 flex flex-col gap-3 rounded border border-[var(--color-gold)]/30 bg-[#0d0d0d] p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--color-gold-light)]">Data</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="rounded border border-[var(--color-gold)]/30 bg-transparent px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--color-gold-light)]">Horário</label>
          <input
            type="text"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="rounded border border-[var(--color-gold)]/30 bg-transparent px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--color-gold-light)]">
            Número de pessoas
          </label>
          <input
            type="number"
            min={1}
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="rounded border border-[var(--color-gold)]/30 bg-transparent px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--color-gold-light)]">
            Endereço do evento
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="rounded border border-[var(--color-gold)]/30 bg-transparent px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded bg-[var(--color-gold)] px-4 py-2 text-xs font-medium tracking-wide text-[var(--color-bg)] transition-colors hover:bg-[var(--color-gold-light)] disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="rounded border border-[var(--color-gold)]/40 px-4 py-2 text-xs font-medium tracking-wide text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-gold)] disabled:opacity-50"
        >
          Cancelar edição
        </button>
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  function handleStatusChange(status: BookingStatus) {
    startTransition(async () => {
      await updateBookingStatus(booking.id, status);
      router.refresh();
    });
  }

  const badge = STATUS_BADGES[booking.status];

  return (
    <div className="rounded-lg border border-[var(--color-gold)]/20 bg-white/[0.02] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 text-sm text-[var(--color-text-secondary)]">
          <span className="text-base text-[var(--color-gold-light)]">
            {booking.clientName}
          </span>
          <span>Data: {formatDateBR(booking.eventDate)}</span>
          <span>Horário: {booking.eventTime}</span>
          <span>Tipo de evento: {booking.eventType}</span>
          <span>Endereço: {booking.address}</span>
          <span>Pessoas: {booking.guestCount}</span>
          {booking.otherDrinks && (
            <span>Outras bebidas: {booking.otherDrinks}</span>
          )}
          <span>
            Tipo de serviço:{" "}
            {SERVICE_TYPE_LABELS[booking.serviceType] ?? booking.serviceType}
          </span>
          <span>
            Pedido:{" "}
            {REQUEST_TYPE_LABELS[booking.requestType] ?? booking.requestType}
          </span>
          {booking.notes && <span>Observações: {booking.notes}</span>}
          {badge && (
            <span className={badge.className}>Status: {badge.label}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {booking.status === "pendente" && (
            <>
              <button
                type="button"
                onClick={() => handleStatusChange("confirmado")}
                disabled={isPending}
                className="rounded bg-[var(--color-gold)] px-4 py-2 text-xs font-medium tracking-wide text-[var(--color-bg)] transition-colors hover:bg-[var(--color-gold-light)] disabled:opacity-50"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("recusado")}
                disabled={isPending}
                className="rounded border border-[var(--color-gold)]/40 px-4 py-2 text-xs font-medium tracking-wide text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-gold)] disabled:opacity-50"
              >
                Recusar
              </button>
            </>
          )}
          {booking.status === "confirmado" && (
            <button
              type="button"
              onClick={() => handleStatusChange("cancelado")}
              disabled={isPending}
              className="rounded border border-red-400/50 px-4 py-2 text-xs font-medium tracking-wide text-red-400 transition-colors hover:border-red-400 disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded border border-[var(--color-gold)]/40 px-4 py-2 text-xs font-medium tracking-wide text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-gold)]"
          >
            {isEditing ? "Fechar edição" : "Editar"}
          </button>
        </div>
      </div>

      {isEditing && (
        <EditForm booking={booking} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
}

export default function PainelClient({ bookings }: { bookings: Booking[] }) {
  const [showHistory, setShowHistory] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoggingOut, startLogoutTransition] = useTransition();

  const pending = useMemo(
    () => bookings.filter((b) => b.status === "pendente"),
    [bookings]
  );
  const history = useMemo(
    () => bookings.filter((b) => b.status !== "pendente"),
    [bookings]
  );

  const confirmedSet = useMemo(
    () =>
      new Set(
        bookings.filter((b) => b.status === "confirmado").map((b) => b.eventDate)
      ),
    [bookings]
  );

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();
    return history.filter((b) => {
      if (query && !b.clientName.toLowerCase().includes(query)) return false;
      if (dateFrom && b.eventDate < dateFrom) return false;
      if (dateTo && b.eventDate > dateTo) return false;
      return true;
    });
  }, [history, search, dateFrom, dateTo]);

  const groupedHistory = useMemo(() => {
    const groups = new Map<string, Booking[]>();
    for (const booking of filteredHistory) {
      const key = booking.eventDate.slice(0, 7);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(booking);
    }
    return [...groups.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, items]) => {
        const confirmed = items.filter((b) => b.status === "confirmado");
        return {
          key,
          label: monthLabel(key),
          items: [...items].sort((a, b) => a.eventDate.localeCompare(b.eventDate)),
          confirmedCount: confirmed.length,
          confirmedGuests: confirmed.reduce((sum, b) => sum + b.guestCount, 0),
        };
      });
  }, [filteredHistory]);

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
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl text-[var(--color-gold)]">
          Disponibilidade
        </h2>
        <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
          Datas em dourado já estão confirmadas.
        </p>
        <div className="flex justify-center overflow-x-auto">
          <DayPicker
            locale={ptBR}
            numberOfMonths={2}
            defaultMonth={new Date()}
            modifiers={{
              confirmed: (date) =>
                confirmedSet.has(
                  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                ),
            }}
            modifiersClassNames={{ confirmed: "rdp-day_confirmed" }}
            className="sublime-daypicker"
          />
        </div>
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
          <div className="mt-4 flex flex-col gap-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs text-[var(--color-gold-light)]">
                  Buscar por nome
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nome do cliente"
                  className="rounded border border-[var(--color-gold)]/30 bg-transparent px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-secondary)]/40 focus:border-[var(--color-gold)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-gold-light)]">De</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="rounded border border-[var(--color-gold)]/30 bg-transparent px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[var(--color-gold-light)]">Até</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="rounded border border-[var(--color-gold)]/30 bg-transparent px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
                />
              </div>
              {(search || dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-gold-light)]"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {groupedHistory.length === 0 && (
              <p className="text-sm text-[var(--color-text-secondary)]">
                Nenhum booking encontrado para os filtros aplicados.
              </p>
            )}

            {groupedHistory.map((group) => (
              <div key={group.key} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 border-b border-[var(--color-gold)]/20 pb-2">
                  <h3 className="text-lg text-[var(--color-gold-light)]">
                    {group.label}
                  </h3>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {group.confirmedCount} evento(s) confirmado(s) ·{" "}
                    {group.confirmedGuests} convidado(s) no total
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {group.items.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
