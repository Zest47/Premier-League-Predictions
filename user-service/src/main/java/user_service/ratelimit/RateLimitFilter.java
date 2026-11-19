
package user_service.ratelimit;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

import com.google.common.net.InetAddresses;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Cache<String, Bucket> buckets =
            Caffeine.newBuilder()
                    .expireAfterAccess(Duration.ofHours(2))
                    .maximumSize(100_000)
                    .build();

    @Value("${plp.rate-limit.enabled:false}")
    private boolean enabled;

    @Value("${plp.proxy.secret:}")
    private String proxySecret;

    @Value("${plp.proxy.required:false}")
    private boolean proxyRequired;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getServletPath();

        boolean login = "/api/auth/login".equals(path);
        boolean register = "/api/users".equals(path);

        if (!login && !register) {
            filterChain.doFilter(request, response);
            return;
        }

        String providedSecret =
                request.getHeader("X-PLP-Proxy-Secret");

        String forwardedIp =
                request.getHeader("X-PLP-Client-IP");

        boolean authenticatedProxy =
                proxySecret != null
                && !proxySecret.isBlank()
                && providedSecret != null
                && MessageDigest.isEqual(
                        proxySecret.getBytes(StandardCharsets.UTF_8),
                        providedSecret.getBytes(StandardCharsets.UTF_8)
                );

        if (proxyRequired && !authenticatedProxy) {
            response.sendError(
                    HttpServletResponse.SC_FORBIDDEN,
                    "Proxy authentication required"
            );
            return;
        }

        if (!enabled) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = request.getRemoteAddr();

        if (authenticatedProxy) {
            if (forwardedIp == null
                || !InetAddresses.isInetAddress(forwardedIp)) {

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json;charset=UTF-8");

            response.getWriter().write(
                    "{\"error\":\"Invalid client IP\"}"
            );

            return;
        }

            clientIp = forwardedIp;
        }

        String key = (login ? "login:" : "register:") + clientIp;

        Bucket bucket = buckets.get(key, ignored -> {
            Bandwidth limit = login
                    ? Bandwidth.builder()
                        .capacity(10)
                        .refillGreedy(10, Duration.ofMinutes(1))
                        .build()
                    : Bandwidth.builder()
                        .capacity(5)
                        .refillGreedy(5, Duration.ofHours(1))
                        .build();

            return Bucket.builder()
                    .addLimit(limit)
                    .build();
        });

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (!probe.isConsumed()) {
            long retryAfter = Math.max(
                    1,
                    TimeUnit.NANOSECONDS.toSeconds(
                            probe.getNanosToWaitForRefill()
                    ) + 1
            );

            response.setStatus(429);
            response.setHeader(
                    "Retry-After",
                    String.valueOf(retryAfter)
            );
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(
                    "{\"error\":\"Trop de tentatives. Veuillez réessayer plus tard.\"}"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}
