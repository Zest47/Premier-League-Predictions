package user_service.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import user_service.dto.LoginRequest;
import user_service.dto.LoginResponse;
import user_service.entity.User;
import user_service.repository.UserRepository;
import user_service.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(
            AuthService authService,
            UserRepository userRepository
    ) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        String token = authService.login(
                request.getUsername(),
                request.getPassword()
        );

        User user = userRepository.findByUsernameIgnoreCase(request.getUsername())
                .orElseThrow();

        LoginResponse response = new LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getRole().name()
        );

        return ResponseEntity.ok(response);
    }
}