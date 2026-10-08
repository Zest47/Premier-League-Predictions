package prediction_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import prediction_service.entity.Team;

public interface TeamRepository extends JpaRepository<Team, Long> {
}