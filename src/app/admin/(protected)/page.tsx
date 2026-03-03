import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-base font-semibold">Dashboard</div>
        <div className="mt-1 text-sm text-white/70">
          Signed in as {user?.email ?? "unknown"}.
        </div>
      </Card>

      <div className="grid gap-3">
        <Link href="/admin/tournaments" className="block">
          <Card className="hover:border-white/15">
            <div className="text-sm font-semibold">Manage tournaments</div>
            <div className="mt-1 text-sm text-white/70">
              Create, edit, and delete tournaments.
            </div>
          </Card>
        </Link>
        <Link href="/admin/matches" className="block">
          <Card className="hover:border-white/15">
            <div className="text-sm font-semibold">Manage matches</div>
            <div className="mt-1 text-sm text-white/70">
              Enter scores and update match results.
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

