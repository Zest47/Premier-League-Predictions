package prediction_service.dto;

public record PredictionResultResponse(
        Long predictionId,
        Long matchId,
        Integer predictedHomeScore,
        Integer predictedAwayScore,
        Integer actualHomeScore,
        Integer actualAwayScore,
        String matchStatus,
        Integer points
) {}