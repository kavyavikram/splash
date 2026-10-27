"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <Logo size={48} />
      <h1 className="mt-4 text-2xl font-bold">Something went wrong</h1>
      <p className="muted mt-2">This is usually a hiccup with the connection. Please try again.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn">
          Try again
        </button>
        <Link href="/dashboard" className="btn-outline">
          Go to dashboard
        </Link>
      </div>
      {error.digest && <p className="muted mt-6 text-xs">Error reference: {error.digest}</p>}
    </div>
  );
}
