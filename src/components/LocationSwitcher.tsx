"use client";

import { useTransition } from "react";
import { setLocation } from "@/app/actions/location";
import { LOCATIONS, type LocationId } from "@/lib/locations";

export function LocationSwitcher({ current }: { current: LocationId }) {
  const [pending, startTransition] = useTransition();

  return (
    <div role="group" aria-label="Location" className="flex flex-wrap items-center gap-2">
      <span className="font-bold">Location:</span>
      {LOCATIONS.map((loc) => {
        const on = loc.id === current;
        return (
          <button
            key={loc.id}
            type="button"
            aria-pressed={on}
            disabled={pending}
            onClick={() => startTransition(() => setLocation(loc.id))}
            className={`pill ${on ? "pill-on" : ""} disabled:opacity-70`}
          >
            {loc.name}
          </button>
        );
      })}
    </div>
  );
}
