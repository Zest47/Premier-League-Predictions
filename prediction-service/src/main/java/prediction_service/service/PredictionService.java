package prediction_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import prediction_service.dto.CreatePredictionRequest;
import prediction_service.dto.PredictionResponse;
import prediction_service.entity.Match;
import prediction_service.entity.Prediction;
import prediction_service.repository.MatchRepository;
import prediction_service.repository.PredictionRepository;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class PredictionService {

    private final PredictionRepository predictionRepository;
    private final MatchRepository matchRepository;

    public PredictionService(
            PredictionRepository predictionRepository,
            MatchRepository matchRepository
    ) {
        this.predictionRepository = predictionRepository;
        this.matchRepository = matchRepository;
    }

    @Transactional
    public PredictionResponse createPrediction(
            Long userId,
            CreatePredictionRequest request
    ) {

        Match match = matchRepository.findById(request.matchId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Match not found")
                );

        // Vérifier si l'utilisateur a déjà pronostiqué
        if (predictionRepository.existsByUserIdAndMatchId(
                userId, match.getId()
        )) {
            throw new IllegalStateException(
                    "Prediction already exists for this match"
            );
        }

        // Vérifier les scores
        if (request.homeScore() < 0 || request.awayScore() < 0) {
            throw new IllegalArgumentException("Scores cannot be negative");
        }

        // Date limite : 1 heure avant le premier match de la journée
        OffsetDateTime firstMatchDate = matchRepository
                .findByGameweekOrderByStartDateAsc(match.getGameweek())
                .stream()
                .map(Match::getStartDate)
                .findFirst()
                .orElseThrow();

        OffsetDateTime deadline = firstMatchDate.minusHours(1);

        if (!OffsetDateTime.now().isBefore(deadline)) {
            throw new IllegalStateException(
                    "Prediction deadline has passed"
            );
        }

        Prediction prediction = new Prediction();

        prediction.setUserId(userId);
        prediction.setMatch(match);
        prediction.setPredictedHomeScore(request.homeScore());
        prediction.setPredictedAwayScore(request.awayScore());
        prediction.setCreatedAt(OffsetDateTime.now());
        prediction.setUpdatedAt(OffsetDateTime.now());

        return new PredictionResponse(
                predictionRepository.save(prediction)
        );
    }

    @Transactional(readOnly = true)
    public List<PredictionResponse> findByUserId(Long userId) {

        return predictionRepository.findByUserId(userId)
                .stream()
                .map(PredictionResponse::new)
                .toList();
    }
}