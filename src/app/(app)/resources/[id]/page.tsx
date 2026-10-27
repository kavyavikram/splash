import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource } from "@/content/resources";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resource = getResource((await params).id);
  return { title: resource ? `${resource.title} · Splash` : "Resource · Splash" };
}

export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const resource = getResource((await params).id);
  if (!resource) notFound();

  // Split lyrics into verses at blank lines.
  const verses = (resource.lyrics ?? []).join("\n").split("\n\n").filter(Boolean);

  return (
    <>
      <Link href="/resources" className="btn-outline self-start">
        <span aria-hidden="true">←&nbsp;</span>Back to resources
      </Link>
      <article className="card max-w-[720px]">
        <span className="chip">{resource.category}</span>
        <h1 className="my-2.5 text-[28px] font-bold">{resource.title}</h1>
        <p className="leading-relaxed">{resource.body}</p>

        {verses.length > 0 && (
          <section aria-label="Lyrics" className="mt-4 space-y-4 rounded-[14px] bg-ice p-4 leading-relaxed">
            {verses.map((verse, i) => (
              <p key={i} className="whitespace-pre-line">
                {verse}
              </p>
            ))}
          </section>
        )}

        <h2 className="mt-5 mb-1 text-lg font-bold">Tips</h2>
        <ul>
          {resource.tips.map((tip) => (
            <li key={tip} className="border-t border-line-soft py-2">
              {tip}
            </li>
          ))}
        </ul>
        <p className="muted mt-3">Fictional example content, not official SNAPkids guidance.</p>
      </article>
    </>
  );
}
