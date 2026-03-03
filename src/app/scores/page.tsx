"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Match } from "@/lib/db/types";

function formatWhen(m: Match) {
  const d = m.match_date ?? m.created_at;
  if (!d) return "";
  return new Date(d).toLocaleString();
}

export default function ScoresPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
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
        setMatches((data ?? []) as Match[]);
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
          filtered.map((m) => (
            <Card key={m.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {m.team1 ?? "Team 1"} vs {m.team2 ?? "Team 2"}
                  </div>
                  <div className="mt-1 text-xs text-white/60">
                    {formatWhen(m)}
                  </div>
                  {m.draw || m.round ? (
                    <div className="mt-2 text-xs text-white/60">
                      {[m.draw, m.round].filter(Boolean).join(" • ")}
                    </div>
                  ) : null}
                </div>
                <div className="shrink-0 text-sm font-semibold">
                  {(m.score1 ?? 0) + " - " + (m.score2 ?? 0)}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
}

