package com.novatechsolution.projects.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.novatechsolution.shared.validation.SafeUrl;
import java.time.LocalDate;
import java.util.List;

public record ProjectRequest(
        @NotBlank @Size(max = 160) String slug,
        @NotBlank @Size(max = 180) String titleFr,
        @NotBlank @Size(max = 180) String titleEn,
        @NotBlank @Size(max = 16000) String descriptionFr,
        @NotBlank @Size(max = 16000) String descriptionEn,
        @NotBlank @Size(max = 80) String category,
        @Size(max = 180) String clientName,
        @Size(max = 30) List<@Size(max = 80) String> technologies,
        @Size(max = 30) List<@SafeUrl @Size(max = 500) String> galleryUrls,
        @SafeUrl @Size(max = 500) String coverImageUrl,
        LocalDate projectDate,
        @SafeUrl @Size(max = 500) String projectUrl,
        boolean featured,
        boolean published) {
}
