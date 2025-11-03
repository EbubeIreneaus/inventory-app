import { defineConfig } from "drizzle-kit";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("Missing DATABASE_URL environment variable (DATABASE_URL)");

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: dbUrl as string,
  },
});