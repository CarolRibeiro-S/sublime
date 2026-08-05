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

  const message =
    `Olá, Fernando, tudo bem? Sou ${clientName} e vim pelo site da Sublime.\n\n` +
    `📅 Data: ${formatDateBR(eventDate)}\n` +
    `🕐 Horário: ${eventTime}\n` +
    `🎉 Tipo de evento: ${eventType}\n` +
    `📍 Endereço: ${address}\n` +
    `👥 Pessoas: ${guestCount}\n` +
    (otherDrinks ? `🥤 Outras bebidas: ${otherDrinks}\n` : "") +
    `🛠️ Tipo de serviço: ${serviceTypeLabel}\n` +
    `💬 Gostaria de: ${requestLabel}\n\n` +
    (notes ? `📝 Observações: ${notes}\n\n` : "") +
    (existingConfirmed.length > 0
      ? `⚠️ Observação: essa data já possui um evento confirmado, verificando se é possível conciliar.\n\n`
      : "") +
    `Fico no aguardo do seu retorno, obrigada!`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return { success: true, whatsappUrl };
}
