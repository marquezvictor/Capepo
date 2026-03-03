"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function IconHome({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <path d="M3 10.5 12 3l9 7.5V21a1.5 1.5 0 0 1-1.5 1.5H16.5V15a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 7.5 15v7.5H4.5A1.5 1.5 0 0 1 3 21v-10.5Z" />
    </svg>
  );
}

function IconTrophy({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
      <path d="M6 7H4a2 2 0 0 0 2 2" />
      <path d="M18 7h2a2 2 0 0 1-2 2" />
      <path d="M12 11v3" />
      <path d="M8 21h8" />
      <path d="M10 14h4a2 2 0 0 1 2 2v1H8v-1a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function IconScore({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden
    >
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-8" />
      <path d="M22 20v-5" />
    </svg>
  );
}

const items = [
  { href: "/", label: "Home", Icon: IconHome },
  { href: "/scores", label: "Scores", Icon: IconScore },
  { href: "/tournaments", label: "Tournaments", Icon: IconTrophy },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const hide = pathname.startsWith("/admin");
  if (hide) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-surface-base/90 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center justify-around px-4 py-2">
        {items.map(({ href, label, Icon }) => {
          const active =
            pathname === href ||
            (href === "/tournaments" && pathname.startsWith("/tournaments"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs",
                active
                  ? "text-brand-sage"
                  : "text-white/70 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

