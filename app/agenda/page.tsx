import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import AgendaClient from "@/components/agenda/AgendaClient";

export default async function AgendaPage() {
  const confirmed = await db
    .select({ eventDate: bookings.eventDate })
    .from(bookings)
    .where(eq(bookings.status, "confirmado"));

  const confirmedDates = confirmed.map((row) => row.eventDate);

  return <AgendaClient confirmedDates={confirmedDates} />;
}
