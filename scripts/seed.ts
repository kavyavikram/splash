// Loads the fictional sample data from supabase/seed-data.ts. Safe to re-run. Usage: npm run seed
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { CLASS_SLOTS, INSTRUCTORS, LOCATIONS, SESSION, SWIMMERS } from "../supabase/seed-data";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}

// The service role bypasses RLS, so this script can write every table.
const db = createClient(url, serviceKey, { auth: { persistSession: false } });

async function upsert(table: string, rows: object[], onConflict?: string) {
  const { error } = await db.from(table).upsert(rows, onConflict ? { onConflict } : undefined);
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`✓ ${table}: ${rows.length} rows`);
}

async function main() {
  await upsert("locations", LOCATIONS);
  await upsert("instructors", INSTRUCTORS);
  await upsert(
    "class_slots",
    CLASS_SLOTS.map((slot) => ({ ...slot, ...SESSION })),
  );
  await upsert(
    "swimmers",
    SWIMMERS.map(({ id, display_name, location_id, class_slot_id, pool }) => ({
      id,
      display_name,
      location_id,
      class_slot_id,
      pool,
    })),
  );

  // Replace pairings so removed ones don't linger.
  const { error } = await db.from("swimmer_instructors").delete().neq("swimmer_id", "");
  if (error) throw new Error(`swimmer_instructors: ${error.message}`);
  await upsert(
    "swimmer_instructors",
    SWIMMERS.flatMap((s) => s.instructor_ids.map((instructor_id) => ({ swimmer_id: s.id, instructor_id }))),
  );

  await upsert(
    "swimmer_profiles",
    SWIMMERS.map((s) => ({
      swimmer_id: s.id,
      condition: s.condition,
      nonverbal: s.nonverbal,
      considerations: s.considerations,
      years_with_snapkids: s.years_with_snapkids,
      session_focus: s.session_focus,
      past_instructors: s.past_instructors,
    })),
  );
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
