package com.novatechsolution.training.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import com.novatechsolution.shared.validation.SafeUrl;
import java.math.BigDecimal;

public record TrainingCourseRequest(
        @NotBlank @Size(max = 160) String slug,
        @NotBlank @Size(max = 180) String titleFr,
        @NotBlank @Size(max = 180) String titleEn,
        @NotBlank @Size(max = 12000) String descriptionFr,
        @NotBlank @Size(max = 12000) String descriptionEn,
        @Size(max = 12000) String objectivesFr, @Size(max = 12000) String objectivesEn,
        @Size(max = 1000) String audienceFr, @Size(max = 1000) String audienceEn,
        @Size(max = 1000) String prerequisitesFr, @Size(max = 1000) String prerequisitesEn,
        @Size(max = 16000) String programFr, @Size(max = 16000) String programEn,
        @Positive Integer durationHours,
        @DecimalMin("0.0") BigDecimal indicativePrice,
        @Size(min = 3, max = 3) String currency,
        @SafeUrl @Size(max = 500) String imageUrl,
        boolean published) {
}
