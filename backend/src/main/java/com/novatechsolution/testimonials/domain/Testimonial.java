package com.novatechsolution.testimonials.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "testimonials") @Getter @Setter @NoArgsConstructor
public class Testimonial {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "author_name", nullable = false, length = 140) private String authorName;
    @Column(name = "author_role_fr", length = 140) private String authorRoleFr;
    @Column(name = "author_role_en", length = 140) private String authorRoleEn;
    @Column(name = "organization_name", length = 180) private String organizationName;
    @Column(name = "quote_fr", nullable = false, columnDefinition = "text") private String quoteFr;
    @Column(name = "quote_en", nullable = false, columnDefinition = "text") private String quoteEn;
    @Column(nullable = false) private int rating = 5;
    @Column(name = "display_order", nullable = false) private int displayOrder;
    @Column(nullable = false) private boolean published;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
}
