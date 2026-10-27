import Link from "next/link";
import { Logo } from "./Logo";

export function AppHeader({ roleLabel }: { roleLabel?: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 bg-linear-to-r from-primary to-teal-dark px-4 py-3 text-white md:px-6">
      <Link href="/dashboard" className="flex min-h-11 items-center gap-2.5">
        <Logo size={32} variant="white" />
        <span className="text-xl font-bold">Splash</span>
        {roleLabel && (
          <span className="rounded-full bg-white/20 px-3 py-1 text-[13px]">{roleLabel}</span>
        )}
      </Link>
      <Link href="/" className="btn-white">
        Switch role
      </Link>
    </header>
  );
}
