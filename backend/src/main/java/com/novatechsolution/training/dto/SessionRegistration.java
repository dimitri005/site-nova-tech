package com.novatechsolution.training.dto;

import java.time.Instant;
import java.util.UUID;

public record SessionRegistration(UUID sessionId, UUID courseId, String courseTitleFr, Instant startsAt) {
}
