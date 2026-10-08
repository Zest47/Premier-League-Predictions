package prediction_service.service;

import org.springframework.stereotype.Service;
import prediction_service.dto.TeamResponse;
import prediction_service.repository.TeamRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public List<TeamResponse> findAll() {
        return teamRepository.findAll()
                .stream()
                .map(TeamResponse::new)
                .toList();
    }

    public Optional<TeamResponse> findById(Long id) {
        return teamRepository.findById(id)
                .map(TeamResponse::new);
    }
}