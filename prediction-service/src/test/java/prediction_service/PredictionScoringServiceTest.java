package prediction_service.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PredictionScoringServiceTest {

    private final PredictionScoringService scoringService =
            new PredictionScoringService();

    @Test
    void exactScoreShouldGiveThreePoints() {
        int points = scoringService.calculatePoints(
                2, 1,
                2, 1
        );

        assertEquals(3, points);
    }

    @Test
    void correctWinnerShouldGiveOnePoint() {
        int points = scoringService.calculatePoints(
                3, 0,
                2, 1
        );

        assertEquals(1, points);
    }

    @Test
    void wrongResultShouldGiveZeroPoints() {
        int points = scoringService.calculatePoints(
                0, 2,
                2, 1
        );

        assertEquals(0, points);
    }

    @Test
    void correctDrawShouldGiveOnePoint() {
        int points = scoringService.calculatePoints(
                1, 1,
                2, 2
        );

        assertEquals(1, points);
    }
}