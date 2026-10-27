import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Privacy · Splash" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-4 py-10">
      <Link href="/" className="mb-6 inline-flex min-h-11 items-center gap-2 font-bold text-primary">
        <Logo size={28} />
        Splash
      </Link>
      <h1 className="text-3xl font-bold">Privacy policy</h1>
      <p className="muted mt-1">Last updated October 27, 2026</p>

      <div className="mt-6 space-y-5 leading-relaxed">
        <p>
          Splash is a demo web app for SNAPkids, an adaptive swim program in the Bay Area. It is being tested
          with a small group of people. All swimmer, instructor and class information in Splash is fictional
          sample data.
        </p>

        <section>
          <h2 className="mb-2 text-lg font-bold">What we collect</h2>
          <p>
            When you sign in with Google, we receive your name, email address and Google account ID. We also
            save the role you choose (Instructor or Swimmer &amp; Family), the sample swimmer you pick, and
            the location you last selected (in a browser cookie).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold">How we use it</h2>
          <p>
            Only to sign you in and show you the right screens. We don&apos;t sell or share your information,
            send marketing email, or use advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold">Where it&apos;s stored</h2>
          <p>
            Account information is stored with Supabase, our database and sign-in provider, and the app is
            hosted on Vercel. Access to swimmer details is restricted to instructor accounts.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold">Deleting your data</h2>
          <p>
            To have your account deleted, ask the Splash team through the feedback link at the bottom of any
            page and we&apos;ll remove it.
          </p>
        </section>
      </div>
    </main>
  );
}
