"use server";

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
  const guestCount = Number(formData.get("guestCount"));
  const requestType = String(formData.get("requestType") ?? "").trim();

  if (
    !clientName ||
    !eventDate ||
    !eventTime ||
    !eventType ||
    !guestCount ||
    (requestType !== "orcamento" && requestType !== "agendamento")
  ) {
    return { success: false, error: "Preencha todos os campos corretamente." };
  }

  await db.insert(bookings).values({
    clientName,
    eventDate,
    eventTime,
    eventType,
    guestCount,
    requestType,
  });

  const requestLabel =
    requestType === "orcamento" ? "Orçamento" : "Já agendar o serviço";

  const message =
    `Olá, Fernando, tudo bem? Sou ${clientName} e vim pelo site da Sublime.\n\n` +
    `📅 Data: ${formatDateBR(eventDate)}\n` +
    `🕐 Horário: ${eventTime}\n` +
    `🎉 Tipo de evento: ${eventType}\n` +
    `👥 Pessoas: ${guestCount}\n` +
    `💬 Gostaria de: ${requestLabel}`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return { success: true, whatsappUrl };
}
