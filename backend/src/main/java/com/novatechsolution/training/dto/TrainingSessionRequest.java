package com.novatechsolution.training.dto;

import com.novatechsolution.training.domain.TrainingSessionStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

public record TrainingSessionRequest(
        @NotNull UUID courseId,
        @NotNull Instant startsAt,
        @NotNull Instant endsAt,
        @NotBlank @Size(max = 240) String venue,
        @Positive int capacity,
        @NotNull TrainingSessionStatus status) {
}
