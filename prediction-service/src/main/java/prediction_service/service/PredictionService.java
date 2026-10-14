package prediction_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import prediction_service.dto.CreatePredictionRequest;
import prediction_service.dto.PredictionResponse;
import prediction_service.entity.Match;
import prediction_service.entity.Prediction;
import prediction_service.repository.MatchRepository;
import prediction_service.repository.PredictionRepository;
import prediction_service.dto.UpdatePredictionRequest;

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

        if (!"SCHEDULED".equals(match.getStatus())) {
                throw new IllegalStateException(
                        "Match is not open for predictions"
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

    @Transactional
        public PredictionResponse updatePrediction(
                Long userId,
                Long predictionId,
                UpdatePredictionRequest request
        ) {

        // 1. Récupérer le pronostic
        Prediction prediction = predictionRepository.findById(predictionId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Prediction not found")
                );

        // 2. Vérifier que l'utilisateur est propriétaire
        if (!prediction.getUserId().equals(userId)) {
                throw new SecurityException(
                        "You cannot modify another user's prediction"
                );
        }

        // 3. Récupérer le match
        Match match = prediction.getMatch();

        // 4. Vérifier le statut du match
        if (!"SCHEDULED".equals(match.getStatus())) {
                throw new IllegalStateException(
                        "Match is not open for predictions"
                );
        }

        // 5. Calculer la date limite de la journée
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

        // 6. Mettre à jour les scores
        prediction.setPredictedHomeScore(request.homeScore());
        prediction.setPredictedAwayScore(request.awayScore());
        prediction.setUpdatedAt(OffsetDateTime.now());

        // 7. Sauvegarder
        Prediction updatedPrediction = predictionRepository.save(prediction);

        return new PredictionResponse(updatedPrediction);
        }
}