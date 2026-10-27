// Proves the privacy rules against the real Supabase database (RLS), not the UI.
// Creates two throwaway users (family + instructor), checks what each can read, then deletes them.
// Skipped automatically when .env.local has no Supabase keys.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasSupabase = Boolean(url && anonKey && serviceKey);

const noSession = { auth: { persistSession: false, autoRefreshToken: false } };

describe.skipIf(!hasSupabase)("row-level security", () => {
  const admin = hasSupabase ? createClient(url!, serviceKey!, noSession) : (null as never);
  const userIds: string[] = [];
  let family: SupabaseClient;
  let instructor: SupabaseClient;
  let anonymous: SupabaseClient;

  async function signedInAs(role: "family" | "instructor", swimmerId: string | null) {
    const email = `rls-test-${role}-${randomUUID()}@example.test`;
    const password = randomUUID();
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    userIds.push(data.user.id);
    const { error: profileError } = await admin
      .from("profiles")
      .update({ role, swimmer_id: swimmerId })
      .eq("id", data.user.id);
    if (profileError) throw profileError;

    const client = createClient(url!, anonKey!, noSession);
    const { error: signInError } = await client.auth.signInWithPassword({ email, password });
    if (signInError) throw signInError;
    return client;
  }

  beforeAll(async () => {
    family = await signedInAs("family", "s1");
    instructor = await signedInAs("instructor", null);
    anonymous = createClient(url!, anonKey!, noSession);
  });

  afterAll(async () => {
    for (const id of userIds) await admin.auth.admin.deleteUser(id);
  });

  it("families cannot read any swimmer profiles", async () => {
    const { data } = await family.from("swimmer_profiles").select("*");
    expect(data ?? []).toHaveLength(0);
  });

  it("families see only their own swimmer and pairings", async () => {
    const { data: swimmers } = await family.from("swimmers").select("id");
    expect(swimmers?.map((s) => s.id)).toEqual(["s1"]);
    const { data: pairings } = await family.from("swimmer_instructors").select("swimmer_id");
    expect(new Set(pairings?.map((p) => p.swimmer_id))).toEqual(new Set(["s1"]));
  });

  it("instructors can read every swimmer profile", async () => {
    const { data } = await instructor.from("swimmer_profiles").select("swimmer_id");
    expect(data?.length).toBe(11);
  });

  it("users cannot promote themselves to instructor", async () => {
    const { data: me } = await family.auth.getUser();
    await family.from("profiles").update({ role: "instructor" }).eq("id", me.user!.id);
    const { data } = await admin.from("profiles").select("role").eq("id", me.user!.id).single();
    expect(data?.role).toBe("family");
  });

  it("families get class counts but no names", async () => {
    const { data, error } = await family.rpc("class_pool_counts", { slot_id: "berkeley-1" });
    expect(error).toBeNull();
    expect(data).toEqual([{ pool: "Instructional pool", swimmer_count: 2 }]);
  });

  it("signed-out visitors read nothing", async () => {
    const { data } = await anonymous.from("swimmer_profiles").select("*");
    expect(data ?? []).toHaveLength(0);
    const { data: instructors } = await anonymous.from("instructors").select("*");
    expect(instructors ?? []).toHaveLength(0);
  });
});
