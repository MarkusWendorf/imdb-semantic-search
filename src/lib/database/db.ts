import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema";
import { env } from "$env/dynamic/private";

const { DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = env;

export const connection = {
  host: DB_HOST || "127.0.0.1",
  database: DB_DATABASE || "movies",
  user: DB_USERNAME || "postgres",
  password: DB_PASSWORD || "postgres",
};

export function initDatabase() {
  const client = postgres(connection);
  return { client, db: initDrizzle(client) };
}

function initDrizzle(client: postgres.Sql) {
  return drizzle(client, { logger: false, schema });
}

export type Database = ReturnType<typeof initDrizzle>;
