package prediction_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CreatePredictionRequest(

        @NotNull
        Long matchId,

        @NotNull
        @Min(0)
        Integer homeScore,

        @NotNull
        @Min(0)
        Integer awayScore

) {}