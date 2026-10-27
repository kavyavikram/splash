"use client";

import Link from "next/link";
import { useState } from "react";
import { searchItems } from "@/lib/search";

export type CardItem = {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  chips: string[];
  /** Extra text that search should match but the card doesn't show */
  searchText: string[];
};

/** Search box + card grid, filtered as you type. Used by the directory. */
export function SearchableCards({
  items,
  label,
  placeholder,
}: {
  items: CardItem[];
  label: string;
  placeholder: string;
}) {
  const [query, setQuery] = useState("");
  const shown = searchItems(items, query, (i) => [i.title, i.subtitle, ...i.chips, ...i.searchText]);

  return (
    <>
      <div>
        <label htmlFor="directory-search" className="sr-only">
          {label}
        </label>
        <input
          id="directory-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="field"
          autoComplete="off"
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length === 1 ? "1 result" : `${shown.length} results`}
      </p>
      {shown.length === 0 ? (
        <div className="card text-center">
          <p className="font-bold">No profiles match your search.</p>
          <p className="muted">Try a different word or clear the search box.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {shown.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="card-link h-full">
                <span className="block text-lg font-bold">{item.title}</span>
                <span className="muted mt-1 mb-2.5 block">{item.subtitle}</span>
                <span className="block">
                  {item.chips.map((c) => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
