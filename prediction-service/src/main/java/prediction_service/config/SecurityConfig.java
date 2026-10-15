package prediction_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import prediction_service.service.JwtService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtService jwtService
    ) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(
                    (request, response, exception) ->
                        response.sendError(
                            HttpStatus.UNAUTHORIZED.value(),
                            "Unauthorized"
                        )
                )
            )

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/health").permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/teams", "/api/teams/**",
                    "/api/matches", "/api/matches/**"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/leaderboard"
                ).permitAll()

                .requestMatchers("/api/predictions/**")
                    .authenticated()

                .requestMatchers("/api/predictions")
                    .authenticated()

                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                .anyRequest().denyAll()
            )

            .addFilterBefore(
                new JwtAuthenticationFilter(jwtService),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}