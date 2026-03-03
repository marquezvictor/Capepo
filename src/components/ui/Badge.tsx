import { cn } from "@/lib/utils";

type Status = "upcoming" | "active" | "completed" | string;

export function StatusBadge({ status }: { status: Status }) {
  const normalized = String(status || "").toLowerCase();

  const cls =
    normalized === "active"
      ? "bg-green-500/15 text-green-300 ring-green-500/25"
      : normalized === "completed"
        ? "bg-zinc-500/15 text-zinc-200 ring-zinc-500/25"
        : "bg-blue-500/15 text-blue-300 ring-blue-500/25";

  const label =
    normalized === "active"
      ? "Active"
      : normalized === "completed"
        ? "Completed"
        : "Upcoming";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        cls,
      )}
    >
      {label}
    </span>
  );
}

