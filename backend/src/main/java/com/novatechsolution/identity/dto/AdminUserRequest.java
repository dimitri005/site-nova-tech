package com.novatechsolution.identity.dto;

import com.novatechsolution.identity.domain.AdminRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.Set;

public record AdminUserRequest(@NotBlank @Email @Size(max = 254) String email,
                               @NotBlank @Size(max = 120) String displayName,
                               @Pattern(regexp = "^$|(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{12,200}") String password,
                               @NotEmpty Set<AdminRole> roles,
                               boolean enabled) {
}
