import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

const base =
  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-sage text-black hover:bg-accent-hover active:bg-brand-sage/90",
  outline:
    "border border-card-border bg-transparent text-white hover:border-brand-sage hover:bg-white/5",
  ghost: "bg-transparent text-white/80 hover:bg-white/10 active:bg-white/15",
  danger: "bg-red-500/90 text-white hover:bg-red-500 active:bg-red-600",
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(base, variants[variant], className)}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  variant = "primary",
  href,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  href: string;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}

