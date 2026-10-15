package prediction_service.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import prediction_service.dto.LeaderboardResponse;
import prediction_service.entity.Match;
import prediction_service.entity.Prediction;
import prediction_service.repository.PredictionRepository;

import java.util.*;

@Service
public class LeaderboardService {

    private final PredictionRepository predictionRepository;
    private final PredictionScoringService scoringService;

    public LeaderboardService(
            PredictionRepository predictionRepository,
            PredictionScoringService scoringService
    ) {
        this.predictionRepository = predictionRepository;
        this.scoringService = scoringService;
    }

    @Transactional(readOnly = true)
    public List<LeaderboardResponse> getLeaderboard() {

        List<Prediction> predictions =
                predictionRepository
                        .findByMatch_StatusAndMatch_HomeScoreIsNotNullAndMatch_AwayScoreIsNotNull(
                                "FINISHED"
                        );

        Map<Long, UserStats> statsByUser = new HashMap<>();

        for (Prediction prediction : predictions) {

            Match match = prediction.getMatch();

            int points = scoringService.calculatePoints(
                    prediction.getPredictedHomeScore(),
                    prediction.getPredictedAwayScore(),
                    match.getHomeScore(),
                    match.getAwayScore()
            );

            UserStats stats = statsByUser.computeIfAbsent(
                    prediction.getUserId(),
                    id -> new UserStats(id)
            );

            stats.totalPoints += points;
            stats.predictionsCount++;

            if (points == 3) {
                stats.exactScores++;
            } else if (points == 1) {
                stats.correctResults++;
            }
        }

        List<UserStats> sortedStats =
                new ArrayList<>(statsByUser.values());

        sortedStats.sort(
                Comparator.comparingInt(
                        (UserStats stats) -> stats.totalPoints
                ).reversed()
                .thenComparing(
                        Comparator.comparingInt(
                                (UserStats stats) -> stats.exactScores
                        ).reversed()
                )
                .thenComparingLong(stats -> stats.userId)
        );

        List<LeaderboardResponse> leaderboard =
                new ArrayList<>();

        int rank = 1;

        for (UserStats stats : sortedStats) {

            leaderboard.add(
                    new LeaderboardResponse(
                            rank++,
                            stats.userId,
                            stats.totalPoints,
                            stats.exactScores,
                            stats.correctResults,
                            stats.predictionsCount
                    )
            );
        }

        return leaderboard;
    }

    private static class UserStats {

        private final Long userId;
        private int totalPoints;
        private int exactScores;
        private int correctResults;
        private int predictionsCount;

        private UserStats(Long userId) {
            this.userId = userId;
        }
    }
}