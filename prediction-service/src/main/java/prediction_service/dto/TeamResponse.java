package prediction_service.dto;

import prediction_service.entity.Team;

public record TeamResponse(
        Long id,
        String name
) {
    public TeamResponse(Team team) {
        this(team.getId(), team.getName());
    }
}