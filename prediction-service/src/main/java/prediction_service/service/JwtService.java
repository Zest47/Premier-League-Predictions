package prediction_service.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public Long extractUserId(String token) {
        Claims claims = getClaims(token);

        Number userId = claims.get("userId", Number.class);

        if (userId == null) {
            throw new IllegalArgumentException(
                    "Token does not contain userId"
            );
        }

        return userId.longValue();
    }

    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    public boolean isTokenValid(String token) {
        Claims claims = getClaims(token);

        return claims.getSubject() != null
                && !claims.getSubject().isBlank()
                && claims.getExpiration() != null
                && claims.getExpiration().after(new Date())
                && claims.get("role", String.class) != null
                && claims.get("userId", Number.class) != null;
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}