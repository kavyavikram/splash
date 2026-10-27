import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Page not found · Splash" };

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      <Logo size={48} />
      <h1 className="mt-4 text-2xl font-bold">We couldn&apos;t find that page</h1>
      <p className="muted mt-2">
        It may have moved, or it may only be available to instructors.
      </p>
      <Link href="/dashboard" className="btn mt-6">
        Go to dashboard
      </Link>
    </div>
  );
}
