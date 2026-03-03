import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-black via-[#111111] to-[#111111]">
      <Container className="flex min-h-dvh flex-col pb-24 pt-16 text-center">
        <div className="flex flex-1 flex-col items-center justify-center">
          <Logo hero className="mx-auto" />

          <div className="mt-10 max-w-md space-y-3">
            <p className="text-sm text-text-secondary">
              Track tournaments, follow matches, and share scores in real time —
              built mobile-first for courtside.
            </p>
          </div>

          <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
            <ButtonLink href="/tournaments" className="h-11 w-full text-sm">
              Get Started
            </ButtonLink>
            <ButtonLink
              href="/about"
              variant="outline"
              className="h-11 w-full text-sm"
            >
              About
            </ButtonLink>
          </div>
        </div>

        <div className="mt-8 w-full">
          <div className="h-px w-full bg-white/10" />
          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#9CA3AF]">
              POWERED BY
            </span>
            <div className="text-sm font-semibold">
              <span className="text-white">2vii</span>{" "}
              <span className="text-[#8FA98F]">Sports</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
