
-- Prevent usernames that differ only by case.
-- Examples: Zest, zest, ZEST.

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower_unique
ON users (LOWER(username));
