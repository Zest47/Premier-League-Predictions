package prediction_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import prediction_service.entity.Prediction;

import java.util.List;
import java.util.Optional;

public interface PredictionRepository
        extends JpaRepository<Prediction, Long> {

    List<Prediction> findByUserId(Long userId);

    Optional<Prediction> findByUserIdAndMatchId(
            Long userId,
            Long matchId
    );

    boolean existsByUserIdAndMatchId(
            Long userId,
            Long matchId
    );
}