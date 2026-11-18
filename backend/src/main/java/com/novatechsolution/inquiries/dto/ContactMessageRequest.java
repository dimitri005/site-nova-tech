package com.novatechsolution.inquiries.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public record ContactMessageRequest(@NotBlank @Size(max = 160) String fullName,
                                    @NotBlank @Email @Size(max = 254) String email,
                                    @Size(max = 40) String phone,
                                    @NotBlank @Size(max = 180) String subject,
                                    @NotBlank @Size(min = 10, max = 12000) String message,
                                    @NotBlank @Pattern(regexp = "(?i)fr|en") String language,
                                    @NotNull Boolean consent,
                                    @Size(max = 200) String website) {
}
