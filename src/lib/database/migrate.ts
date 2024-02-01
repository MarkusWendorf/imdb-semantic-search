import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { connection } from "./db";

async function run() {
  const sql = postgres({
    ...connection,
    max: 1,
  });

  console.log(connection);

  const db = drizzle(sql);

  await migrate(db, { migrationsFolder: "migrations" });
  await sql.end();
}

run();
