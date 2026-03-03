import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-brand-sage/60 focus:ring-2 focus:ring-brand-sage/25",
        className,
      )}
    />
  );
}

