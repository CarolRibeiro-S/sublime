import { desc } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "@/components/painel/LoginForm";
import PainelClient from "@/components/painel/PainelClient";

export default async function PainelPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    return <LoginForm />;
  }

  const allBookings = await db
    .select()
    .from(bookings)
    .orderBy(desc(bookings.createdAt));

  return <PainelClient bookings={allBookings} />;
}
