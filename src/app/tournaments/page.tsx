"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Tournament } from "@/lib/db/types";

function formatDateRange(t: Tournament) {
  const start = t.start_date ? new Date(t.start_date) : null;
  const end = t.end_date ? new Date(t.end_date) : null;
  if (!start && !end) return "Date TBD";
  if (start && !end) return start.toLocaleDateString();
  if (!start && end) return end.toLocaleDateString();
  if (start && end) {
    const s = start.toLocaleDateString();
    const e = end.toLocaleDateString();
    return s === e ? s : `${s} – ${e}`;
  }
  return "Date TBD";
}

export default function TournamentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError(null);
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("start_date", { ascending: true });

      if (cancelled) return;
      if (error) {
        setError(error.message);
        setTournaments([]);
      } else {
        setTournaments((data ?? []) as Tournament[]);
      }
      setLoading(false);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <Card>
          <div className="text-sm text-white/70">Loading tournaments…</div>
        </Card>
      );
    }

    if (error) {
      return (
        <Card>
          <div className="text-sm font-medium">Couldn’t load tournaments</div>
          <div className="mt-2 text-sm text-white/70">{error}</div>
        </Card>
      );
    }

    if (tournaments.length === 0) {
      return (
        <Card>
          <div className="text-sm text-white/70">No tournaments yet.</div>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {tournaments.map((t) => (
          <Link key={t.id} href={`/tournaments/${t.id}`} className="block">
            <Card className="hover:border-white/15">
              <div className="mb-3 flex items-center justify-between text-[11px]">
                <span className="uppercase tracking-[0.16em] text-[#9CA3AF]">
                  Official Sponsor
                </span>
                <span className="font-semibold text-[#8FA98F]">
                  2vii Sports
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold leading-tight">
                    {t.name}
                  </div>
                  <div className="mt-1 text-sm text-white/70">
                    {formatDateRange(t)}
                  </div>
                  {t.location ? (
                    <div className="mt-1 text-sm text-white/70">
                      {t.location}
                    </div>
                  ) : null}
                </div>
                <StatusBadge status={t.status ?? "upcoming"} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    );
  }, [error, loading, tournaments]);

  return (
    <Container className="pt-8">
      <div className="flex items-center justify-between">
        <Logo />
        <div className="text-sm text-white/70">Tournaments</div>
      </div>

      <div className="mt-6">{content}</div>
    </Container>
  );
}

