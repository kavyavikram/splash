"use client";

import { useTransition } from "react";
import { setLocation } from "@/app/actions/location";

export function SwitchLocationButton({ locationId, label }: { locationId: string; label: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => setLocation(locationId))}
      className="btn-outline disabled:opacity-70"
    >
      {label}
    </button>
  );
}
