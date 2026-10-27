type LogoProps = {
  size?: number;
  /** "color" is the gradient badge; "white" sits on the blue header */
  variant?: "color" | "white";
};

export function Logo({ size = 56, variant = "color" }: LogoProps) {
  const isWhite = variant === "white";
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <defs>
        <linearGradient id="splash-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B63B8" />
          <stop offset="1" stopColor="#10A5B5" />
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="28" fill={isWhite ? "#fff" : "url(#splash-logo)"} />
      <path
        d="M10 25c4-5 7-5 9 0s6 5 9 0 6-5 9 0 6 5 9 0M10 36c4-5 7-5 9 0s6 5 9 0 6-5 9 0 6 5 9 0"
        stroke={isWhite ? "#0B63B8" : "#fff"}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
