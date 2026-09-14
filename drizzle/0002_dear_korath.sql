CREATE TABLE "support_enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"order_reference" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_sends" ADD COLUMN "payload" jsonb;--> statement-breakpoint
CREATE INDEX "support_enquiries_status_idx" ON "support_enquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "support_enquiries_email_idx" ON "support_enquiries" USING btree ("email");