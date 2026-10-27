import { AppHeader } from "@/components/AppHeader";
import { AppNav } from "@/components/AppNav";
import { LocationSwitcher } from "@/components/LocationSwitcher";
import { getCurrentLocation } from "@/lib/current-location";
import { requireRole } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole();
  const location = await getCurrentLocation();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:font-bold focus:text-primary focus:shadow-lg"
      >
        Skip to main content
      </a>
      <AppHeader roleLabel={profile.role === "instructor" ? "Instructor" : "Swimmer & Family"} />
      <div className="flex">
        <AppNav />
        <main id="main" tabIndex={-1} className="flex min-w-0 flex-1 flex-col gap-5 p-4 outline-none md:p-6">
          <div className="card px-4 py-3.5">
            <LocationSwitcher current={location} />
          </div>
          {children}
        </main>
      </div>
    </>
  );
}
