package prediction_service.controller;

import org.springframework.web.bind.annotation.*;

import prediction_service.dto.LeaderboardResponse;
import prediction_service.service.LeaderboardService;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(
            LeaderboardService leaderboardService
    ) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public List<LeaderboardResponse> getLeaderboard() {
        return leaderboardService.getLeaderboard();
    }
}