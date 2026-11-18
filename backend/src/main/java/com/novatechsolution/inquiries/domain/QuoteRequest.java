package com.novatechsolution.inquiries.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "quote_requests") @Getter @Setter @NoArgsConstructor
public class QuoteRequest {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "full_name", nullable = false, length = 160) private String fullName;
    @Column(nullable = false, length = 254) private String email;
    @Column(length = 40) private String phone;
    @Column(name = "service_type", nullable = false, length = 100) private String serviceType;
    @Column(name = "project_description", nullable = false, columnDefinition = "text") private String projectDescription;
    @Column(name = "budget_range", length = 100) private String budgetRange;
    @Column(name = "desired_deadline", length = 160) private String desiredDeadline;
    @Column(nullable = false, length = 2) private String language;
    @Column(nullable = false) private boolean consent;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private InquiryStatus status = InquiryStatus.NEW;
    @Column(name = "internal_notes", columnDefinition = "text") private String internalNotes;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();
}
