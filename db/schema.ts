import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  date,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: text("client_name").notNull(),
  eventDate: date("event_date").notNull(),
  eventTime: text("event_time").notNull(),
  eventType: text("event_type").notNull(),
  guestCount: integer("guest_count").notNull(),
  requestType: text("request_type").notNull(),
  status: text("status").notNull().default("pendente"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
