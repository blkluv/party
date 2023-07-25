import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "~/config/env";
import * as schema from "./schema";

export const libsqlClient = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(libsqlClient, { schema });
