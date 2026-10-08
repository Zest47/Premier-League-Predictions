package user_service.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import user_service.dto.LoginRequest;
import user_service.dto.UserResponse;
import user_service.entity.User;
import user_service.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        User user = authService.login(
                request.getUsername(),
                request.getPassword()
        );

        return ResponseEntity.ok(new UserResponse(user));
    }
}