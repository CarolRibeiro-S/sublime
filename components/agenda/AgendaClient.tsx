"use client";

import { useMemo, useState, useTransition } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import { format, isBefore, startOfDay } from "date-fns";
import "react-day-picker/style.css";
import "./agenda-calendar.css";
import { createBooking } from "@/app/agenda/actions";

const EVENT_TYPES = ["Casamento", "Aniversário", "Corporativo", "Outro"];

export default function AgendaClient({
  confirmedDates,
}: {
  confirmedDates: string[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [requestType, setRequestType] = useState<"orcamento" | "agendamento">(
    "orcamento"
  );
  const [serviceType, setServiceType] = useState<"completo" | "mao_de_obra">(
    "completo"
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [debugUrl, setDebugUrl] = useState<string | null>(null);

  const confirmedSet = useMemo(() => new Set(confirmedDates), [confirmedDates]);
  const today = useMemo(() => startOfDay(new Date()), []);
  const dateValue = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  function isPastDate(date: Date) {
    return isBefore(date, today);
  }

  function hasConfirmedBooking(date: Date) {
    return confirmedSet.has(format(date, "yyyy-MM-dd"));
  }

  const selectedDateIsConfirmed = selectedDate
    ? hasConfirmedBooking(selectedDate)
    : false;

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createBooking(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }

      // TODO: debug temporário para investigar corrupção de emojis no WhatsApp.
      // Mostra a URL recebida do servidor no console e na tela por 3s antes de redirecionar,
      // para comparar com o log "[DEBUG emoji] whatsappUrl final" do servidor (Vercel).
      console.log("[DEBUG emoji] whatsappUrl recebida no cliente:", result.whatsappUrl);
      setDebugUrl(result.whatsappUrl);
      setTimeout(() => {
        window.location.href = result.whatsappUrl;
      }, 3000);
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      {debugUrl && (
        <div className="fixed inset-x-4 top-24 z-[100] max-h-[60vh] overflow-y-auto break-all rounded-lg border border-[var(--color-gold)] bg-[var(--color-bg)] p-4 text-xs text-[var(--color-gold-light)] shadow-lg">
          <p className="mb-2 font-medium text-[var(--color-gold)]">
            [DEBUG] URL que será usada no redirecionamento (some em 3s):
          </p>
          <p>{debugUrl}</p>
        </div>
      )}

      <h1 className="mb-2 text-center text-3xl">Agenda</h1>
      <p className="mb-10 text-center text-sm font-light text-[var(--color-text-secondary)]">
        Escolha uma data disponível no calendário e preencha o formulário
        abaixo.
      </p>

      <div className="flex justify-center">
        <DayPicker
          mode="single"
          locale={ptBR}
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={isPastDate}
          modifiers={{
            unavailable: isPastDate,
            hasEvent: hasConfirmedBooking,
          }}
          modifiersClassNames={{
            unavailable: "rdp-day_unavailable",
            hasEvent: "rdp-day_has-event",
          }}
          className="sublime-daypicker"
        />
      </div>

      {selectedDateIsConfirmed && (
        <p className="mx-auto mt-6 max-w-xl text-center text-sm text-[var(--color-gold-light)]">
          Essa data já tem um evento confirmado. Você ainda pode enviar seu
          pedido, o Fernando verifica a possibilidade de conciliar dois
          eventos no mesmo dia dependendo do horário e do porte de cada um.
        </p>
      )}

      <form
        action={handleSubmit}
        className="mt-12 flex flex-col gap-5 rounded-lg border border-[var(--color-gold)]/20 bg-white/[0.02] p-8"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="clientName" className="text-sm text-[var(--color-gold-light)]">
            Nome
          </label>
          <input
            id="clientName"
            name="clientName"
            type="text"
            required
            className="rounded border border-[var(--color-gold)]/30 bg-transparent px-4 py-2 text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="eventDate" className="text-sm text-[var(--color-gold-light)]">
            Data
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            value={dateValue}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedDate(val ? new Date(`${val}T00:00:00`) : undefined);
            }}
            className="rounded border border-[var(--color-gold)]/30 bg-transparent px-4 py-2 text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="eventTime" className="text-sm text-[var(--color-gold-light)]">
            Horário
          </label>
          <input
            id="eventTime"
            name="eventTime"
            type="text"
            required
            placeholder="Ex: a partir das 19h ou combinar com o Fernando"
            className="rounded border border-[var(--color-gold)]/30 bg-transparent px-4 py-2 text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-secondary)]/40 focus:border-[var(--color-gold)]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="eventType" className="text-sm text-[var(--color-gold-light)]">
            Tipo de evento
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            defaultValue=""
            className="rounded border border-[var(--color-gold)]/30 bg-[var(--color-bg)] px-4 py-2 text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
          >
            <option value="" disabled>
              Selecione
            </option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="address" className="text-sm text-[var(--color-gold-light)]">
            Endereço do evento
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            className="rounded border border-[var(--color-gold)]/30 bg-transparent px-4 py-2 text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="guestCount" className="text-sm text-[var(--color-gold-light)]">
            Número de pessoas
          </label>
          <input
            id="guestCount"
            name="guestCount"
            type="number"
            min={1}
            required
            className="rounded border border-[var(--color-gold)]/30 bg-transparent px-4 py-2 text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-gold)]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="otherDrinks" className="text-sm text-[var(--color-gold-light)]">
            Outras bebidas além dos drinks
          </label>
          <input
            id="otherDrinks"
            name="otherDrinks"
            type="text"
            placeholder="Ex: refrigerante, água, cerveja, ou deixe em branco se não precisar"
            className="rounded border border-[var(--color-gold)]/30 bg-transparent px-4 py-2 text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-secondary)]/40 focus:border-[var(--color-gold)]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm text-[var(--color-gold-light)]">
            Tipo de serviço
          </span>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <input
                type="radio"
                name="serviceType"
                value="completo"
                checked={serviceType === "completo"}
                onChange={() => setServiceType("completo")}
                className="accent-[var(--color-gold)]"
              />
              Serviço completo
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <input
                type="radio"
                name="serviceType"
                value="mao_de_obra"
                checked={serviceType === "mao_de_obra"}
                onChange={() => setServiceType("mao_de_obra")}
                className="accent-[var(--color-gold)]"
              />
              Somente mão de obra
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm text-[var(--color-gold-light)]">
            Eu gostaria de
          </span>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <input
                type="radio"
                name="requestType"
                value="orcamento"
                checked={requestType === "orcamento"}
                onChange={() => setRequestType("orcamento")}
                className="accent-[var(--color-gold)]"
              />
              Um orçamento
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <input
                type="radio"
                name="requestType"
                value="agendamento"
                checked={requestType === "agendamento"}
                onChange={() => setRequestType("agendamento")}
                className="accent-[var(--color-gold)]"
              />
              Já agendar o serviço
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="notes" className="text-sm text-[var(--color-gold-light)]">
            Observações
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="Tem algo que a gente precisa saber? Conte aqui."
            className="rounded border border-[var(--color-gold)]/30 bg-transparent px-4 py-2 text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-secondary)]/40 focus:border-[var(--color-gold)]"
          />
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 rounded bg-[var(--color-gold)] px-6 py-3 text-sm font-medium tracking-wide text-[var(--color-bg)] transition-colors hover:bg-[var(--color-gold-light)] disabled:opacity-50"
        >
          {isPending ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
