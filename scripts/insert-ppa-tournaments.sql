-- Insert PPA tournament data into Supabase
-- Run this in the Supabase SQL Editor
--
-- NOTE: If matches.score1 and matches.score2 are INTEGER columns, alter them first:
--   ALTER TABLE matches ALTER COLUMN score1 TYPE text;
--   ALTER TABLE matches ALTER COLUMN score2 TYPE text;

WITH ins_tournaments AS (
  INSERT INTO tournaments (name, location, start_date, end_date, status)
  VALUES
    ('Carvana Mesa Cup', 'Mesa AZ', '2026-02-16', '2026-02-22', 'completed'),
    ('Zimmer Biomet Cape Coral Open', 'Cape Coral FL', '2026-02-09', '2026-02-15', 'completed')
  RETURNING id, name
),

mesa_cup AS (
  SELECT id FROM ins_tournaments WHERE name = 'Carvana Mesa Cup' LIMIT 1
),

cape_coral AS (
  SELECT id FROM ins_tournaments WHERE name = 'Zimmer Biomet Cape Coral Open' LIMIT 1
),

mesa_matches AS (
  INSERT INTO matches (tournament_id, draw, round, team1, team2, score1, score2, winner, match_date)
  SELECT mc.id, m.draw, m.round, m.team1, m.team2, m.score1, m.score2, m.winner, m.match_date
  FROM mesa_cup mc
  CROSS JOIN (
    VALUES
      ('Men''s Singles', 'Finals', 'Chris Haworth', 'Ben Johns', '11-6, 11-6', '6-11, 6-11', 'Chris Haworth', '2026-02-22'::timestamptz),
      ('Women''s Singles', 'Finals', 'Anna Leigh Waters', 'Kate Fahey', '11-3, 11-1', '3-11, 1-11', 'Anna Leigh Waters', '2026-02-22'::timestamptz),
      ('Men''s Doubles', 'Finals', 'Ben Johns / Gabe Tardio', 'Christian Alshon / Hayden Patriquin', '8-11, 11-6, 11-8, 13-11', '11-8, 6-11, 8-11, 11-13', 'Ben Johns / Gabe Tardio', '2026-02-22'::timestamptz),
      ('Women''s Doubles', 'Finals', 'Anna Leigh Waters / Anna Bright', 'Tyra Black / Jorja Johnson', '11-1, 11-7, 13-11', '1-11, 7-11, 11-13', 'Anna Leigh Waters / Anna Bright', '2026-02-22'::timestamptz),
      ('Mixed Doubles', 'Finals', 'Anna Bright / Hayden Patriquin', 'Anna Leigh Waters / Ben Johns', '11-9, 11-8, 11-3', '9-11, 8-11, 3-11', 'Anna Bright / Hayden Patriquin', '2026-02-22'::timestamptz)
  ) AS m(draw, round, team1, team2, score1, score2, winner, match_date)
  RETURNING id
),

cape_matches AS (
  INSERT INTO matches (tournament_id, draw, round, team1, team2, score1, score2, winner, match_date)
  SELECT cc.id, m.draw, m.round, m.team1, m.team2, m.score1, m.score2, m.winner, m.match_date
  FROM cape_coral cc
  CROSS JOIN (
    VALUES
      ('Men''s Doubles', 'Finals', 'Ben Johns / Gabe Tardio', 'JW Johnson / CJ Klinger', '11-8, 11-5, 11-9', '8-11, 5-11, 9-11', 'Ben Johns / Gabe Tardio', '2026-02-15'::timestamptz),
      ('Women''s Doubles', 'Finals', 'Anna Leigh Waters / Anna Bright', 'Jackie Kawamoto / Jade Kawamoto', '12-10, 11-3, 11-2', '10-12, 3-11, 2-11', 'Anna Leigh Waters / Anna Bright', '2026-02-15'::timestamptz),
      ('Mixed Doubles', 'Finals', 'Anna Leigh Waters / Ben Johns', 'Anna Bright / Hayden Patriquin', '11-7, 7-11, 11-7, 11-4', '7-11, 11-7, 7-11, 4-11', 'Anna Leigh Waters / Ben Johns', '2026-02-15'::timestamptz)
  ) AS m(draw, round, team1, team2, score1, score2, winner, match_date)
  RETURNING id
)

SELECT 'OK' AS result;
