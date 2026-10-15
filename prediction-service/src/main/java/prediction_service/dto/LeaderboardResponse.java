package prediction_service.dto;

public record LeaderboardResponse(
        int rank,
        Long userId,
        int totalPoints,
        int exactScores,
        int correctResults,
        int predictionsCount
) {}