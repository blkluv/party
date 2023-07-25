import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";

config();

const databaseUrl = String(process.env.DATABASE_URL);

const db = drizzle(
  createClient({
    url: databaseUrl.startsWith("http")
      ? databaseUrl.replace(/http(s)?/, "libsql")
      : databaseUrl,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  }),
  { schema }
);

(async () => {
  await migrate(db, {
    migrationsFolder: "./src/db/migrations",
    migrationsTable: "migrations",
  });
  console.info("Migrations applied");
  process.exit(0);
})();
