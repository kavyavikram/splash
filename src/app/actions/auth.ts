"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accessCodeMatches } from "@/lib/access";
import { LOCATION_COOKIE } from "@/lib/locations";
import { getSession } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string };

// Role changes use the service-role client: RLS gives users no way to edit their own role.

export async function chooseInstructor(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/");

  if (!accessCodeMatches(formData.get("code"), process.env.INSTRUCTOR_ACCESS_CODE)) {
    return { error: "That access code isn't right. Ask the SNAPkids team for the instructor code." };
  }

  const { error } = await createAdminClient()
    .from("profiles")
    .update({ role: "instructor", swimmer_id: null })
    .eq("id", session.user.id);
  if (error) return { error: "Something went wrong saving your role. Please try again." };

  redirect("/dashboard");
}

export async function chooseFamily(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/");

  const swimmerId = formData.get("swimmer_id");
  if (typeof swimmerId !== "string" || !swimmerId) return { error: "Please choose your swimmer." };

  const admin = createAdminClient();
  const { data: swimmer } = await admin.from("swimmers").select("id, location_id").eq("id", swimmerId).single();
  if (!swimmer) return { error: "Please choose your swimmer." };

  const { error } = await admin
    .from("profiles")
    .update({ role: "family", swimmer_id: swimmer.id })
    .eq("id", session.user.id);
  if (error) return { error: "Something went wrong saving your choice. Please try again." };

  // Start families at their swimmer's pool.
  (await cookies()).set(LOCATION_COOKIE, swimmer.location_id, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  redirect("/dashboard");
}

export async function signOut() {
  await (await createClient()).auth.signOut();
  redirect("/");
}
