ALTER TABLE "customers" ADD COLUMN "clerk_user_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX "customers_clerk_user_idx" ON "customers" USING btree ("clerk_user_id");