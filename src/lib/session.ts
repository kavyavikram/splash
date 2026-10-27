import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export type Role = "instructor" | "family";

export type Profile = {
  id: string;
  display_name: string | null;
  role: Role | null;
  swimmer_id: string | null;
};

/** The signed-in user and their profile, or null. Cached per request. */
export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, role, swimmer_id")
    .eq("id", user.id)
    .single<Profile>();

  return { user, profile };
});

/** For signed-in screens: sends visitors to sign in, and new users to onboarding. */
export async function requireRole() {
  const session = await getSession();
  if (!session) redirect("/");
  const { profile } = session;
  if (!profile?.role || (profile.role === "family" && !profile.swimmer_id)) redirect("/onboarding");
  return { user: session.user, profile: profile as Profile & { role: Role } };
}
