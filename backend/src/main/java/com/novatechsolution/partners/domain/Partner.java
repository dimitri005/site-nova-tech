package com.novatechsolution.partners.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "partners") @Getter @Setter @NoArgsConstructor
public class Partner {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, length = 180) private String name;
    @Column(name = "logo_url", nullable = false, length = 500) private String logoUrl;
    @Column(name = "website_url", length = 500) private String websiteUrl;
    @Column(name = "display_order", nullable = false) private int displayOrder;
    @Column(nullable = false) private boolean published;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
}
