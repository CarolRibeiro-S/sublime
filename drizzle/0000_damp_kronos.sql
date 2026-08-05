CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" text NOT NULL,
	"event_date" date NOT NULL,
	"event_time" text NOT NULL,
	"event_type" text NOT NULL,
	"guest_count" integer NOT NULL,
	"request_type" text NOT NULL,
	"status" text DEFAULT 'pendente' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
