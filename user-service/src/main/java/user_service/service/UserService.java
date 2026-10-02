package user_service.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import user_service.entity.User;
import user_service.repository.UserRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Inscrit un nouvel utilisateur.
     */
    public User registerUser(
            String username,
            String email,
            String password) {

        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();

        user.setUsername(username);
        user.setEmail(email);

        // Le mot de passe n'est jamais enregistré en clair.
        String passwordHash = passwordEncoder.encode(password);
        user.setPasswordHash(passwordHash);

        user.setRole(User.Role.USER);
        user.setCreatedAt(OffsetDateTime.now());

        return userRepository.save(user);
    }

    /**
     * Recherche un utilisateur par son identifiant.
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Recherche un utilisateur par son username.
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Recherche un utilisateur par son email.
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Récupère tous les utilisateurs.
     */
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
}