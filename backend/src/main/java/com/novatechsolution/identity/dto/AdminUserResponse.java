package com.novatechsolution.identity.dto;

import com.novatechsolution.identity.domain.AdminRole;
import com.novatechsolution.identity.domain.AdminUser;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record AdminUserResponse(UUID id, String email, String displayName, Set<AdminRole> roles,
                                boolean enabled, Instant createdAt) {
    public static AdminUserResponse from(AdminUser user) {
        return new AdminUserResponse(user.getId(), user.getEmail(), user.getDisplayName(),
                Set.copyOf(user.getRoles()), user.isEnabled(), user.getCreatedAt());
    }
}
