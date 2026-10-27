export function Footer() {
  const feedbackUrl = process.env.NEXT_PUBLIC_FEEDBACK_URL;

  return (
    <footer className="border-t border-line px-4 py-5 pb-24 text-center md:pb-5">
      <p className="muted">Demo data — all names are fictional.</p>
      {feedbackUrl && (
        <a
          href={feedbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex min-h-11 items-center font-bold text-primary underline underline-offset-2"
        >
          Send feedback
        </a>
      )}
    </footer>
  );
}
