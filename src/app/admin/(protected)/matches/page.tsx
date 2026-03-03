import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Match, Tournament } from "@/lib/db/types";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export default async function AdminMatchesPage({
  searchParams,
}: {
  searchParams?: { error?: string; success?: string };
}) {
  const supabase = await requireUser();

  const [{ data: tournamentsData }, { data: matchesData, error: matchesError }] =
    await Promise.all([
      supabase.from("tournaments").select("*").order("start_date", {
        ascending: false,
      }),
      supabase
        .from("matches")
        .select("*")
        .order("match_date", { ascending: false })
        .limit(200),
    ]);

  const tournaments = (tournamentsData ?? []) as Tournament[];
  const tournamentNameById = new Map(
    tournaments.map((t) => [t.id, t.name] as const),
  );
  const matches = (matchesData ?? []) as Match[];

  async function createMatch(formData: FormData) {
    "use server";
    const supabase = await requireUser();

    const tournament_id = String(formData.get("tournament_id") ?? "").trim();
    const draw = String(formData.get("draw") ?? "").trim() || null;
    const round = String(formData.get("round") ?? "").trim() || null;
    const team1 = String(formData.get("team1") ?? "").trim() || null;
    const team2 = String(formData.get("team2") ?? "").trim() || null;
    const score1Raw = String(formData.get("score1") ?? "").trim();
    const score2Raw = String(formData.get("score2") ?? "").trim();
    const score1 = score1Raw === "" ? null : Number(score1Raw);
    const score2 = score2Raw === "" ? null : Number(score2Raw);
    const winnerChoice = String(formData.get("winner_choice") ?? "").trim();
    const winner =
      winnerChoice === "team1"
        ? team1
        : winnerChoice === "team2"
          ? team2
          : null;
    const match_date = String(formData.get("match_date") ?? "").trim() || null;

    const { error } = await supabase.from("matches").insert({
      tournament_id,
      draw,
      round,
      team1,
      team2,
      score1,
      score2,
      winner,
      match_date,
    });

    if (error) {
      redirect(`/admin/matches?error=${encodeURIComponent(error.message)}`);
    }
    revalidatePath("/admin/matches");
    redirect("/admin/matches?success=Created");
  }

  async function updateMatch(formData: FormData) {
    "use server";
    const supabase = await requireUser();

    const id = String(formData.get("id") ?? "").trim();
    const tournament_id = String(formData.get("tournament_id") ?? "").trim();
    const draw = String(formData.get("draw") ?? "").trim() || null;
    const round = String(formData.get("round") ?? "").trim() || null;
    const team1 = String(formData.get("team1") ?? "").trim() || null;
    const team2 = String(formData.get("team2") ?? "").trim() || null;
    const score1Raw = String(formData.get("score1") ?? "").trim();
    const score2Raw = String(formData.get("score2") ?? "").trim();
    const score1 = score1Raw === "" ? null : Number(score1Raw);
    const score2 = score2Raw === "" ? null : Number(score2Raw);
    const winnerChoice = String(formData.get("winner_choice") ?? "").trim();
    const winner =
      winnerChoice === "team1"
        ? team1
        : winnerChoice === "team2"
          ? team2
          : null;
    const match_date = String(formData.get("match_date") ?? "").trim() || null;

    const { error } = await supabase
      .from("matches")
      .update({
        tournament_id,
        draw,
        round,
        team1,
        team2,
        score1,
        score2,
        winner,
        match_date,
      })
      .eq("id", id);

    if (error) {
      redirect(`/admin/matches?error=${encodeURIComponent(error.message)}`);
    }
    revalidatePath("/admin/matches");
    redirect("/admin/matches?success=Updated");
  }

  async function deleteMatch(formData: FormData) {
    "use server";
    const supabase = await requireUser();
    const id = String(formData.get("id") ?? "").trim();

    const { error } = await supabase.from("matches").delete().eq("id", id);
    if (error) {
      redirect(`/admin/matches?error=${encodeURIComponent(error.message)}`);
    }
    revalidatePath("/admin/matches");
    redirect("/admin/matches?success=Deleted");
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-base font-semibold">Matches</div>
        <div className="mt-1 text-sm text-white/70">
          Enter scores and update match results.
        </div>
      </Card>

      {searchParams?.error ? (
        <Card className="border-red-500/25">
          <div className="text-sm font-medium text-red-200">Error</div>
          <div className="mt-1 text-sm text-red-200/80">
            {searchParams.error}
          </div>
        </Card>
      ) : null}
      {searchParams?.success ? (
        <Card className="border-brand-sage/30">
          <div className="text-sm font-medium text-white">Done</div>
          <div className="mt-1 text-sm text-white/70">
            {searchParams.success}
          </div>
        </Card>
      ) : null}

      <Card>
        <div className="text-sm font-semibold">Add match</div>
        <form action={createMatch} className="mt-4 space-y-3">
          <div className="space-y-2">
            <label className="text-xs text-white/70">Tournament</label>
            <select
              name="tournament_id"
              required
              defaultValue=""
              className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-brand-sage/60 focus:ring-2 focus:ring-brand-sage/25"
            >
              <option value="" disabled>
                Select…
              </option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-white/70">Draw</label>
              <Input name="draw" placeholder="Open" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/70">Round</label>
              <Input name="round" placeholder="Quarterfinal" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/70">Team 1</label>
            <Input name="team1" placeholder="Player A / Player B" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-white/70">Team 2</label>
            <Input name="team2" placeholder="Player C / Player D" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-white/70">Score 1</label>
              <Input name="score1" type="number" inputMode="numeric" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/70">Score 2</label>
              <Input name="score2" type="number" inputMode="numeric" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-white/70">Winner</label>
              <select
                name="winner_choice"
                defaultValue=""
                className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-brand-sage/60 focus:ring-2 focus:ring-brand-sage/25"
              >
                <option value="">TBD</option>
                <option value="team1">Team 1</option>
                <option value="team2">Team 2</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/70">Match date</label>
              <Input name="match_date" type="datetime-local" />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save match
          </Button>
        </form>
      </Card>

      <Card>
        <div className="text-sm font-semibold">Existing matches</div>
        {matchesError ? (
          <div className="mt-3 text-sm text-red-200">
            Failed to load matches: {matchesError.message}
          </div>
        ) : matches.length === 0 ? (
          <div className="mt-3 text-sm text-white/70">No matches yet.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {matches.map((m) => {
              const winnerChoice =
                m.winner && m.winner === m.team2
                  ? "team2"
                  : m.winner && m.winner === m.team1
                    ? "team1"
                    : "";
              const matchDateValue = m.match_date
                ? new Date(m.match_date).toISOString().slice(0, 16)
                : "";
              return (
                <Card key={m.id} className="p-3">
                  <div className="text-xs text-white/60">
                    {tournamentNameById.get(m.tournament_id) ??
                      m.tournament_id}
                  </div>
                  <div className="mt-1 text-sm font-semibold">
                    {m.team1 ?? "Team 1"} vs {m.team2 ?? "Team 2"}
                  </div>

                  <div className="mt-3 space-y-3">
                    <form action={updateMatch} className="space-y-3">
                      <input type="hidden" name="id" value={m.id} />
                      <div className="space-y-2">
                        <label className="text-xs text-white/70">
                          Tournament
                        </label>
                        <select
                          name="tournament_id"
                          defaultValue={m.tournament_id}
                          required
                          className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-brand-sage/60 focus:ring-2 focus:ring-brand-sage/25"
                        >
                          {tournaments.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-xs text-white/70">Draw</label>
                          <Input name="draw" defaultValue={m.draw ?? ""} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-white/70">Round</label>
                          <Input name="round" defaultValue={m.round ?? ""} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-white/70">Team 1</label>
                        <Input
                          name="team1"
                          defaultValue={m.team1 ?? ""}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-white/70">Team 2</label>
                        <Input
                          name="team2"
                          defaultValue={m.team2 ?? ""}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-xs text-white/70">Score 1</label>
                          <Input
                            name="score1"
                            type="number"
                            defaultValue={m.score1 ?? ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-white/70">Score 2</label>
                          <Input
                            name="score2"
                            type="number"
                            defaultValue={m.score2 ?? ""}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-xs text-white/70">Winner</label>
                          <select
                            name="winner_choice"
                            defaultValue={winnerChoice}
                            className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-brand-sage/60 focus:ring-2 focus:ring-brand-sage/25"
                          >
                            <option value="">TBD</option>
                            <option value="team1">Team 1</option>
                            <option value="team2">Team 2</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-white/70">
                            Match date
                          </label>
                          <Input
                            name="match_date"
                            type="datetime-local"
                            defaultValue={matchDateValue}
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        Update
                      </Button>
                    </form>

                    <form action={deleteMatch}>
                      <input type="hidden" name="id" value={m.id} />
                      <Button type="submit" variant="danger" className="w-full">
                        Delete
                      </Button>
                    </form>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

