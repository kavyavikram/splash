import { AppHeader } from "@/components/AppHeader";
import { AppNav } from "@/components/AppNav";
import { LocationSwitcher } from "@/components/LocationSwitcher";
import { getCurrentLocation } from "@/lib/current-location";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const location = await getCurrentLocation();

  return (
    <>
      <AppHeader />
      <div className="flex">
        <AppNav />
        <main className="flex min-w-0 flex-1 flex-col gap-5 p-4 md:p-6">
          <div className="card px-4 py-3.5">
            <LocationSwitcher current={location} />
          </div>
          {children}
        </main>
      </div>
    </>
  );
}
