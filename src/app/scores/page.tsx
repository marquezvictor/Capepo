"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { MatchScoreCard } from "@/components/MatchScoreCard";
import { Card } from "@/components/ui/Card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Match, Tournament } from "@/lib/db/types";
import { cn } from "@/lib/utils";

/** Format YYYY-MM-DD as "FEB 28", "MAR 1", etc. */
function formatDateKey(key: string): string {
  return new Date(key + "T12:00:00")
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

/** Extract date portion from match_date (ISO string) */
function matchDateKey(match: Match): string | null {
  const raw = match.match_date ?? match.created_at;
  if (!raw) return null;
  return new Date(raw).toISOString().slice(0, 10);
}

/** Sort matches within a tournament by round, then by match_date */
function sortMatchesByRound(a: Match, b: Match): number {
  const roundA = (a.round ?? "").toLowerCase();
  const roundB = (b.round ?? "").toLowerCase();
  if (roundA && roundB && roundA !== roundB) {
    const order = [
      "finals",
      "semifinals",
      "semis",
      "third place",
      "3rd place",
      "quarterfinals",
      "quarters",
      "round of 16",
      "round of 32",
      "round 4",
      "round 3",
      "round 2",
      "round 1",
    ];
    const idxA = order.findIndex((r) => roundA.includes(r));
    const idxB = order.findIndex((r) => roundB.includes(r));
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return roundA.localeCompare(roundB);
  }
  const da = new Date(a.match_date ?? a.created_at).getTime();
  const db = new Date(b.match_date ?? b.created_at).getTime();
  return da - db;
}

export default function ScoresPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournamentsById, setTournamentsById] = useState<
    Map<string, Tournament>
  >(new Map());

  const [selectedDateKey, setSelectedDateKey] = useState<string>("");

  /** Unique match dates from data, sorted oldest to newest */
  const dateTabs = useMemo(() => {
    const keys = new Set<string>();
    for (const m of matches) {
      const k = matchDateKey(m);
      if (k) keys.add(k);
    }
    return Array.from(keys).sort();
  }, [matches]);

  /** Auto-select most recent date when date tabs are available */
  useEffect(() => {
    if (dateTabs.length > 0) {
      setSelectedDateKey((prev) =>
        dateTabs.includes(prev) ? prev : dateTabs[dateTabs.length - 1],
      );
    }
  }, [dateTabs]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("match_date", { ascending: true });

      if (cancelled) return;
      if (error) {
        setError(error.message);
        setMatches([]);
      } else {
        const ms = (data ?? []) as Match[];
        setMatches(ms);

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

  const filteredByDate = useMemo(() => {
    return matches.filter((m) => matchDateKey(m) === selectedDateKey);
  }, [matches, selectedDateKey]);

  const groupedByTournament = useMemo(() => {
    const groups = new Map<string, Match[]>();
    for (const m of filteredByDate) {
      const tournament = tournamentsById.get(m.tournament_id);
      const name = tournament?.name ?? "Other";
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name)!.push(m);
    }
    for (const arr of groups.values()) {
      arr.sort(sortMatchesByRound);
    }
    return Array.from(groups.entries()).sort(([a], [b]) =>
      a.localeCompare(b),
    );
  }, [filteredByDate, tournamentsById]);

  const handleSelectDate = useCallback((key: string) => {
    setSelectedDateKey(key);
  }, []);

  return (
    <div className="min-h-dvh bg-[#111111]">
      <Container className="pt-8 pb-6">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="text-sm text-white/70">Scores</div>
        </div>
      </Container>

      {/* Sticky date tab bar - only when there are matches */}
      {dateTabs.length > 0 && (
        <div
          className="sticky top-0 z-40 border-b border-white/10 bg-[#1a1a1a]"
          style={{ scrollMarginTop: 0 }}
        >
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="flex min-w-max gap-2 px-4 py-3">
              {dateTabs.map((key) => {
                const isSelected = key === selectedDateKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectDate(key)}
                    className={cn(
                      "touch-manipulation whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      isSelected
                        ? "bg-[#8FA98F] text-white"
                        : "text-[#9ca3af] hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {formatDateKey(key)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <Container className="pb-24 pt-4">
        {loading ? (
          <Card>
            <div className="text-sm text-white/70">Loading matches…</div>
          </Card>
        ) : error ? (
          <Card>
            <div className="text-sm font-medium">Couldn&apos;t load scores</div>
            <div className="mt-2 text-sm text-white/70">{error}</div>
          </Card>
        ) : matches.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-sm text-[#9ca3af]">No matches yet</p>
          </div>
        ) : filteredByDate.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-sm text-[#9ca3af]">No matches on this date</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedByTournament.map(([tournamentName, tournamentMatches], idx) => (
              <section
                key={tournamentName}
                className={idx > 0 ? "border-t border-white/10 pt-4" : ""}
              >
                <h2 className="mb-3 text-sm font-bold text-white">
                  {tournamentName}
                </h2>
                <div className="space-y-3">
                  {tournamentMatches.map((m) => {
                    const tournament = tournamentsById.get(m.tournament_id);
                    return (
                      <MatchScoreCard
                        key={m.id}
                        match={m}
                        tournamentName={tournament?.name}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
