package com.novatechsolution.enrollment.dto;

import com.novatechsolution.enrollment.domain.EnrollmentStatus;
import jakarta.validation.constraints.NotNull;

public record EnrollmentStatusRequest(@NotNull EnrollmentStatus status) {
}
