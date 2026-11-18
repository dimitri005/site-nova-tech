package com.novatechsolution.identity.dto;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record LoginResponse(String accessToken, String refreshToken, String tokenType,
                            Instant expiresAt, Instant refreshExpiresAt,
                            UUID userId, String email, String displayName, Set<String> roles) {
}
