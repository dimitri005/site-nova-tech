package com.novatechsolution.services.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.novatechsolution.shared.validation.SafeUrl;

public record ServiceContentRequest(
        @NotBlank @Size(max = 140) String slug,
        @NotBlank @Size(max = 80) String category,
        @NotBlank @Size(max = 180) String titleFr,
        @NotBlank @Size(max = 180) String titleEn,
        @NotBlank @Size(max = 12000) String descriptionFr,
        @NotBlank @Size(max = 12000) String descriptionEn,
        @SafeUrl @Size(max = 500) String imageUrl,
        int displayOrder,
        boolean published) {
}
