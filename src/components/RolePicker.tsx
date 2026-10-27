"use client";

import { useActionState, useState } from "react";
import { chooseFamily, chooseInstructor, type FormState } from "@/app/actions/auth";
import { LOCATIONS } from "@/lib/locations";

export type SwimmerChoice = { id: string; display_name: string; location_id: string };

export function RolePicker({
  swimmers,
  currentRole,
}: {
  swimmers: SwimmerChoice[];
  currentRole: "instructor" | "family" | null;
}) {
  const [choice, setChoice] = useState<"instructor" | "family" | null>(null);

  if (choice === "instructor") return <InstructorForm onBack={() => setChoice(null)} />;
  if (choice === "family") return <FamilyForm swimmers={swimmers} onBack={() => setChoice(null)} />;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <RoleCard
        title="Instructor"
        body="See your lessons and swimmers, browse the directory, and find teaching resources."
        cta="Continue as Instructor"
        current={currentRole === "instructor"}
        onClick={() => setChoice("instructor")}
        icon={
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0B63B8" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        }
      />
      <RoleCard
        title="Swimmer & Family"
        body="Check upcoming lessons, meet your instructor, and explore helpful resources."
        cta="Continue as Family"
        current={currentRole === "family"}
        onClick={() => setChoice("family")}
        icon={
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0E8FA3" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="8" cy="8" r="3" />
            <circle cx="17" cy="10" r="2.5" />
            <path d="M2 20c0-3.5 3-5 6-5s6 1.5 6 5M14 20c0-2.5 2-4 4-4s4 1.5 4 4" />
          </svg>
        }
      />
    </div>
  );
}

function RoleCard(props: {
  title: string;
  body: string;
  cta: string;
  current: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={props.onClick} className="card-link p-7 text-center">
      <span className="flex justify-center">{props.icon}</span>
      <span className="mt-3 mb-1.5 block text-[22px] font-bold">{props.title}</span>
      {props.current && <span className="chip">Your current role</span>}
      <span className="muted mb-4 block">{props.body}</span>
      <span className="btn">{props.cta}</span>
    </button>
  );
}

function InstructorForm({ onBack }: { onBack: () => void }) {
  const [state, action, pending] = useActionState<FormState, FormData>(chooseInstructor, {});
  return (
    <form action={action} className="mx-auto max-w-md">
      <h2 className="text-xl font-bold">Instructor access</h2>
      <p className="muted mt-1 mb-4">
        Instructor accounts can see swimmer support details, so they need the code from the SNAPkids team.
      </p>
      <label htmlFor="code" className="mb-1.5 block font-bold">
        Access code
      </label>
      <input
        id="code"
        name="code"
        type="password"
        autoComplete="off"
        required
        className="field"
        aria-invalid={Boolean(state.error)}
        aria-describedby={state.error ? "code-error" : undefined}
      />
      {state.error && (
        <p id="code-error" role="alert" className="mt-2 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="btn disabled:opacity-70">
          {pending ? "Checking…" : "Continue"}
        </button>
        <button type="button" onClick={onBack} className="btn-outline">
          Back
        </button>
      </div>
    </form>
  );
}

function FamilyForm({ swimmers, onBack }: { swimmers: SwimmerChoice[]; onBack: () => void }) {
  const [state, action, pending] = useActionState<FormState, FormData>(chooseFamily, {});
  return (
    <form action={action} className="mx-auto max-w-lg">
      <fieldset>
        <legend className="text-xl font-bold">Which swimmer is yours?</legend>
        <p className="muted mt-1 mb-4">This is demo data, so pick any sample swimmer to explore their view.</p>
        {LOCATIONS.map((loc) => {
          const here = swimmers.filter((s) => s.location_id === loc.id);
          if (here.length === 0) return null;
          return (
            <div key={loc.id} className="mb-4">
              <p className="mb-2 font-bold text-muted">{loc.name}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {here.map((s) => (
                  <label
                    key={s.id}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border-[1.5px] border-field px-4 py-2.5 has-checked:border-primary has-checked:bg-sky"
                  >
                    <input type="radio" name="swimmer_id" value={s.id} required className="size-5 accent-primary" />
                    <span className="font-medium">{s.display_name}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </fieldset>
      {state.error && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="btn disabled:opacity-70">
          {pending ? "Saving…" : "Continue"}
        </button>
        <button type="button" onClick={onBack} className="btn-outline">
          Back
        </button>
      </div>
    </form>
  );
}
