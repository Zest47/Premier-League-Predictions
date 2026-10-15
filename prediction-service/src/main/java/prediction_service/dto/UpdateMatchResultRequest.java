package prediction_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateMatchResultRequest(
        @NotNull @Min(0) Integer homeScore,
        @NotNull @Min(0) Integer awayScore
) {}