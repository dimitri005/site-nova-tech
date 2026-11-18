package com.novatechsolution.training.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "training_courses") @Getter @Setter @NoArgsConstructor
public class TrainingCourse {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, unique = true, length = 160) private String slug;
    @Column(name = "title_fr", nullable = false, length = 180) private String titleFr;
    @Column(name = "title_en", nullable = false, length = 180) private String titleEn;
    @Column(name = "description_fr", nullable = false, columnDefinition = "text") private String descriptionFr;
    @Column(name = "description_en", nullable = false, columnDefinition = "text") private String descriptionEn;
    @Column(name = "objectives_fr", columnDefinition = "text") private String objectivesFr;
    @Column(name = "objectives_en", columnDefinition = "text") private String objectivesEn;
    @Column(name = "audience_fr", length = 1000) private String audienceFr;
    @Column(name = "audience_en", length = 1000) private String audienceEn;
    @Column(name = "prerequisites_fr", length = 1000) private String prerequisitesFr;
    @Column(name = "prerequisites_en", length = 1000) private String prerequisitesEn;
    @Column(name = "program_fr", columnDefinition = "text") private String programFr;
    @Column(name = "program_en", columnDefinition = "text") private String programEn;
    @Column(name = "duration_hours") private Integer durationHours;
    @Column(name = "indicative_price", precision = 12, scale = 2) private BigDecimal indicativePrice;
    @Column(length = 3) private String currency = "XAF";
    @Column(name = "image_url", length = 500) private String imageUrl;
    @Column(nullable = false) private boolean published;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();
}
