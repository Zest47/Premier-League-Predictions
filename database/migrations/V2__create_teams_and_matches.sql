
CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE matches (
    id BIGSERIAL PRIMARY KEY,
    gameweek INTEGER NOT NULL,
    home_team_id BIGINT NOT NULL,
    away_team_id BIGINT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    home_score INTEGER,
    away_score INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',

    CONSTRAINT fk_matches_home_team
        FOREIGN KEY (home_team_id)
        REFERENCES teams(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_matches_away_team
        FOREIGN KEY (away_team_id)
        REFERENCES teams(id)
        ON DELETE RESTRICT,

    CONSTRAINT matches_different_teams_check
        CHECK (home_team_id <> away_team_id),

    CONSTRAINT matches_gameweek_check
        CHECK (gameweek > 0),

    CONSTRAINT matches_home_score_check
        CHECK (home_score IS NULL OR home_score >= 0),

    CONSTRAINT matches_away_score_check
        CHECK (away_score IS NULL OR away_score >= 0),

    CONSTRAINT matches_status_check
        CHECK (
            status IN (
                'SCHEDULED',
                'LIVE',
                'FINISHED',
                'POSTPONED',
                'CANCELLED'
            )
        )
);

CREATE INDEX idx_matches_start_date
    ON matches(start_date);

CREATE INDEX idx_matches_gameweek
    ON matches(gameweek);

CREATE INDEX idx_matches_home_team
    ON matches(home_team_id);

CREATE INDEX idx_matches_away_team
    ON matches(away_team_id);
