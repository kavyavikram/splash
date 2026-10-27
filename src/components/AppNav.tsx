"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", short: "Home" },
  { href: "/calendar", label: "Calendar", short: "Calendar" },
  { href: "/directory", label: "Directory", short: "Directory" },
  { href: "/resources", label: "Resources", short: "Resources" },
];

/** Sidebar on desktop, fixed bottom bar on phones. */
export function AppNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav aria-label="Main" className="hidden w-[220px] shrink-0 border-r border-line p-4 md:block">
        <ul className="space-y-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-xl px-3.5 py-3 ${
                  isActive(item.href) ? "bg-sky font-bold text-primary-dark" : "font-medium hover:bg-ice"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="grid grid-cols-4">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex min-h-14 items-center justify-center px-1 text-sm ${
                  isActive(item.href) ? "font-bold text-primary" : "text-muted"
                }`}
              >
                {item.short}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
