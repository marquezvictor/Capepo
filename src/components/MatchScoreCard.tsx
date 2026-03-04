import { Card } from "@/components/ui/Card";
import type { Match } from "@/lib/db/types";
import { cn } from "@/lib/utils";

type MatchScoreCardProps = {
  match: Match;
  tournamentName?: string | null;
};

/** Match with score fields that may be number or string (legacy vs newer formats). */
type MatchWithFlexibleScores = Omit<Match, "score1" | "score2"> & {
  score1?: number | string | null;
  score2?: number | string | null;
};

type GameColumn = {
  team1?: string;
  team2?: string;
};

function formatMatchDate(m: Match) {
  const d = m.match_date ?? m.created_at;
  if (!d) return "";
  return new Date(d).toLocaleString();
}

function parseSideScores(raw: unknown): string[] {
  if (raw === null || raw === undefined) return [];
  const s = String(raw).trim();
  if (!s) return [];
  // If this is a simple number, just return it
  if (/^\d+$/.test(s)) return [s];

  // If comma separated values like "11, 9, 11"
  if (s.includes(",")) {
    return s
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  // Fallback – treat the whole thing as a single entry
  return [s];
}

function parseMatchScores(score1Raw: unknown, score2Raw: unknown): GameColumn[] {
  const s1 = score1Raw === null || score1Raw === undefined ? "" : String(score1Raw).trim();
  const s2 = score2Raw === null || score2Raw === undefined ? "" : String(score2Raw).trim();

  // Case 1: combined notation like "11-8, 11-6, 9-11"
  if (s1.includes("-")) {
    const games = s1
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    return games.map((g) => {
      const [a, b] = g.split("-").map((p) => p.trim());
      return {
        team1: a || undefined,
        team2: b || undefined,
      };
    });
  }

  // Case 2: separate side notation, numbers or comma-separated
  const team1Games = parseSideScores(s1);
  const team2Games = parseSideScores(s2);

  const length = Math.max(team1Games.length, team2Games.length);
  const cols: GameColumn[] = [];
  for (let i = 0; i < length; i++) {
    cols.push({
      team1: team1Games[i],
      team2: team2Games[i],
    });
  }
  return cols;
}

export function MatchScoreCard({ match, tournamentName }: MatchScoreCardProps) {
  const team1 = match.team1 ?? "Team 1";
  const team2 = match.team2 ?? "Team 2";

  const winner = (match.winner ?? "").trim();
  const isWinner1 = winner && winner === team1;
  const isWinner2 = winner && winner === team2;

  const matchScores = match as MatchWithFlexibleScores;
  const gameColumns = parseMatchScores(
    // Support both legacy numeric scores and newer string formats
    matchScores.score1 ?? match.score1,
    matchScores.score2 ?? match.score2,
  );

  const drawLabel = (match.draw ?? "").trim();
  const tournamentLabel = (tournamentName ?? "").trim();
  const metaLine =
    drawLabel && tournamentLabel
      ? `${drawLabel} • ${tournamentLabel}`
      : drawLabel || tournamentLabel || "";

  const dateText = formatMatchDate(match);

  return (
    <Card className="bg-[#1e1e1e]">
      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          {/* Team 1 row */}
          <div
            className={cn(
              "flex items-center justify-between gap-4",
              !winner && "text-white",
            )}
          >
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  "truncate text-sm font-semibold",
                  isWinner1 ? "text-white" : "text-text-secondary",
                )}
              >
                {team1}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "grid auto-cols-min grid-flow-col gap-1 text-sm font-inter",
                  isWinner1 ? "text-white" : "text-text-secondary",
                )}
              >
                {gameColumns.map((g, idx) => (
                  <div
                    key={idx}
                    className="min-w-[2.25rem] rounded-md border border-white/10 px-2 py-1 text-left"
                  >
                    {g.team1 ?? ""}
                  </div>
                ))}
              </div>
              {isWinner1 && (
                <div className="h-0 w-0 border-y-4 border-y-transparent border-l-4 border-l-emerald-400" />
              )}
            </div>
          </div>

          {/* Team 2 row */}
          <div
            className={cn(
              "flex items-center justify-between gap-4",
              !winner && "text-white",
            )}
          >
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  "truncate text-sm font-semibold",
                  isWinner2 ? "text-white" : "text-text-secondary",
                )}
              >
                {team2}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "grid auto-cols-min grid-flow-col gap-1 text-sm font-inter",
                  isWinner2 ? "text-white" : "text-text-secondary",
                )}
              >
                {gameColumns.map((g, idx) => (
                  <div
                    key={idx}
                    className="min-w-[2.25rem] rounded-md border border-white/10 px-2 py-1 text-left"
                  >
                    {g.team2 ?? ""}
                  </div>
                ))}
              </div>
              {isWinner2 && (
                <div className="h-0 w-0 border-y-4 border-y-transparent border-l-4 border-l-emerald-400" />
              )}
            </div>
          </div>
        </div>

        {(metaLine || dateText) && (
          <div className="mt-2 space-y-1 text-xs text-text-secondary">
            {metaLine && <div>{metaLine}</div>}
            {dateText && <div className="text-[11px]">{dateText}</div>}
          </div>
        )}
      </div>
    </Card>
  );
}

