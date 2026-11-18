package com.novatechsolution.identity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(@NotBlank String token,
                                   @NotBlank @Pattern(regexp = "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{12,200}") String newPassword) {
}
