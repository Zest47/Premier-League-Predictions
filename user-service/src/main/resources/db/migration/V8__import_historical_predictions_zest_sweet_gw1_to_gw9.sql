-- V8: Import historical predictions for Zest and Sweet, GW1-GW9 (180 rows).
-- Source: user-provided epl-2026-GMTStandardTime(1).csv.
-- No match result changes. No deletions. Fails safely on missing users/matches or existing predictions.
-- Run as a Flyway PostgreSQL transactional migration after V7.

CREATE TEMP TABLE plp_historical_predictions (
  username VARCHAR(255) NOT NULL,
  gameweek INTEGER NOT NULL,
  home_team VARCHAR(100) NOT NULL,
  away_team VARCHAR(100) NOT NULL,
  predicted_home_score INTEGER NOT NULL,
  predicted_away_score INTEGER NOT NULL
) ON COMMIT DROP;

INSERT INTO plp_historical_predictions
(username, gameweek, home_team, away_team, predicted_home_score, predicted_away_score)
VALUES
  ('Zest', 1, 'Arsenal', 'Coventry City', 4, 1),
  ('Sweet', 1, 'Arsenal', 'Coventry City', 1, 1),
  ('Zest', 1, 'Hull City', 'Manchester United', 1, 3),
  ('Sweet', 1, 'Hull City', 'Manchester United', 1, 2),
  ('Zest', 1, 'Everton', 'Crystal Palace', 2, 1),
  ('Sweet', 1, 'Everton', 'Crystal Palace', 1, 0),
  ('Zest', 1, 'Ipswich Town', 'Sunderland', 1, 2),
  ('Sweet', 1, 'Ipswich Town', 'Sunderland', 1, 1),
  ('Zest', 1, 'Nottingham Forest', 'Leeds United', 1, 2),
  ('Sweet', 1, 'Nottingham Forest', 'Leeds United', 0, 1),
  ('Zest', 1, 'Brentford', 'Tottenham Hotspur', 1, 4),
  ('Sweet', 1, 'Brentford', 'Tottenham Hotspur', 2, 1),
  ('Zest', 1, 'Brighton & Hove Albion', 'Aston Villa', 0, 2),
  ('Sweet', 1, 'Brighton & Hove Albion', 'Aston Villa', 1, 0),
  ('Zest', 1, 'Manchester City', 'AFC Bournemouth', 3, 1),
  ('Sweet', 1, 'Manchester City', 'AFC Bournemouth', 3, 2),
  ('Zest', 1, 'Newcastle United', 'Liverpool', 1, 3),
  ('Sweet', 1, 'Newcastle United', 'Liverpool', 1, 2),
  ('Zest', 1, 'Fulham', 'Chelsea', 0, 2),
  ('Sweet', 1, 'Fulham', 'Chelsea', 1, 3),
  ('Zest', 2, 'Crystal Palace', 'Manchester City', 1, 2),
  ('Sweet', 2, 'Crystal Palace', 'Manchester City', 0, 2),
  ('Zest', 2, 'Liverpool', 'Nottingham Forest', 3, 1),
  ('Sweet', 2, 'Liverpool', 'Nottingham Forest', 2, 1),
  ('Zest', 2, 'AFC Bournemouth', 'Everton', 3, 1),
  ('Sweet', 2, 'AFC Bournemouth', 'Everton', 1, 2),
  ('Zest', 2, 'Coventry City', 'Hull City', 1, 2),
  ('Sweet', 2, 'Coventry City', 'Hull City', 2, 1),
  ('Zest', 2, 'Tottenham Hotspur', 'Newcastle United', 1, 3),
  ('Sweet', 2, 'Tottenham Hotspur', 'Newcastle United', 1, 2),
  ('Zest', 2, 'Chelsea', 'Brighton & Hove Albion', 4, 3),
  ('Sweet', 2, 'Chelsea', 'Brighton & Hove Albion', 2, 1),
  ('Zest', 2, 'Leeds United', 'Brentford', 0, 1),
  ('Sweet', 2, 'Leeds United', 'Brentford', 1, 1),
  ('Zest', 2, 'Sunderland', 'Fulham', 2, 1),
  ('Sweet', 2, 'Sunderland', 'Fulham', 1, 2),
  ('Zest', 2, 'Manchester United', 'Ipswich Town', 2, 0),
  ('Sweet', 2, 'Manchester United', 'Ipswich Town', 2, 2),
  ('Zest', 2, 'Aston Villa', 'Arsenal', 1, 4),
  ('Sweet', 2, 'Aston Villa', 'Arsenal', 1, 2),
  ('Zest', 3, 'Ipswich Town', 'Liverpool', 1, 4),
  ('Sweet', 3, 'Ipswich Town', 'Liverpool', 1, 3),
  ('Zest', 3, 'Newcastle United', 'AFC Bournemouth', 2, 1),
  ('Sweet', 3, 'Newcastle United', 'AFC Bournemouth', 2, 1),
  ('Zest', 3, 'Brentford', 'Sunderland', 1, 0),
  ('Sweet', 3, 'Brentford', 'Sunderland', 2, 1),
  ('Zest', 3, 'Brighton & Hove Albion', 'Leeds United', 3, 1),
  ('Sweet', 3, 'Brighton & Hove Albion', 'Leeds United', 1, 2),
  ('Zest', 3, 'Fulham', 'Crystal Palace', 1, 1),
  ('Sweet', 3, 'Fulham', 'Crystal Palace', 2, 1),
  ('Zest', 3, 'Manchester City', 'Coventry City', 4, 0),
  ('Sweet', 3, 'Manchester City', 'Coventry City', 3, 1),
  ('Zest', 3, 'Nottingham Forest', 'Tottenham Hotspur', 2, 1),
  ('Sweet', 3, 'Nottingham Forest', 'Tottenham Hotspur', 1, 0),
  ('Zest', 3, 'Hull City', 'Aston Villa', 1, 2),
  ('Sweet', 3, 'Hull City', 'Aston Villa', 2, 1),
  ('Zest', 3, 'Everton', 'Manchester United', 2, 2),
  ('Sweet', 3, 'Everton', 'Manchester United', 2, 2),
  ('Zest', 3, 'Arsenal', 'Chelsea', 4, 2),
  ('Sweet', 3, 'Arsenal', 'Chelsea', 1, 1),
  ('Zest', 4, 'AFC Bournemouth', 'Brentford', 2, 1),
  ('Sweet', 4, 'AFC Bournemouth', 'Brentford', 1, 1),
  ('Zest', 4, 'Aston Villa', 'Nottingham Forest', 3, 1),
  ('Sweet', 4, 'Aston Villa', 'Nottingham Forest', 2, 1),
  ('Zest', 4, 'Chelsea', 'Hull City', 4, 1),
  ('Sweet', 4, 'Chelsea', 'Hull City', 3, 1),
  ('Zest', 4, 'Crystal Palace', 'Ipswich Town', 2, 1),
  ('Sweet', 4, 'Crystal Palace', 'Ipswich Town', 2, 1),
  ('Zest', 4, 'Liverpool', 'Fulham', 3, 1),
  ('Sweet', 4, 'Liverpool', 'Fulham', 2, 1),
  ('Zest', 4, 'Tottenham Hotspur', 'Everton', 0, 1),
  ('Sweet', 4, 'Tottenham Hotspur', 'Everton', 1, 1),
  ('Zest', 4, 'Sunderland', 'Arsenal', 0, 2),
  ('Sweet', 4, 'Sunderland', 'Arsenal', 0, 1),
  ('Zest', 4, 'Coventry City', 'Brighton & Hove Albion', 1, 3),
  ('Sweet', 4, 'Coventry City', 'Brighton & Hove Albion', 1, 0),
  ('Zest', 4, 'Manchester United', 'Manchester City', 1, 4),
  ('Sweet', 4, 'Manchester United', 'Manchester City', 3, 2),
  ('Zest', 4, 'Leeds United', 'Newcastle United', 1, 1),
  ('Sweet', 4, 'Leeds United', 'Newcastle United', 1, 1),
  ('Zest', 5, 'Brentford', 'Chelsea', 1, 3),
  ('Sweet', 5, 'Brentford', 'Chelsea', 2, 3),
  ('Zest', 5, 'Tottenham Hotspur', 'Aston Villa', 2, 2),
  ('Sweet', 5, 'Tottenham Hotspur', 'Aston Villa', 1, 1),
  ('Zest', 5, 'Brighton & Hove Albion', 'Arsenal', 1, 2),
  ('Sweet', 5, 'Brighton & Hove Albion', 'Arsenal', 0, 1),
  ('Zest', 5, 'Everton', 'Ipswich Town', 1, 0),
  ('Sweet', 5, 'Everton', 'Ipswich Town', 3, 1),
  ('Zest', 5, 'Newcastle United', 'Hull City', 2, 1),
  ('Sweet', 5, 'Newcastle United', 'Hull City', 0, 2),
  ('Zest', 5, 'Nottingham Forest', 'Coventry City', 3, 0),
  ('Sweet', 5, 'Nottingham Forest', 'Coventry City', 2, 0),
  ('Zest', 5, 'AFC Bournemouth', 'Liverpool', 1, 3),
  ('Sweet', 5, 'AFC Bournemouth', 'Liverpool', 1, 3),
  ('Zest', 5, 'Leeds United', 'Crystal Palace', 2, 0),
  ('Sweet', 5, 'Leeds United', 'Crystal Palace', 1, 1),
  ('Zest', 5, 'Manchester City', 'Sunderland', 4, 1),
  ('Sweet', 5, 'Manchester City', 'Sunderland', 1, 0),
  ('Zest', 5, 'Fulham', 'Manchester United', 1, 1),
  ('Sweet', 5, 'Fulham', 'Manchester United', 2, 2),
  ('Zest', 6, 'Arsenal', 'Leeds United', 3, 1),
  ('Sweet', 6, 'Arsenal', 'Leeds United', 2, 1),
  ('Zest', 6, 'Aston Villa', 'Brentford', 1, 1),
  ('Sweet', 6, 'Aston Villa', 'Brentford', 1, 1),
  ('Zest', 6, 'Chelsea', 'AFC Bournemouth', 3, 2),
  ('Sweet', 6, 'Chelsea', 'AFC Bournemouth', 3, 2),
  ('Zest', 6, 'Ipswich Town', 'Fulham', 1, 2),
  ('Sweet', 6, 'Ipswich Town', 'Fulham', 1, 2),
  ('Zest', 6, 'Sunderland', 'Brighton & Hove Albion', 0, 3),
  ('Sweet', 6, 'Sunderland', 'Brighton & Hove Albion', 1, 1),
  ('Zest', 6, 'Manchester United', 'Tottenham Hotspur', 2, 1),
  ('Sweet', 6, 'Manchester United', 'Tottenham Hotspur', 1, 2),
  ('Zest', 6, 'Crystal Palace', 'Nottingham Forest', 2, 2),
  ('Sweet', 6, 'Crystal Palace', 'Nottingham Forest', 1, 1),
  ('Zest', 6, 'Hull City', 'Everton', 1, 1),
  ('Sweet', 6, 'Hull City', 'Everton', 1, 0),
  ('Zest', 6, 'Liverpool', 'Manchester City', 3, 1),
  ('Sweet', 6, 'Liverpool', 'Manchester City', 1, 1),
  ('Zest', 6, 'Coventry City', 'Newcastle United', 1, 4),
  ('Sweet', 6, 'Coventry City', 'Newcastle United', 1, 2),
  ('Zest', 7, 'Everton', 'Chelsea', 1, 4),
  ('Sweet', 7, 'Everton', 'Chelsea', 0, 2),
  ('Zest', 7, 'Brentford', 'Liverpool', 2, 2),
  ('Sweet', 7, 'Brentford', 'Liverpool', 1, 1),
  ('Zest', 7, 'Fulham', 'Hull City', 1, 2),
  ('Sweet', 7, 'Fulham', 'Hull City', 1, 2),
  ('Zest', 7, 'Manchester City', 'Ipswich Town', 5, 1),
  ('Sweet', 7, 'Manchester City', 'Ipswich Town', 3, 0),
  ('Zest', 7, 'Newcastle United', 'Aston Villa', 1, 3),
  ('Sweet', 7, 'Newcastle United', 'Aston Villa', 1, 3),
  ('Zest', 7, 'AFC Bournemouth', 'Sunderland', 1, 1),
  ('Sweet', 7, 'AFC Bournemouth', 'Sunderland', 1, 1),
  ('Zest', 7, 'Brighton & Hove Albion', 'Crystal Palace', 3, 1),
  ('Sweet', 7, 'Brighton & Hove Albion', 'Crystal Palace', 3, 1),
  ('Zest', 7, 'Leeds United', 'Manchester United', 3, 1),
  ('Sweet', 7, 'Leeds United', 'Manchester United', 2, 2),
  ('Zest', 7, 'Nottingham Forest', 'Arsenal', 0, 2),
  ('Sweet', 7, 'Nottingham Forest', 'Arsenal', 1, 2),
  ('Zest', 7, 'Tottenham Hotspur', 'Coventry City', 2, 1),
  ('Sweet', 7, 'Tottenham Hotspur', 'Coventry City', 1, 2),
  ('Zest', 8, 'Ipswich Town', 'Nottingham Forest', 1, 2),
  ('Sweet', 8, 'Ipswich Town', 'Nottingham Forest', 1, 1),
  ('Zest', 8, 'Aston Villa', 'Manchester City', 1, 2),
  ('Sweet', 8, 'Aston Villa', 'Manchester City', 0, 2),
  ('Zest', 8, 'Arsenal', 'Everton', 3, 1),
  ('Sweet', 8, 'Arsenal', 'Everton', 2, 1),
  ('Zest', 8, 'Coventry City', 'Fulham', 1, 2),
  ('Sweet', 8, 'Coventry City', 'Fulham', 1, 1),
  ('Zest', 8, 'Chelsea', 'Tottenham Hotspur', 4, 2),
  ('Sweet', 8, 'Chelsea', 'Tottenham Hotspur', 4, 1),
  ('Zest', 8, 'Crystal Palace', 'Newcastle United', 1, 1),
  ('Sweet', 8, 'Crystal Palace', 'Newcastle United', 1, 0),
  ('Zest', 8, 'Hull City', 'Brentford', 0, 2),
  ('Sweet', 8, 'Hull City', 'Brentford', 1, 1),
  ('Zest', 8, 'Liverpool', 'Brighton & Hove Albion', 3, 2),
  ('Sweet', 8, 'Liverpool', 'Brighton & Hove Albion', 2, 3),
  ('Zest', 8, 'Manchester United', 'AFC Bournemouth', 1, 3),
  ('Sweet', 8, 'Manchester United', 'AFC Bournemouth', 1, 3),
  ('Zest', 8, 'Sunderland', 'Leeds United', 2, 1),
  ('Sweet', 8, 'Sunderland', 'Leeds United', 1, 2),
  ('Zest', 9, 'Chelsea', 'Manchester United', 3, 1),
  ('Sweet', 9, 'Chelsea', 'Manchester United', 4, 2),
  ('Zest', 9, 'AFC Bournemouth', 'Leeds United', 2, 0),
  ('Sweet', 9, 'AFC Bournemouth', 'Leeds United', 2, 1),
  ('Zest', 9, 'Brentford', 'Nottingham Forest', 3, 1),
  ('Sweet', 9, 'Brentford', 'Nottingham Forest', 1, 0),
  ('Zest', 9, 'Coventry City', 'Sunderland', 1, 1),
  ('Sweet', 9, 'Coventry City', 'Sunderland', 2, 1),
  ('Zest', 9, 'Hull City', 'Ipswich Town', 1, 1),
  ('Sweet', 9, 'Hull City', 'Ipswich Town', 1, 1),
  ('Zest', 9, 'Manchester City', 'Brighton & Hove Albion', 1, 2),
  ('Sweet', 9, 'Manchester City', 'Brighton & Hove Albion', 3, 2),
  ('Zest', 9, 'Tottenham Hotspur', 'Crystal Palace', 2, 1),
  ('Sweet', 9, 'Tottenham Hotspur', 'Crystal Palace', 1, 1),
  ('Zest', 9, 'Aston Villa', 'Fulham', 3, 1),
  ('Sweet', 9, 'Aston Villa', 'Fulham', 3, 1),
  ('Zest', 9, 'Liverpool', 'Arsenal', 2, 1),
  ('Sweet', 9, 'Liverpool', 'Arsenal', 1, 2),
  ('Zest', 9, 'Newcastle United', 'Everton', 2, 0),
  ('Sweet', 9, 'Newcastle United', 'Everton', 2, 2);

