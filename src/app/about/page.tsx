import { Container } from "@/components/Container";

export default function AboutPage() {
  return (
    <div className="bg-[#111111]">
      <Container className="flex min-h-dvh flex-col pb-24 pt-16">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl font-semibold text-white">About</h1>
        </header>

        <main className="mx-auto w-full max-w-2xl space-y-10 text-center sm:text-left">
          <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8FA98F]">
              About CaPickle
            </h2>
            <p className="text-sm leading-relaxed text-[#9CA3AF]">
              CaPickle is a mobile-first app built for the pickleball community.
              Track tournaments, follow live match scores, and stay connected to
              the game you love — courtside or from anywhere. Built by
              pickleball players, for pickleball players.
            </p>
          </section>

          <div className="h-px w-full bg-white/10" />

          <section className="space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8FA98F]">
              About 2vii Sports
            </h2>
            <p className="text-sm leading-relaxed text-[#9CA3AF]">
              2vii Sports is a family business born from a shared love of
              pickleball. Founded by Carolina Gonzalez, Timbo Slice, Miguel
              Proscia, and Victoria Marquez, 2vii Sports started with a simple
              idea — make the game better for everyone who plays it. From edge
              guards to grips, everything they build comes from real experience
              on the court. A family passion turned into a brand.
            </p>
          </section>
        </main>
      </Container>
    </div>
  );
}

