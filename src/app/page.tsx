import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function WelcomePage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-linear-to-br from-primary to-teal p-4 sm:p-6">
      <div className="w-full max-w-[860px] rounded-[28px] bg-white px-6 py-10 text-center shadow-[0_20px_50px_rgba(5,40,80,0.25)] sm:px-8">
        <div className="flex justify-center">
          <Logo size={56} />
        </div>
        <p className="mt-2 font-bold text-primary">Splash</p>
        <h1 className="my-3 text-3xl font-bold sm:text-4xl">Welcome to Splash</h1>
        <p className="mx-auto mb-7 max-w-[560px] text-base text-muted">
          Splash helps the SNAPkids community stay connected: lessons, resources, and swimmer
          support for instructors and families.
        </p>
        {/* Milestone 3 replaces this with Google sign-in */}
        <Link href="/dashboard" className="btn">
          Preview the app
        </Link>
        <p className="muted mt-6 text-[13px]">Sign-in is coming soon. All names and data are fictional.</p>
      </div>
    </div>
  );
}
