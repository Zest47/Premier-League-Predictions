package prediction_service.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import prediction_service.dto.CreatePredictionRequest;
import prediction_service.dto.PredictionResponse;
import prediction_service.service.PredictionService;
import prediction_service.dto.UpdatePredictionRequest;
import prediction_service.dto.PredictionResultResponse;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping
    public ResponseEntity<PredictionResponse> create(
            Authentication authentication,
            @Valid @RequestBody CreatePredictionRequest request
    ) {

        Long userId = (Long) authentication.getPrincipal();

        PredictionResponse response =
                predictionService.createPrediction(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<PredictionResponse>> findMine(
            Authentication authentication
    ) {

        Long userId = (Long) authentication.getPrincipal();

        return ResponseEntity.ok(
                predictionService.findByUserId(userId)
        );
    }
    @GetMapping("/me/results")
        public ResponseEntity<List<PredictionResultResponse>> findMyResults(
                Authentication authentication
        ) {
        Long userId = (Long) authentication.getPrincipal();

        return ResponseEntity.ok(
                predictionService.findMyResults(userId)
        );
        }
    @PutMapping("/{id}")
    public ResponseEntity<PredictionResponse> update(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody UpdatePredictionRequest request
    ) {
        Long userId = (Long) authentication.getPrincipal();

        PredictionResponse response =
                predictionService.updatePrediction(userId, id, request);

        return ResponseEntity.ok(response);
    }
}