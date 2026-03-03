import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tournament, TournamentStatus } from "@/lib/db/types";

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export default async function AdminTournamentsPage({
  searchParams,
}: {
  searchParams?: { error?: string; success?: string };
}) {
  const supabase = await requireUser();

  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: false });

  const tournaments = (data ?? []) as Tournament[];

  async function createTournament(formData: FormData) {
    "use server";
    const supabase = await requireUser();
    const name = String(formData.get("name") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim() || null;
    const start_date = String(formData.get("start_date") ?? "").trim() || null;
    const end_date = String(formData.get("end_date") ?? "").trim() || null;
    const status = String(formData.get("status") ?? "upcoming").trim();

    const { error } = await supabase.from("tournaments").insert({
      name,
      location,
      start_date,
      end_date,
      status,
    });

    if (error) {
      redirect(
        `/admin/tournaments?error=${encodeURIComponent(error.message)}`,
      );
    }
    revalidatePath("/admin/tournaments");
    redirect("/admin/tournaments?success=Created");
  }

  async function updateTournament(formData: FormData) {
    "use server";
    const supabase = await requireUser();
    const id = String(formData.get("id") ?? "");
    const name = String(formData.get("name") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim() || null;
    const start_date = String(formData.get("start_date") ?? "").trim() || null;
    const end_date = String(formData.get("end_date") ?? "").trim() || null;
    const status = String(formData.get("status") ?? "upcoming").trim();

    const { error } = await supabase
      .from("tournaments")
      .update({ name, location, start_date, end_date, status })
      .eq("id", id);

    if (error) {
      redirect(
        `/admin/tournaments?error=${encodeURIComponent(error.message)}`,
      );
    }
    revalidatePath("/admin/tournaments");
    redirect("/admin/tournaments?success=Updated");
  }

  async function deleteTournament(formData: FormData) {
    "use server";
    const supabase = await requireUser();
    const id = String(formData.get("id") ?? "");

    const { error } = await supabase.from("tournaments").delete().eq("id", id);
    if (error) {
      redirect(
        `/admin/tournaments?error=${encodeURIComponent(error.message)}`,
      );
    }
    revalidatePath("/admin/tournaments");
    redirect("/admin/tournaments?success=Deleted");
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-base font-semibold">Tournaments</div>
        <div className="mt-1 text-sm text-white/70">
          Create, edit, and delete tournaments.
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
        <div className="text-sm font-semibold">Create tournament</div>
        <form action={createTournament} className="mt-4 space-y-3">
          <div className="space-y-2">
            <label className="text-xs text-white/70">Name</label>
            <Input name="name" placeholder="Spring Classic" required />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-white/70">Location</label>
            <Input name="location" placeholder="Austin, TX" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-white/70">Start date</label>
              <Input name="start_date" type="date" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/70">End date</label>
              <Input name="end_date" type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-white/70">Status</label>
            <select
              name="status"
              defaultValue="upcoming"
              className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-brand-sage/60 focus:ring-2 focus:ring-brand-sage/25"
            >
              {(["upcoming", "active", "completed"] as TournamentStatus[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ),
              )}
            </select>
          </div>
          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </Card>

      <Card>
        <div className="text-sm font-semibold">Existing tournaments</div>
        {error ? (
          <div className="mt-3 text-sm text-red-200">
            Failed to load tournaments: {error.message}
          </div>
        ) : tournaments.length === 0 ? (
          <div className="mt-3 text-sm text-white/70">No tournaments yet.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {tournaments.map((t) => (
              <Card key={t.id} className="p-3">
                <div className="space-y-3">
                  <form action={updateTournament} className="space-y-3">
                    <input type="hidden" name="id" value={t.id} />
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs text-white/70">Name</label>
                        <Input name="name" defaultValue={t.name} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-white/70">Location</label>
                        <Input
                          name="location"
                          defaultValue={t.location ?? ""}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-xs text-white/70">
                            Start date
                          </label>
                          <Input
                            name="start_date"
                            type="date"
                            defaultValue={t.start_date ?? ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-white/70">
                            End date
                          </label>
                          <Input
                            name="end_date"
                            type="date"
                            defaultValue={t.end_date ?? ""}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-white/70">Status</label>
                        <select
                          name="status"
                          defaultValue={t.status ?? "upcoming"}
                          className="h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-brand-sage/60 focus:ring-2 focus:ring-brand-sage/25"
                        >
                          {(
                            ["upcoming", "active", "completed"] as TournamentStatus[]
                          ).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Save
                    </Button>
                  </form>

                  <form action={deleteTournament}>
                    <input type="hidden" name="id" value={t.id} />
                    <Button type="submit" variant="danger" className="w-full">
                      Delete
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

