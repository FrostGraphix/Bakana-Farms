import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside the Next.js runtime, so it does not
// inherit .env.local the way the app does. Load it explicitly or
// every command fails with an empty url.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
