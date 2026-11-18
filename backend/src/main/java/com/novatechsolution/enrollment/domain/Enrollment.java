package com.novatechsolution.enrollment.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "enrollments") @Getter @Setter @NoArgsConstructor
public class Enrollment {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "session_id", nullable = false) private UUID sessionId;
    @Column(name = "full_name", nullable = false, length = 160) private String fullName;
    @Column(nullable = false, length = 254) private String email;
    @Column(nullable = false, length = 40) private String phone;
    @Column(name = "preferred_language", nullable = false, length = 2) private String preferredLanguage;
    @Column(nullable = false) private boolean consent;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private EnrollmentStatus status = EnrollmentStatus.PENDING;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();
}
