"use client";

import Link from "next/link";
import { useState } from "react";
import { RESOURCES, RESOURCE_CATEGORIES } from "@/content/resources";
import { filterResources } from "@/lib/search";

const FILTERS = ["All", ...RESOURCE_CATEGORIES];

export function ResourceBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const shown = filterResources(RESOURCES, query, category);

  return (
    <>
      <div>
        <label htmlFor="resource-search" className="sr-only">
          Search resources
        </label>
        <input
          id="resource-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search resources"
          className="field"
          autoComplete="off"
        />
      </div>

      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {FILTERS.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`pill ${category === c ? "pill-on" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length === 1 ? "1 resource" : `${shown.length} resources`}
      </p>
      {shown.length === 0 ? (
        <div className="card text-center">
          <p className="font-bold">No resources found.</p>
          <p className="muted">Try another search or choose All.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {shown.map((r) => (
            <li key={r.id}>
              <Link href={`/resources/${r.id}`} className="card-link h-full">
                <span className="chip">{r.category}</span>
                <span className="mt-2 mb-1 block text-lg font-bold">{r.title}</span>
                <span className="muted block">{r.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
