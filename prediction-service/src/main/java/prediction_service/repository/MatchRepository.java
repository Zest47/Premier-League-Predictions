package prediction_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import prediction_service.entity.Match;

import java.time.OffsetDateTime;
import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {

    // Matchs d'une journée
    List<Match> findByGameweekOrderByStartDateAsc(Integer gameweek);

    // Matchs à venir
    List<Match> findByStartDateAfterAndStatusOrderByStartDateAsc(
            OffsetDateTime date,
            String status
    );

}