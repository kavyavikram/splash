import "server-only";
import { cache } from "react";
import type { ClassSlot } from "./calendar";
import { createClient } from "./supabase/server";

// Every query runs as the signed-in user, so row-level security decides what comes back.
// Families get no rows from swimmer tables they aren't allowed to see.

export type Pool = "Instructional pool" | "Lap pool";
export const POOLS: Pool[] = ["Instructional pool", "Lap pool"];

export type Location = { id: string; name: string; short_name: string; address: string; pool_note: string };

export type Instructor = {
  id: string;
  name: string;
  location_id: string;
  years_experience: number;
  teaching_interests: string[];
  availability: string;
};

export type Swimmer = {
  id: string;
  display_name: string;
  location_id: string;
  class_slot_id: string;
  pool: Pool;
  instructor_ids: string[];
};

export type SwimmerProfile = {
  condition: string;
  nonverbal: string;
  considerations: string;
  years_with_snapkids: number;
  session_focus: string;
  past_instructors: string;
};

type SwimmerRow = Omit<Swimmer, "instructor_ids"> & { swimmer_instructors: { instructor_id: string }[] };

const SWIMMER_COLUMNS = "id, display_name, location_id, class_slot_id, pool, swimmer_instructors(instructor_id)";

function toSwimmer({ swimmer_instructors, ...rest }: SwimmerRow): Swimmer {
  return { ...rest, instructor_ids: swimmer_instructors.map((p) => p.instructor_id).sort() };
}

export const getLocation = cache(async (id: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("locations").select("*").eq("id", id).single<Location>();
  return data;
});

export const getAllInstructors = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("instructors").select("*").order("name").returns<Instructor[]>();
  return data ?? [];
});

export const getInstructor = cache(async (id: string) => {
  return (await getAllInstructors()).find((i) => i.id === id) ?? null;
});

export const getClassSlots = cache(async (locationId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("class_slots")
    .select("*")
    .eq("location_id", locationId)
    .order("weekday")
    .order("start_time")
    .returns<ClassSlot[]>();
  return data ?? [];
});

export const getClassSlot = cache(async (id: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("class_slots").select("*").eq("id", id).maybeSingle<ClassSlot>();
  return data;
});

/** Swimmers at a location (instructors only; families get just their own swimmer, if it's here). */
export const getSwimmers = cache(async (locationId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("swimmers")
    .select(SWIMMER_COLUMNS)
    .eq("location_id", locationId)
    .order("display_name")
    .returns<SwimmerRow[]>();
  return (data ?? []).map(toSwimmer);
});

export const getSwimmer = cache(async (id: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("swimmers").select(SWIMMER_COLUMNS).eq("id", id).maybeSingle<SwimmerRow>();
  return data ? toSwimmer(data) : null;
});

/** Private support details: null for anyone who isn't an instructor (enforced by RLS). */
export const getSwimmerProfile = cache(async (swimmerId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("swimmer_profiles")
    .select("condition, nonverbal, considerations, years_with_snapkids, session_focus, past_instructors")
    .eq("swimmer_id", swimmerId)
    .maybeSingle<SwimmerProfile>();
  return data;
});

/** Directory cards: swimmers at a location with their private profile (instructors only). */
export const getSwimmersWithProfiles = cache(async (locationId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("swimmers")
    .select(`${SWIMMER_COLUMNS}, swimmer_profiles(*)`)
    .eq("location_id", locationId)
    .order("display_name")
    .returns<(SwimmerRow & { swimmer_profiles: SwimmerProfile | null })[]>();
  return (data ?? []).map(({ swimmer_profiles, ...row }) => ({ ...toSwimmer(row), profile: swimmer_profiles }));
});

/** Instructor view of a class: every swimmer with their condition (one query for all profiles). */
export async function getClassRoster(slotId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("swimmers")
    .select(`${SWIMMER_COLUMNS}, swimmer_profiles(condition)`)
    .eq("class_slot_id", slotId)
    .order("display_name")
    .returns<(SwimmerRow & { swimmer_profiles: { condition: string } | null })[]>();
  return (data ?? []).map(({ swimmer_profiles, ...row }) => ({
    ...toSwimmer(row),
    condition: swimmer_profiles?.condition ?? null,
  }));
}

/** Family-safe view of a class: swimmer counts per pool and the instructor ids, no names. */
export async function getClassSummary(slotId: string) {
  const supabase = await createClient();
  const [counts, instructors] = await Promise.all([
    supabase.rpc("class_pool_counts", { slot_id: slotId }),
    supabase.rpc("class_instructor_ids", { slot_id: slotId }),
  ]);
  const poolCounts = Object.fromEntries(POOLS.map((p) => [p, 0])) as Record<Pool, number>;
  for (const row of (counts.data ?? []) as { pool: Pool; swimmer_count: number }[]) {
    poolCounts[row.pool] = row.swimmer_count;
  }
  const instructorIds = ((instructors.data ?? []) as { instructor_id: string }[]).map((r) => r.instructor_id);
  return { poolCounts, instructorIds };
}

/** "Maya Chen & Daniel Okafor" */
export function instructorNames(ids: string[], instructors: Instructor[]): string {
  return ids
    .map((id) => instructors.find((i) => i.id === id)?.name)
    .filter(Boolean)
    .join(" & ");
}

export function firstName(name: string | null | undefined): string | null {
  return name?.trim().split(/\s+/)[0] || null;
}
