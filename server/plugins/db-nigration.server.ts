import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../db";

export default async () => {
  if (process.env.NODE_ENV !== "production") return;

  try {
    console.log("🟡 Running migrations...");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("✅ Migrations done");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  }
};