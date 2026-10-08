
CREATE TABLE predictions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    match_id BIGINT NOT NULL,
    predicted_home_score INTEGER NOT NULL,
    predicted_away_score INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_predictions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_predictions_match
        FOREIGN KEY (match_id)
        REFERENCES matches(id)
        ON DELETE CASCADE,

    CONSTRAINT predictions_home_score_check
        CHECK (predicted_home_score >= 0),

    CONSTRAINT predictions_away_score_check
        CHECK (predicted_away_score >= 0),

    CONSTRAINT unique_user_match_prediction
        UNIQUE (user_id, match_id)
);

CREATE INDEX idx_predictions_match_id
    ON predictions(match_id);

CREATE INDEX idx_predictions_user_id
    ON predictions(user_id);
