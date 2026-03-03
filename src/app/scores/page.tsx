"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { MatchScoreCard } from "@/components/MatchScoreCard";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Match, Tournament } from "@/lib/db/types";

export default function ScoresPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournamentsById, setTournamentsById] = useState<
    Map<string, Tournament>
  >(new Map());
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("match_date", { ascending: false })
        .limit(100);

      if (cancelled) return;
      if (error) {
        setError(error.message);
        setMatches([]);
      } else {
        const ms = (data ?? []) as Match[];
        setMatches(ms);

        // Fetch tournaments for the loaded matches so we can show tournament names
        const uniqueTournamentIds = Array.from(
          new Set(ms.map((m) => m.tournament_id).filter(Boolean)),
        ) as string[];

        if (uniqueTournamentIds.length > 0) {
          const { data: tournamentsData } = await supabase
            .from("tournaments")
            .select("*")
            .in("id", uniqueTournamentIds);

          const tournaments = (tournamentsData ?? []) as Tournament[];
          setTournamentsById(
            new Map(tournaments.map((t) => [t.id, t] as const)),
          );
        } else {
          setTournamentsById(new Map());
        }
      }
      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return matches;
    return matches.filter((m) => {
      const a = (m.team1 ?? "").toLowerCase();
      const b = (m.team2 ?? "").toLowerCase();
      return a.includes(q) || b.includes(q);
    });
  }, [matches, query]);

  return (
    <Container className="pt-8">
      <div className="flex items-center justify-between">
        <Logo />
        <div className="text-sm text-white/70">Scores</div>
      </div>

      <div className="mt-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by player name…"
        />
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <Card>
            <div className="text-sm text-white/70">Loading recent matches…</div>
          </Card>
        ) : error ? (
          <Card>
            <div className="text-sm font-medium">Couldn’t load scores</div>
            <div className="mt-2 text-sm text-white/70">{error}</div>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <div className="text-sm text-white/70">No matches found.</div>
          </Card>
        ) : (
          filtered.map((m) => {
            const tournament = tournamentsById.get(m.tournament_id);
            return (
              <div key={m.id} className="space-y-2">
                {m.round ? (
                  <div className="inline-flex items-center gap-2 rounded-full border-l-2 border-brand-sage/80 pl-2 text-[11px] font-medium uppercase tracking-wide text-text-secondary">
                    {m.round}
                  </div>
                ) : null}
                <MatchScoreCard match={m} tournamentName={tournament?.name} />
              </div>
            );
          })
        )}
      </div>
    </Container>
  );
}

