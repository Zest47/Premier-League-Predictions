-- Matchs fictifs pour tester prediction-service

INSERT INTO matches (
    gameweek,
    home_team_id,
    away_team_id,
    start_date,
    home_score,
    away_score,
    status
)
VALUES
(
    1,
    (SELECT id FROM teams WHERE name = 'Arsenal'),
    (SELECT id FROM teams WHERE name = 'Chelsea'),
    '2026-11-07 15:00:00+00',
    NULL,
    NULL,
    'SCHEDULED'
),
(
    1,
    (SELECT id FROM teams WHERE name = 'Liverpool'),
    (SELECT id FROM teams WHERE name = 'Manchester City'),
    '2026-11-07 17:30:00+00',
    NULL,
    NULL,
    'SCHEDULED'
),
(
    1,
    (SELECT id FROM teams WHERE name = 'Tottenham Hotspur'),
    (SELECT id FROM teams WHERE name = 'Manchester United'),
    '2026-11-08 16:30:00+00',
    NULL,
    NULL,
    'SCHEDULED'
),
(
    2,
    (SELECT id FROM teams WHERE name = 'Newcastle United'),
    (SELECT id FROM teams WHERE name = 'Arsenal'),
    '2026-11-14 15:00:00+00',
    NULL,
    NULL,
    'SCHEDULED'
);