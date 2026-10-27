import { ResourceBrowser } from "@/components/ResourceBrowser";

export const metadata = { title: "Resource hub · Splash" };

export default function ResourcesPage() {
  return (
    <>
      <div>
        <h1 className="text-[28px] font-bold">Adaptive Swimming Resource Hub</h1>
        <p className="muted mt-1">Fictional example resources for the demo.</p>
      </div>
      <ResourceBrowser />
    </>
  );
}
