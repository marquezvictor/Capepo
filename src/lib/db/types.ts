export type TournamentStatus = "upcoming" | "active" | "completed" | string;

export type Tournament = {
  id: string;
  name: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  status: TournamentStatus | null;
  created_at: string;
};

export type Match = {
  id: string;
  tournament_id: string;
  draw: string | null;
  round: string | null;
  team1: string | null;
  team2: string | null;
  score1: number | null;
  score2: number | null;
  winner: string | null;
  match_date: string | null;
  created_at: string;
};

