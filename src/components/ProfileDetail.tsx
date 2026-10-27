import Link from "next/link";

export function ProfileDetail({
  title,
  subtitle,
  rows,
  note,
}: {
  title: string;
  subtitle: string;
  rows: { label: string; value: string }[];
  note: string;
}) {
  return (
    <>
      <Link href="/directory" className="btn-outline self-start">
        <span aria-hidden="true">←&nbsp;</span>Back to directory
      </Link>
      <article className="card max-w-[720px]">
        <h1 className="text-[28px] font-bold">{title}</h1>
        <p className="muted mt-1 mb-4">{subtitle}</p>
        <dl>
          {rows.map((r) => (
            <div key={r.label} className="border-t border-line-soft py-3">
              <dt className="font-bold">{r.label}</dt>
              <dd>{r.value}</dd>
            </div>
          ))}
        </dl>
        <p className="muted mt-3">{note}</p>
      </article>
    </>
  );
}
