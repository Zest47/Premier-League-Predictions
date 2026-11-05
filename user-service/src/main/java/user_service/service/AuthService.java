
package user_service.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import user_service.entity.User;
import user_service.exception.InvalidCredentialsException;
import user_service.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String login(String username, String password) {

        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Invalid username or password"
                        )
                );

        if (!passwordEncoder.matches(
                password,
                user.getPasswordHash()
        )) {
            throw new InvalidCredentialsException(
                    "Invalid username or password"
            );
        }

        return jwtService.generateToken(
                user.getId(),
                user.getUsername(),
                user.getRole().name()
        );
    }
}
