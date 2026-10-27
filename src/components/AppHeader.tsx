import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { Logo } from "./Logo";

export function AppHeader({ roleLabel }: { roleLabel: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-linear-to-r from-primary to-teal-dark px-4 py-3 text-white md:px-6">
      <Link href="/dashboard" className="flex min-h-11 items-center gap-2.5">
        <Logo size={32} variant="white" />
        <span className="text-xl font-bold">Splash</span>
        <span className="rounded-full border border-white/70 px-3 py-0.5 text-[13px]">{roleLabel}</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/onboarding" className="btn-white px-4">
          Switch role
        </Link>
        <form action={signOut}>
          <button type="submit" className="inline-flex min-h-11 items-center rounded-xl px-3 font-bold text-white underline-offset-2 hover:underline">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
