import Link from "next/link";

export function Footer() {
  const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_URL;

  return (
    <footer className="border-t border-line px-4 py-5 pb-24 text-center md:pb-5">
      <p className="muted">Demo data — all names are fictional.</p>
      <div className="mt-1 flex flex-wrap justify-center gap-x-5">
        {feedbackUrl && (
          <a
            href={feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center font-bold text-primary underline underline-offset-2"
          >
            Send feedback
          </a>
        )}
        <Link href="/privacy" className="inline-flex min-h-11 items-center text-sm text-muted underline underline-offset-2">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
