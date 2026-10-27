// Applies supabase/migrations/*.sql in order, once each. Usage: npm run migrate
import { config } from "dotenv";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing from .env.local");

  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(
      "create table if not exists public._migrations (name text primary key, applied_at timestamptz default now())",
    );
    await client.query("revoke all on public._migrations from anon, authenticated");
    const applied = new Set(
      (await client.query<{ name: string }>("select name from public._migrations")).rows.map((r) => r.name),
    );

    const dir = join(process.cwd(), "supabase", "migrations");
    const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`✓ ${file} (already applied)`);
        continue;
      }
      await client.query("begin");
      try {
        await client.query(readFileSync(join(dir, file), "utf8"));
        await client.query("insert into public._migrations (name) values ($1)", [file]);
        await client.query("commit");
        console.log(`✓ ${file} applied`);
      } catch (err) {
        await client.query("rollback");
        throw err;
      }
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
