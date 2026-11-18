package com.novatechsolution.team.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import com.novatechsolution.shared.validation.SafeUrl;

public record TeamMemberRequest(
        @NotBlank @Size(max = 140) String slug,
        @NotBlank @Size(max = 140) String fullName,
        @NotBlank @Size(max = 140) String positionFr,
        @NotBlank @Size(max = 140) String positionEn,
        @NotBlank @Size(max = 10000) String biographyFr,
        @NotBlank @Size(max = 10000) String biographyEn,
        @SafeUrl @Size(max = 500) String photoUrl,
        @Email @Size(max = 254) String email,
        @SafeUrl @Size(max = 500) String linkedInUrl,
        @SafeUrl @Size(max = 500) String facebookUrl,
        @Pattern(regexp = "FOUNDER|STAFF") String category,
        int displayOrder,
        boolean published) {
}
