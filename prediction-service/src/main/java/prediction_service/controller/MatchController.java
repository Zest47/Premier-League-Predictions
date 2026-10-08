package prediction_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import prediction_service.dto.MatchResponse;
import prediction_service.service.MatchService;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping
    public List<MatchResponse> findAll() {
        return matchService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchResponse> findById(
            @PathVariable Long id
    ) {
        return matchService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}