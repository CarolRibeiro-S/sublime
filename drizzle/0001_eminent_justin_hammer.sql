ALTER TABLE "bookings" ADD COLUMN "address" text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "address" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "notes" text;