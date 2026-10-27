import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { RolePicker, type SwimmerChoice } from "@/components/RolePicker";
import { signOut } from "@/app/actions/auth";
import { getSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Choose your role · Splash" };

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const supabase = await createClient();
  const { data: swimmers } = await supabase.rpc("swimmer_choices");
  const firstName = session.profile?.display_name?.split(" ")[0];

  return (
    <div className="flex min-h-dvh items-center justify-center bg-linear-to-br from-primary to-teal p-4 sm:p-6">
      <div className="w-full max-w-[860px] rounded-[28px] bg-white px-5 py-8 shadow-[0_20px_50px_rgba(5,40,80,0.25)] sm:px-8 sm:py-10">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo size={48} />
          </div>
          <h1 className="mt-3 text-3xl font-bold">{firstName ? `Hi, ${firstName}!` : "Welcome!"}</h1>
          <p className="mx-auto mt-2 mb-7 max-w-[520px] text-muted">How will you use Splash?</p>
        </div>
        <RolePicker swimmers={(swimmers ?? []) as SwimmerChoice[]} currentRole={session.profile?.role ?? null} />
        <form action={signOut} className="mt-6 text-center">
          <button type="submit" className="inline-flex min-h-11 items-center px-3 text-sm font-bold text-primary underline underline-offset-2">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
