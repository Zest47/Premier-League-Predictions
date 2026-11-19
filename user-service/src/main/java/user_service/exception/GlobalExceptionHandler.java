
package user_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Identifiant ou mot de passe incorrect
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(
            InvalidCredentialsException exception
    ) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "error", exception.getMessage()
                ));
    }

    // Identifiant ou email déjà utilisé
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateUser(
            IllegalArgumentException exception
    ) {
        String message = exception.getMessage();

        if ("Username already exists".equals(message)
                || "Email already exists".equals(message)) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "error",
                            "Cet identifiant ou cette adresse email est déjà utilisé."
                    ));
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error", "Requête invalide."
                ));
    }

    // Validation des champs du formulaire
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(
            MethodArgumentNotValidException exception
    ) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error",
                        "Veuillez vérifier les informations saisies."
                ));
    }
}
