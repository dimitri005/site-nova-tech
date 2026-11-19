package com.novatechsolution.identity.service;

import com.novatechsolution.identity.domain.AdminUser;
import com.novatechsolution.identity.dto.LoginRequest;
import com.novatechsolution.identity.dto.LoginResponse;
import com.novatechsolution.identity.repository.AdminUserRepository;
import com.novatechsolution.identity.domain.RefreshSession;
import com.novatechsolution.identity.repository.RefreshSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.Set;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IdentityService {
    private final AuthenticationManager authenticationManager;
    private final AdminUserRepository users;
    private final RefreshSessionRepository refreshSessions;
    private final ObjectProvider<JwtEncoder> jwtEncoderProvider;

    private static final SecureRandom RANDOM = new SecureRandom();

    @Value("${novatech.security.jwt.issuer:novatech-solution}")
    private String issuer;

    @Value("${novatech.security.jwt.access-token-ttl:PT30M}")
    private Duration accessTokenTtl;

    @Value("${novatech.security.jwt.refresh-token-ttl:PT8H}")
    private Duration refreshTokenTtl;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
        AdminUser user = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Identifiants invalides."));
        return issueTokens(user);
    }

    @Transactional
    public LoginResponse refresh(String rawRefreshToken) {
        RefreshSession oldSession = refreshSessions.findActiveForUpdate(hashToken(rawRefreshToken))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session invalide ou expirée."));
        Instant now = Instant.now();
        if (!oldSession.getExpiresAt().isAfter(now)) {
            oldSession.setRevokedAt(now);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Session invalide ou expirée.");
        }
        AdminUser user = users.findById(oldSession.getAdminUserId())
                .filter(AdminUser::isEnabled)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Compte administrateur désactivé."));
        oldSession.setRevokedAt(now);
        return issueTokens(user);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return;
        }
        refreshSessions.findActiveForUpdate(hashToken(rawRefreshToken))
                .ifPresent(session -> session.setRevokedAt(Instant.now()));
    }

    private LoginResponse issueTokens(AdminUser user) {
        JwtEncoder encoder = jwtEncoderProvider.getIfAvailable();
        if (encoder == null) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "L'authentification JWT n'est pas configurée.");
        }
        Instant issuedAt = Instant.now();
        Instant expiresAt = issuedAt.plus(accessTokenTtl);
        Instant refreshExpiresAt = issuedAt.plus(refreshTokenTtl);
        Set<String> roles = user.getRoles().stream().map(Enum::name).collect(Collectors.toUnmodifiableSet());
        JwtClaimsSet claims = JwtClaimsSet.builder().issuer(issuer).subject(user.getEmail())
                .issuedAt(issuedAt).expiresAt(expiresAt).claim("roles", roles).build();
        String token = encoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
        byte[] random = new byte[48];
        RANDOM.nextBytes(random);
        String refreshToken = Base64.getUrlEncoder().withoutPadding().encodeToString(random);
        RefreshSession session = new RefreshSession();
        session.setAdminUserId(user.getId());
        session.setTokenHash(hashToken(refreshToken));
        session.setExpiresAt(refreshExpiresAt);
        refreshSessions.save(session);
        return new LoginResponse(token, refreshToken, "Bearer", expiresAt, refreshExpiresAt,
                user.getId(), user.getEmail(),
                user.getDisplayName(), roles);
    }

    private String hashToken(String token) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
        } catch (java.security.NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}
