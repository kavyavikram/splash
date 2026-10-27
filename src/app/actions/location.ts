"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCATION_COOKIE, isLocationId } from "@/lib/locations";

export async function setLocation(locationId: string) {
  if (!isLocationId(locationId)) return;
  (await cookies()).set(LOCATION_COOKIE, locationId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
