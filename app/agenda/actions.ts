"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { formatDateBR } from "@/lib/date";

const WHATSAPP_NUMBER = "5561991581775";

type ActionResult =
  | { success: true; whatsappUrl: string }
  | { success: false; error: string };

export async function createBooking(
  formData: FormData
): Promise<ActionResult> {
  const clientName = String(formData.get("clientName") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const eventTime = String(formData.get("eventTime") ?? "").trim();
  const eventType = String(formData.get("eventType") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const guestCount = Number(formData.get("guestCount"));
  const otherDrinks = String(formData.get("otherDrinks") ?? "").trim();
  const serviceType = String(formData.get("serviceType") ?? "").trim();
  const requestType = String(formData.get("requestType") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (
    !clientName ||
    !eventDate ||
    !eventTime ||
    !eventType ||
    !address ||
    !guestCount ||
    (serviceType !== "completo" && serviceType !== "mao_de_obra") ||
    (requestType !== "orcamento" && requestType !== "agendamento")
  ) {
    return { success: false, error: "Preencha todos os campos corretamente." };
  }

  await db.insert(bookings).values({
    clientName,
    eventDate,
    eventTime,
    eventType,
    address,
    guestCount,
    otherDrinks: otherDrinks || null,
    serviceType,
    requestType,
    notes: notes || null,
  });

  const existingConfirmed = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(
      and(eq(bookings.eventDate, eventDate), eq(bookings.status, "confirmado"))
    )
    .limit(1);

  const requestLabel =
    requestType === "orcamento" ? "Orçamento" : "Já agendar o serviço";
  const serviceTypeLabel =
    serviceType === "completo" ? "Serviço completo" : "Somente mão de obra";

  const EMOJI = {
    calendar: "\u{1F4C5}", // calendário
    clock: "\u{1F550}", // relógio
    party: "\u{1F389}", // confete
    pin: "\u{1F4CD}", // localização
    people: "\u{1F465}", // pessoas
    cup: "\u{1F964}", // copo
    tools: "\u{1F6E0}\u{FE0F}", // ferramentas
    speech: "\u{1F4AC}", // balão de fala
    memo: "\u{1F4DD}", // bloco de notas
    warning: "\u{26A0}\u{FE0F}", // alerta
  };

  const message =
    `Olá, Fernando, tudo bem? Sou ${clientName} e vim pelo site da Sublime.\n\n` +
    `${EMOJI.calendar} Data: ${formatDateBR(eventDate)}\n` +
    `${EMOJI.clock} Horário: ${eventTime}\n` +
    `${EMOJI.party} Tipo de evento: ${eventType}\n` +
    `${EMOJI.pin} Endereço: ${address}\n` +
    `${EMOJI.people} Pessoas: ${guestCount}\n` +
    (otherDrinks ? `${EMOJI.cup} Outras bebidas: ${otherDrinks}\n` : "") +
    `${EMOJI.tools} Tipo de serviço: ${serviceTypeLabel}\n` +
    `${EMOJI.speech} Gostaria de: ${requestLabel}\n\n` +
    (notes ? `${EMOJI.memo} Observações: ${notes}\n\n` : "") +
    (existingConfirmed.length > 0
      ? `${EMOJI.warning} Observação: essa data já possui um evento confirmado, verificando se é possível conciliar.\n\n`
      : "") +
    `Fico no aguardo do seu retorno, obrigada!`;

  // TODO: log temporário para investigar corrupção de emojis em produção (Vercel).
  // Não há "runtime = 'edge'" declarado em nenhum arquivo do projeto (app/agenda ou outros),
  // então checamos também em tempo de execução qual runtime está de fato rodando.
  console.log(
    "[DEBUG emoji] runtime em tempo de execucao:",
    "EdgeRuntime" in globalThis ? "edge" : "nodejs",
    "| process.version:",
    typeof process !== "undefined" ? process.version : "N/A (sem objeto process)"
  );
  console.log("[DEBUG emoji] mensagem completa:", message);
  console.log(
    "[DEBUG emoji] code points da mensagem inteira:",
    Array.from(message)
      .map((c) => c.codePointAt(0)!.toString(16))
      .join(" ")
  );
  console.log(
    "[DEBUG emoji] code points esperados vs encontrados em cada emoji:",
    JSON.stringify(
      Object.entries(EMOJI).map(([name, expected]) => {
        const expectedCodePoints = Array.from(expected)
          .map((c) => c.codePointAt(0)!.toString(16))
          .join(" ");
        const foundInMessage = message.includes(expected);
        return { name, expectedCodePoints, foundInMessage };
      })
    )
  );

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  // TODO: log temporário para investigar corrupção de emojis em produção (Vercel).
  console.log("[DEBUG emoji] whatsappUrl final (antes de retornar ao cliente):", whatsappUrl);
  console.log(
    "[DEBUG emoji] whatsappUrl contem '%F0%9F' (inicio correto de emoji UTF-8)?",
    whatsappUrl.includes("%F0%9F")
  );
  console.log(
    "[DEBUG emoji] whatsappUrl contem '%EF%BF%BD' (caractere de erro U+FFFD ja codificado)?",
    whatsappUrl.includes("%EF%BF%BD")
  );

  return { success: true, whatsappUrl };
}
