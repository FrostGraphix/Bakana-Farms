ALTER TABLE "refunds" ADD COLUMN "status" text DEFAULT 'requested' NOT NULL;--> statement-breakpoint
ALTER TABLE "refunds" ADD COLUMN "idempotency_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "refunds" ADD COLUMN "actor_reference" text;--> statement-breakpoint
CREATE UNIQUE INDEX "refunds_idempotency_idx" ON "refunds" USING btree ("idempotency_key");