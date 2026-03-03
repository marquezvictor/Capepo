import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-surface-card p-4 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

