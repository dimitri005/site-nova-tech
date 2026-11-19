package com.novatechsolution.config;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.proc.SecurityContext;
import java.util.Base64;
import java.time.Duration;
import java.util.List;

import com.novatechsolution.identity.repository.AdminUserRepository;
import com.novatechsolution.audit.service.ActivityAuditFilter;
import com.novatechsolution.audit.service.ActivityLogService;
import com.novatechsolution.shared.web.ApiAccessDeniedHandler;
import com.novatechsolution.shared.web.ApiAuthenticationEntryPoint;

@Configuration(proxyBeanMethods = false)
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    UserDetailsService adminUserDetailsService(AdminUserRepository users) {
        return email -> users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("Compte administrateur introuvable"));
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain apiSecurity(HttpSecurity http, ObjectProvider<JwtDecoder> jwtDecoder,
                                    ObjectProvider<Converter<Jwt, ? extends AbstractAuthenticationToken>> jwtConverter,
                                    PublicFormRateLimitFilter publicFormRateLimitFilter,
                                    ActivityAuditFilter activityAuditFilter,
                                    ApiAuthenticationEntryPoint authenticationEntryPoint,
                                    ApiAccessDeniedHandler accessDeniedHandler)
            throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(errors -> errors.authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/error", "/media/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html",
                                "/actuator/health", "/actuator/health/**").permitAll()
                        .requestMatchers("/api/v1/auth/login", "/api/v1/auth/refresh", "/api/v1/auth/logout").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/services/**", "/api/v1/projects/**", "/api/v1/trainings/**",
                                "/api/v1/team/**", "/api/v1/testimonials/**", "/api/v1/partners/**",
                                "/api/v1/articles/**", "/api/v1/site-content/**", "/api/v1/settings/public",
                                "/api/v1/i18n/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/contact-messages",
                                "/api/v1/quote-requests", "/api/v1/enrollments",
                                "/api/v1/newsletter/unsubscribe").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/newsletter/unsubscribe").permitAll()
                        .anyRequest().authenticated());
        http.addFilterBefore(publicFormRateLimitFilter, AnonymousAuthenticationFilter.class);
        http.addFilterAfter(activityAuditFilter, AuthorizationFilter.class);

        JwtDecoder decoder = jwtDecoder.getIfAvailable();
        if (decoder != null) {
            http.oauth2ResourceServer(resourceServer -> resourceServer.jwt(jwt -> {
                jwt.decoder(decoder);
                Converter<Jwt, ? extends AbstractAuthenticationToken> converter = jwtConverter.getIfAvailable();
                if (converter != null) {
                    jwt.jwtAuthenticationConverter(converter);
                }
            }));
        }
        return http.build();
    }

    @Bean
    PublicFormRateLimitFilter publicFormRateLimitFilter(
            @Value("${novatech.security.rate-limit.public-posts-per-minute:10}") int maximumPostsPerWindow,
            @Value("${novatech.security.rate-limit.window:PT1M}") Duration window) {
        return new PublicFormRateLimitFilter(maximumPostsPerWindow, window);
    }

    @Bean
    ActivityAuditFilter activityAuditFilter(ActivityLogService activityLogService) {
        return new ActivityAuditFilter(activityLogService);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(
            @Value("${novatech.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}") List<String> origins,
            @Value("${novatech.cors.allowed-methods:GET,POST,PUT,PATCH,DELETE,OPTIONS}") List<String> methods,
            @Value("${novatech.cors.allowed-headers:Authorization,Content-Type,Accept,Origin}") List<String> headers) {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(origins);
        cors.setAllowedMethods(methods);
        cors.setAllowedHeaders(headers);
        cors.setAllowCredentials(true);
        cors.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", cors);
        return source;
    }

    @Bean
    @org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "JWT_SECRET_BASE64")
    JwtDecoder jwtDecoder(@Value("${JWT_SECRET_BASE64}") String encodedSecret,
                          @Value("${novatech.security.jwt.issuer:novatech-solution}") String issuer) {
        SecretKey key = jwtSigningKey(encodedSecret);
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(key).build();
        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(issuer));
        return decoder;
    }

    @Bean
    @org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "JWT_SECRET_BASE64")
    JwtEncoder jwtEncoder(@Value("${JWT_SECRET_BASE64}") String encodedSecret) {
        SecretKey key = jwtSigningKey(encodedSecret);
        return new NimbusJwtEncoder(new ImmutableSecret<SecurityContext>(key));
    }

    private SecretKey jwtSigningKey(String encodedSecret) {
        byte[] secretBytes;
        try {
            secretBytes = Base64.getDecoder().decode(encodedSecret);
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException("JWT_SECRET_BASE64 must contain a valid Base64 secret", exception);
        }
        if (secretBytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET_BASE64 must decode to at least 32 bytes");
        }
        return new SecretKeySpec(secretBytes, "HmacSHA256");
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName("roles");
        authorities.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);
        return converter;
    }
}
