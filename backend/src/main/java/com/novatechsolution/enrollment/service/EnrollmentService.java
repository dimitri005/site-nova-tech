package com.novatechsolution.enrollment.service;

import com.novatechsolution.enrollment.domain.Enrollment;
import com.novatechsolution.enrollment.domain.EnrollmentStatus;
import com.novatechsolution.enrollment.dto.EnrollmentRequest;
import com.novatechsolution.enrollment.repository.EnrollmentRepository;
import com.novatechsolution.training.dto.SessionRegistration;
import com.novatechsolution.training.service.TrainingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class EnrollmentService {
    private final EnrollmentRepository enrollments;
    private final TrainingService trainings;

    @Transactional
    public Enrollment create(EnrollmentRequest request) {
        if (!request.consent()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le consentement est requis.");
        if (request.website() != null && !request.website().isBlank()) {
            return null;
        }
        SessionRegistration session = trainings.reservePlace(request.sessionId());
        Enrollment enrollment = new Enrollment();
        enrollment.setSessionId(session.sessionId()); enrollment.setFullName(request.fullName().trim());
        enrollment.setEmail(request.email().trim().toLowerCase()); enrollment.setPhone(request.phone().trim());
        enrollment.setPreferredLanguage(request.preferredLanguage().toLowerCase()); enrollment.setConsent(true);
        Enrollment saved = enrollments.save(enrollment);
        return saved;
    }

    @Transactional(readOnly = true) public List<Enrollment> forSession(UUID sessionId) { return enrollments.findAllBySessionIdOrderByCreatedAtDesc(sessionId); }
    @Transactional
    public Enrollment changeStatus(UUID id, EnrollmentStatus newStatus) {
        Enrollment enrollment = enrollments.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pré-inscription introuvable."));
        boolean wasActive = enrollment.getStatus() != EnrollmentStatus.CANCELLED;
        boolean willBeActive = newStatus != EnrollmentStatus.CANCELLED;
        if (!wasActive && willBeActive) {
            trainings.reservePlace(enrollment.getSessionId());
        } else if (wasActive && !willBeActive) {
            trainings.releasePlace(enrollment.getSessionId());
        }
        enrollment.setStatus(newStatus); enrollment.setUpdatedAt(Instant.now());
        return enrollment;
    }
}
