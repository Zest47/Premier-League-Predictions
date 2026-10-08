package prediction_service.dto;

import prediction_service.entity.Prediction;
import java.time.OffsetDateTime;

public record PredictionResponse(
        Long id,
        Long userId,
        Long matchId,
        Integer predictedHomeScore,
        Integer predictedAwayScore,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public PredictionResponse(Prediction prediction) {
        this(
                prediction.getId(),
                prediction.getUserId(),
                prediction.getMatch().getId(),
                prediction.getPredictedHomeScore(),
                prediction.getPredictedAwayScore(),
                prediction.getCreatedAt(),
                prediction.getUpdatedAt()
        );
    }
}