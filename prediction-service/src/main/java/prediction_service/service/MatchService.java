package prediction_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import prediction_service.dto.MatchResponse;
import prediction_service.repository.MatchRepository;
import prediction_service.dto.UpdateMatchResultRequest;
import prediction_service.entity.Match;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MatchService {

    private final MatchRepository matchRepository;

    public MatchService(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    @Transactional(readOnly = true)
    public List<MatchResponse> findAll() {
        return matchRepository.findAll()
                .stream()
                .map(MatchResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<MatchResponse> findById(Long id) {
        return matchRepository.findById(id)
                .map(MatchResponse::new);
    }

    @Transactional(readOnly = true)
    public List<MatchResponse> findByGameweek(Integer gameweek) {

        if (gameweek == null || gameweek < 1) {
            throw new IllegalArgumentException("Invalid gameweek");
        }

        return matchRepository
                .findByGameweekOrderByStartDateAsc(gameweek)
                .stream()
                .map(MatchResponse::new)
                .toList();
    }

    @Transactional
    public MatchResponse updateMatchResult(
            Long matchId,
            UpdateMatchResultRequest request
    ) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Match not found")
                );

        if (!"SCHEDULED".equals(match.getStatus())
                && !"LIVE".equals(match.getStatus())) {
            throw new IllegalStateException(
                    "Match result cannot be updated in its current status"
            );
        }

        match.setHomeScore(request.homeScore());
        match.setAwayScore(request.awayScore());
        match.setStatus("FINISHED");

        Match updatedMatch = matchRepository.save(match);

        return new MatchResponse(updatedMatch);
    }

    @Transactional(readOnly = true)
    public List<MatchResponse> findUpcomingMatches() {

        return matchRepository
                .findByStartDateAfterAndStatusOrderByStartDateAsc(
                        OffsetDateTime.now(),
                        "SCHEDULED"
                )
                .stream()
                .map(MatchResponse::new)
                .toList();
    }
}