DO $$
DECLARE
  mapped_count INTEGER;
  existing_count INTEGER;
BEGIN
  IF (SELECT COUNT(*) FROM plp_historical_predictions) <> 180
     OR (SELECT COUNT(*) FROM plp_historical_predictions WHERE username = 'Zest') <> 90
     OR (SELECT COUNT(*) FROM plp_historical_predictions WHERE username = 'Sweet') <> 90
     OR (SELECT COUNT(DISTINCT gameweek) FROM plp_historical_predictions) <> 9 THEN
    RAISE EXCEPTION 'V8: Expected 180 predictions, 90 per user, GW1-GW9';
  END IF;

  IF EXISTS (
    SELECT 1 FROM plp_historical_predictions
    GROUP BY username, gameweek, home_team, away_team HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'V8: Duplicate input prediction';
  END IF;

  IF (SELECT COUNT(*) FROM users WHERE username IN ('Zest', 'Sweet')) <> 2 THEN
    RAISE EXCEPTION 'V8: Both exact usernames Zest and Sweet must exist in users';
  END IF;

  IF EXISTS (
    SELECT 1 FROM plp_historical_predictions i
    LEFT JOIN teams ht ON ht.name = i.home_team
    LEFT JOIN teams at ON at.name = i.away_team
    WHERE ht.id IS NULL OR at.id IS NULL
  ) THEN
    RAISE EXCEPTION 'V8: Unknown team in CSV';
  END IF;

  SELECT COUNT(*) INTO mapped_count
  FROM plp_historical_predictions i
  JOIN teams ht ON ht.name = i.home_team
  JOIN teams at ON at.name = i.away_team
  JOIN matches m ON m.gameweek = i.gameweek AND m.home_team_id = ht.id AND m.away_team_id = at.id
  JOIN users u ON u.username = i.username;

  IF mapped_count <> 180 THEN
    RAISE EXCEPTION 'V8: Expected 180 unique mapped predictions, found %', mapped_count;
  END IF;

  SELECT COUNT(*) INTO existing_count
  FROM predictions p
  JOIN users u ON u.id = p.user_id
  JOIN matches m ON m.id = p.match_id
  WHERE u.username IN ('Zest', 'Sweet') AND m.gameweek BETWEEN 1 AND 9;

  IF existing_count > 0 THEN
    RAISE EXCEPTION 'V8: % existing predictions for Zest/Sweet GW1-GW9; refusing to overwrite', existing_count;
  END IF;
END $$;

INSERT INTO predictions
(user_id, match_id, predicted_home_score, predicted_away_score, created_at, updated_at)
SELECT u.id, m.id, i.predicted_home_score, i.predicted_away_score, NOW(), NOW()
FROM plp_historical_predictions i
JOIN users u ON u.username = i.username
JOIN teams ht ON ht.name = i.home_team
JOIN teams at ON at.name = i.away_team
JOIN matches m ON m.gameweek = i.gameweek AND m.home_team_id = ht.id AND m.away_team_id = at.id;

DO $$
BEGIN
  IF (SELECT COUNT(*) FROM predictions p JOIN users u ON u.id = p.user_id
      JOIN matches m ON m.id = p.match_id
      WHERE u.username IN ('Zest', 'Sweet') AND m.gameweek BETWEEN 1 AND 9) <> 180 THEN
    RAISE EXCEPTION 'V8: Post-insert verification failed';
  END IF;
END $$;
