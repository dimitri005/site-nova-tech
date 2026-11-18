package com.novatechsolution.inquiries.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public record QuoteRequestForm(@NotBlank @Size(max = 160) String fullName,
                               @NotBlank @Email @Size(max = 254) String email,
                               @Size(max = 40) String phone,
                               @NotBlank @Size(max = 100) String serviceType,
                               @NotBlank @Size(min = 15, max = 16000) String projectDescription,
                               @Size(max = 100) String budgetRange,
                               @Size(max = 160) String desiredDeadline,
                               @NotBlank @Pattern(regexp = "(?i)fr|en") String language,
                               @NotNull Boolean consent,
                               @Size(max = 200) String website) {
}
