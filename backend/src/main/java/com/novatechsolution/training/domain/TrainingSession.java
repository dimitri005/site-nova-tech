package com.novatechsolution.training.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "training_sessions") @Getter @Setter @NoArgsConstructor
public class TrainingSession {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne(fetch = FetchType.EAGER, optional = false) @JoinColumn(name = "course_id", nullable = false)
    private TrainingCourse course;
    @Column(name = "starts_at", nullable = false) private Instant startsAt;
    @Column(name = "ends_at", nullable = false) private Instant endsAt;
    @Column(nullable = false, length = 240) private String venue;
    @Column(nullable = false) private int capacity;
    @Column(name = "reserved_places", nullable = false) private int reservedPlaces;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private TrainingSessionStatus status = TrainingSessionStatus.OPEN;
    @Version private long version;
}
