"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Container } from "@/components/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Match, Tournament } from "@/lib/db/types";

function scoreLine(m: Match) {
  const s1 = m.score1 ?? 0;
  const s2 = m.score2 ?? 0;
  return `${s1} - ${s2}`;
}

function formatMatchDate(m: Match) {
  const d = m.match_date ?? m.created_at;
  if (!d) return "";
  return new Date(d).toLocaleString();
}

type Grouped = Array<{
  draw: string;
  rounds: Array<{ round: string; matches: Match[] }>;
}>;

function groupMatches(matches: Match[]): Grouped {
  const byDraw = new Map<string, Match[]>();
  for (const m of matches) {
    const draw = (m.draw ?? "Main").trim() || "Main";
    byDraw.set(draw, [...(byDraw.get(draw) ?? []), m]);
  }

  const draws = Array.from(byDraw.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return draws.map(([draw, ms]) => {
    const byRound = new Map<string, Match[]>();
    for (const m of ms) {
      const round = (m.round ?? "Round").trim() || "Round";
      byRound.set(round, [...(byRound.get(round) ?? []), m]);
    }
    const rounds = Array.from(byRound.entries()).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    return {
      draw,
      rounds: rounds.map(([round, rms]) => ({
        round,
        matches: [...rms].sort((a, b) => {
          const da = new Date(a.match_date ?? a.created_at).getTime();
          const db = new Date(b.match_date ?? b.created_at).getTime();
          return db - da;
        }),
      })),
    };
  });
}

export default function TournamentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      const supabase = createSupabaseBrowserClient();

      const [tRes, mRes] = await Promise.all([
        supabase.from("tournaments").select("*").eq("id", id).single(),
        supabase
          .from("matches")
          .select("*")
          .eq("tournament_id", id)
          .order("match_date", { ascending: false }),
      ]);

      if (cancelled) return;

      if (tRes.error) {
        setError(tRes.error.message);
        setTournament(null);
        setMatches([]);
      } else {
        setTournament((tRes.data ?? null) as Tournament | null);
        if (mRes.error) {
          setError(mRes.error.message);
          setMatches([]);
        } else {
          setMatches((mRes.data ?? []) as Match[]);
        }
      }

      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const grouped = useMemo(() => groupMatches(matches), [matches]);

  if (loading) {
    return (
      <Container className="pt-8">
        <Card>
          <div className="text-sm text-white/70">Loading tournament…</div>
        </Card>
      </Container>
    );
  }

  if (error || !tournament) {
    return (
      <Container className="pt-8">
        <Card>
          <div className="text-sm font-medium">Couldn’t load tournament</div>
          <div className="mt-2 text-sm text-white/70">
            {error ?? "Not found"}
          </div>
          <div className="mt-4">
            <ButtonLink href="/tournaments" variant="ghost" className="w-full">
              Back to tournaments
            </ButtonLink>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="pt-8">
      <div className="flex items-center justify-between">
        <Link href="/tournaments" className="text-sm text-white/70">
          ← Tournaments
        </Link>
        <StatusBadge status={tournament.status ?? "upcoming"} />
      </div>

      <div className="mt-4">
        <div className="text-2xl font-semibold tracking-tight">
          {tournament.name}
        </div>
        {tournament.location ? (
          <div className="mt-1 text-sm text-white/70">
            {tournament.location}
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        {grouped.length === 0 ? (
          <Card>
            <div className="text-sm text-white/70">No matches yet.</div>
          </Card>
        ) : (
          grouped.map((d) => (
            <div key={d.draw} className="space-y-3">
              <div className="text-sm font-semibold text-white/90">
                {d.draw}
              </div>
              {d.rounds.map((r) => (
                <Card key={r.round}>
                  <div className="text-sm font-medium">{r.round}</div>
                  <div className="mt-3 space-y-3">
                    {r.matches.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-start justify-between gap-3 border-t border-white/10 pt-3 first:border-t-0 first:pt-0"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {m.team1 ?? "Team 1"} vs {m.team2 ?? "Team 2"}
                          </div>
                          <div className="mt-1 text-xs text-white/60">
                            {formatMatchDate(m)}
                          </div>
                        </div>
                        <div className="shrink-0 text-sm font-semibold">
                          {scoreLine(m)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ))
        )}
      </div>
    </Container>
  );
}

