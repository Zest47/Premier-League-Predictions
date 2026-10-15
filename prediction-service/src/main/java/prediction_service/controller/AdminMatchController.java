package prediction_service.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import prediction_service.dto.MatchResponse;
import prediction_service.dto.UpdateMatchResultRequest;
import prediction_service.service.MatchService;

@RestController
@RequestMapping("/api/admin/matches")
public class AdminMatchController {

    private final MatchService matchService;

    public AdminMatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PutMapping("/{id}/result")
    public ResponseEntity<MatchResponse> updateResult(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMatchResultRequest request
    ) {
        return ResponseEntity.ok(
                matchService.updateMatchResult(id, request)
        );
    }
}