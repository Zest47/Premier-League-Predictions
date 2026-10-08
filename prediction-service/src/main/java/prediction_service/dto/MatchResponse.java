package prediction_service.dto;

import prediction_service.entity.Match;

import java.time.OffsetDateTime;

public record MatchResponse(
        Long id,
        Integer gameweek,
        TeamResponse homeTeam,
        TeamResponse awayTeam,
        OffsetDateTime startDate,
        Integer homeScore,
        Integer awayScore,
        String status
) {
    public MatchResponse(Match match) {
        this(
                match.getId(),
                match.getGameweek(),
                new TeamResponse(match.getHomeTeam()),
                new TeamResponse(match.getAwayTeam()),
                match.getStartDate(),
                match.getHomeScore(),
                match.getAwayScore(),
                match.getStatus()
        );
    }
}