package prediction_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import prediction_service.dto.TeamResponse;
import prediction_service.service.TeamService;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public List<TeamResponse> findAll() {
        return teamService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamResponse> findById(
            @PathVariable Long id
    ) {
        return teamService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}