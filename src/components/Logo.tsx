import { cn } from "@/lib/utils";

export function Logo({
  className,
  hero = false,
}: {
  className?: string;
  hero?: boolean;
}) {
  return (
    <div
      className={cn(
        hero ? "text-center" : "flex flex-col leading-none",
        className,
      )}
    >
      <div
        className={cn(
          "font-extrabold tracking-tight",
          hero ? "text-4xl md:text-5xl" : "text-xl",
        )}
      >
        <span className="text-white">CA</span>
        <span className="text-brand-sage">PICKLE</span>
      </div>
      <p
        className={cn(
          "mt-2 text-xs text-text-secondary",
          hero ? "text-sm md:text-base" : "sr-only",
        )}
      >
        Your mobile first pickleball companion for live scores and tournaments
      </p>
    </div>
  );
}

