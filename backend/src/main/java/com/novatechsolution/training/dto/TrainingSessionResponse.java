package com.novatechsolution.training.dto;

import com.novatechsolution.training.domain.TrainingSession;
import com.novatechsolution.training.domain.TrainingSessionStatus;
import java.time.Instant;
import java.util.UUID;

public record TrainingSessionResponse(UUID id, UUID courseId, Instant startsAt, Instant endsAt,
                                      String venue, int capacity, int reservedPlaces, int placesRemaining,
                                      TrainingSessionStatus status) {
    public static TrainingSessionResponse from(TrainingSession session) {
        return new TrainingSessionResponse(session.getId(), session.getCourse().getId(),
                session.getStartsAt(), session.getEndsAt(), session.getVenue(), session.getCapacity(),
                session.getReservedPlaces(), Math.max(0, session.getCapacity() - session.getReservedPlaces()),
                session.getStatus());
    }
}
