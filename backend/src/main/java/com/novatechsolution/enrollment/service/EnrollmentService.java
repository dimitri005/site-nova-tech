package com.novatechsolution.enrollment.service;

import com.novatechsolution.enrollment.domain.Enrollment;
import com.novatechsolution.enrollment.domain.EnrollmentStatus;
import com.novatechsolution.enrollment.dto.EnrollmentRequest;
import com.novatechsolution.enrollment.repository.EnrollmentRepository;
import com.novatechsolution.notifications.service.NotificationService;
import com.novatechsolution.training.dto.SessionRegistration;
import com.novatechsolution.training.service.TrainingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
    private final NotificationService notifications;
    @Value("${novatech.site.public-url:http://localhost:5173}") private String siteUrl;

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
        notifications.notifyCompany("Nouvelle pré-inscription NovaTech",
                saved.getFullName() + " s'est pré-inscrit(e) à " + session.courseTitleFr()
                        + " (" + session.startsAt() + "). Contact : " + saved.getEmail() + ", " + saved.getPhone());
        notifications.send(saved.getEmail(), "Votre pré-inscription NovaTech",
                "Bonjour " + saved.getFullName() + ",\n\nNous avons reçu votre demande de pré-inscription. Notre équipe vous contactera pour confirmer votre place. Aucun paiement en ligne n'est demandé.\n\n" + siteUrl);
        return saved;
    }

    @Transactional(readOnly = true) public List<Enrollment> forSession(UUID sessionId) { return enrollments.findAllBySessionIdOrderByCreatedAtDesc(sessionId); }
    @Transactional(readOnly = true)
    public long recentCount() { return enrollments.countByCreatedAtAfter(Instant.now().minusSeconds(7 * 24 * 60 * 60L)); }

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
