"use server";

import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, type BookingStatus } from "@/db/schema";
import { SESSION_COOKIE, getSessionToken, isAuthenticated } from "@/lib/auth";

type LoginResult = { success: true } | { success: false; error: string };

export async function login(formData: FormData): Promise<LoginResult> {
  const password = String(formData.get("password") ?? "");

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { success: false, error: "Senha incorreta." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, getSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: SESSION_COOKIE, path: "/" });
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  if (!(await isAuthenticated())) {
    throw new Error("Não autorizado.");
  }

  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
}

type UpdateBookingResult =
  | { success: true }
  | { success: false; error: string };

export async function updateBooking(
  id: string,
  data: {
    eventDate: string;
    eventTime: string;
    guestCount: number;
    address: string;
  }
): Promise<UpdateBookingResult> {
  if (!(await isAuthenticated())) {
    throw new Error("Não autorizado.");
  }

  const eventDate = data.eventDate.trim();
  const eventTime = data.eventTime.trim();
  const address = data.address.trim();
  const guestCount = Number(data.guestCount);

  if (!eventDate || !eventTime || !address || !guestCount) {
    return { success: false, error: "Preencha todos os campos corretamente." };
  }

  await db
    .update(bookings)
    .set({ eventDate, eventTime, guestCount, address })
    .where(eq(bookings.id, id));

  return { success: true };
}
