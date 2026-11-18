package com.novatechsolution.projects.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity @Table(name = "projects") @Getter @Setter @NoArgsConstructor
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, unique = true, length = 160) private String slug;
    @Column(name = "title_fr", nullable = false, length = 180) private String titleFr;
    @Column(name = "title_en", nullable = false, length = 180) private String titleEn;
    @Column(name = "description_fr", nullable = false, columnDefinition = "text") private String descriptionFr;
    @Column(name = "description_en", nullable = false, columnDefinition = "text") private String descriptionEn;
    @Column(nullable = false, length = 80) private String category;
    @Column(name = "client_name", length = 180) private String clientName;
    @ElementCollection(fetch = FetchType.EAGER) @CollectionTable(name = "project_technologies", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "technology", nullable = false, length = 80) private List<String> technologies = new ArrayList<>();
    @ElementCollection(fetch = FetchType.EAGER) @CollectionTable(name = "project_gallery", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "image_url", nullable = false, length = 500) private List<String> galleryUrls = new ArrayList<>();
    @Column(name = "cover_image_url", length = 500) private String coverImageUrl;
    @Column(name = "project_date") private LocalDate projectDate;
    @Column(name = "project_url", length = 500) private String projectUrl;
    @Column(nullable = false) private boolean featured;
    @Column(nullable = false) private boolean published;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();
}
