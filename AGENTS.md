# AGENTS.md: Splash

Splash is a web app for **SNAPkids**, a nonprofit adaptive swim program in the Bay Area. It keeps instructors and families connected: who swims when and where, which instructor works with which swimmer, and how to support each swimmer in the water.

This is an MVP. Real people test it, so the core loop must work end to end; polish comes second.

## Source of truth

- `reference/prototype.html` is the design prototype: screens, layout, colors, copy and sample data. Read it; don't run it. It uses a custom templating format (`sc-if`, `sc-for`, `{{…}}`), so screens are rebuilt as normal React components.
- **All data is fictional sample data from the prototype. Never add real swimmer information.**

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Supabase: Google sign-in (Auth), Postgres, row-level security (RLS)
- Vercel, deployed automatically from `main`
- Vitest for unit tests

## Scope (v1)

In: Google sign-in, role choice (Instructor needs an access code; Swimmer & Family picks their swimmer), location switcher (Berkeley, Palo Alto, Albany), dashboards, month calendar with class detail, directory, resource hub, feedback link + demo-data note in the footer.

Out: messages, help chatbot, editing data in the app, notifications, payments, mobile app.

## Privacy rules (enforced in the database, not just the UI)

- `swimmer_profiles` (condition, communication, considerations, focus, history) is readable **only by instructors**, enforced by RLS.
- Families can read only their own swimmer's basic row and assignments. On the calendar they see time, address, pool notes, instructors and swimmer **counts**, never names.
- A user's `role` can only change through the server action that checks `INSTRUCTOR_ACCESS_CODE`. Users can't update it directly.

## Folder structure

```
reference/            Design prototype (read-only)
src/app/              Routes (App Router)
  page.tsx            Welcome / sign-in
  (app)/              Signed-in shell: header, nav, location switcher
    dashboard/ calendar/ directory/ resources/
  actions/            Server actions ("use server")
src/components/       Shared React components
src/lib/              Pure logic + data access (calendar, search, locations, supabase clients)
src/content/          Static content (resource hub articles)
supabase/             SQL migrations (schema + RLS) and the seed script
  seed-data.ts        ALL sample data, including the class schedule; edit here
```

## Commands

```bash
npm run dev      # local dev server on http://localhost:3000
npm run build    # production build (run before pushing)
npm run lint     # ESLint
npm test         # Vitest unit tests
npm run migrate  # apply new supabase/migrations/*.sql (needs DATABASE_URL); each file runs once
npm run seed     # load sample data into Supabase (needs SUPABASE_SERVICE_ROLE_KEY); safe to re-run
npm run dev-login -- name@example.test   # local only: prints a one-time sign-in link for a test account
```

Don't run `npm run build` while `npm run dev` is running; they share `.next/` and the dev server breaks (fix: stop it, `rm -rf .next`, restart).

## Auth flow

Google sign-in → `/auth/callback` swaps the code for a session cookie → `src/middleware.ts` keeps it fresh → `(app)/layout.tsx` calls `requireRole()`, which sends signed-out visitors to `/` and users without a role to `/onboarding`. Role changes happen only in `src/app/actions/auth.ts` (service-role client, after `accessCodeMatches`). `/auth/confirm` handles email links (magic-link fallback and `dev-login`).

## Environment variables

| Name | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Public anon key (safe: RLS protects data) |
| `SUPABASE_SERVICE_ROLE_KEY` | server/seed only | Bypasses RLS. Never expose to the client |
| `INSTRUCTOR_ACCESS_CODE` | server only | Code required to choose the Instructor role |
| `NEXT_PUBLIC_FEEDBACK_URL` | client | Footer feedback link (hidden when unset) |

Local values go in `.env.local` (git-ignored). Production values go in Vercel → Project → Settings → Environment Variables.

## How the screens get data

- `src/lib/data.ts`: every database read, all through the signed-in user's Supabase client, so RLS decides what comes back. Family-safe class info comes from the `class_pool_counts` / `class_instructor_ids` functions.
- `src/lib/calendar.ts`: weekly class slots → dates. Dates are `"YYYY-MM-DD"` strings; "today" is computed in America/Los_Angeles.
- `src/lib/search.ts`: shared search (every query word must match somewhere; case/accent-insensitive). Used by `SearchableCards` (directory) and `ResourceBrowser`.
- Routes: `/dashboard`, `/calendar?month=YYYY-MM`, `/calendar/[slotId]/[date]`, `/directory?tab=swimmers`, `/directory/instructors/[id]`, `/directory/swimmers/[id]` (instructors only), `/resources`, `/resources/[id]`, `/privacy` (public, required by Google OAuth).
- `(app)/loading.tsx`, `app/error.tsx` and `app/not-found.tsx` are the shared loading, error and 404 screens.

## Conventions

- **Design tokens** live in `src/app/globals.css` (`@theme`): `primary` #0B63B8, `teal` #10A5B5, `navy` #0B2540, `muted`, `line`, `mint`, `sky`. Reusable classes: `btn`, `btn-outline`, `btn-white`, `card`, `card-link`, `chip`, `pill`/`pill-on`, `field`, `muted`, `hero`.
- Font is DM Sans (`next/font`). Rounded cards, **44px minimum touch targets** (`min-h-11`).
- Mobile first: families mostly use phones. Nav is a sidebar on desktop and a bottom bar on phones.
- Accessibility: real `<button>`/`<Link>`, labeled inputs, `aria-pressed`/`aria-current` for toggles and nav, skip link to `#main`. Text must meet WCAG AA (4.5:1): white text on gradients ends at `teal-dark` (#0A7A8A, 5.0:1), never `teal`. Input borders use `field-strong` (3:1); `field` is decorative only.
- Prefer Server Components; add `"use client"` only for interactivity.
- The selected location lives in the `splash_location` cookie (`src/lib/current-location.ts`), so server components can filter by it.
- Keep logic that needs tests (calendar placement, search, access rules) as pure functions in `src/lib/` with tests beside them (`*.test.ts`). Don't unit test purely visual components.
- Commit after each milestone with a clear message; `main` deploys to production.
