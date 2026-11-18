package com.novatechsolution.enrollment.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import java.util.UUID;

public record EnrollmentRequest(
        @NotNull UUID sessionId,
        @NotBlank @Size(max = 160) String fullName,
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(max = 40) String phone,
        @NotBlank @Pattern(regexp = "(?i)fr|en") String preferredLanguage,
        @NotNull Boolean consent,
        @Size(max = 200) String website) {
}
