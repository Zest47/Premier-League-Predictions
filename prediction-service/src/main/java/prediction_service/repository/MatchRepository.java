package prediction_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import prediction_service.entity.Match;

public interface MatchRepository extends JpaRepository<Match, Long> {
}