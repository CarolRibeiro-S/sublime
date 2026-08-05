ALTER TABLE "bookings" ADD COLUMN "other_drinks" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "service_type" text NOT NULL DEFAULT 'completo';--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "service_type" DROP DEFAULT;