package prediction_service.service;

import org.springframework.stereotype.Service;

@Service
public class PredictionScoringService {

    public int calculatePoints(
            int predictedHomeScore,
            int predictedAwayScore,
            int actualHomeScore,
            int actualAwayScore
    ) {

        // Score exact : 3 points
        if (predictedHomeScore == actualHomeScore
                && predictedAwayScore == actualAwayScore) {
            return 3;
        }

        // Résultat du pronostic
        int predictedResult = Integer.compare(
                predictedHomeScore,
                predictedAwayScore
        );

        // Résultat réel
        int actualResult = Integer.compare(
                actualHomeScore,
                actualAwayScore
        );

        // Bonne issue : 1 point
        if (predictedResult == actualResult) {
            return 1;
        }

        // Mauvaise issue : 0 point
        return 0;
    }
}