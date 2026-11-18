package com.novatechsolution.services.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "site_services")
@Getter
@Setter
@NoArgsConstructor
public class ServiceContent {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false, unique = true, length = 140)
    private String slug;
    @Column(nullable = false, length = 80)
    private String category;
    @Column(name = "title_fr", nullable = false, length = 180)
    private String titleFr;
    @Column(name = "title_en", nullable = false, length = 180)
    private String titleEn;
    @Column(name = "description_fr", nullable = false, columnDefinition = "text")
    private String descriptionFr;
    @Column(name = "description_en", nullable = false, columnDefinition = "text")
    private String descriptionEn;
    @Column(length = 500)
    private String imageUrl;
    @Column(name = "display_order", nullable = false)
    private int displayOrder;
    @Column(nullable = false)
    private boolean published;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();
}
