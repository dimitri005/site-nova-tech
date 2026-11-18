package com.novatechsolution.team.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "team_members")
@Getter @Setter @NoArgsConstructor
public class TeamMember {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, unique = true, length = 140) private String slug;
    @Column(name = "full_name", nullable = false, length = 140) private String fullName;
    @Column(name = "position_fr", nullable = false, length = 140) private String positionFr;
    @Column(name = "position_en", nullable = false, length = 140) private String positionEn;
    @Column(name = "biography_fr", nullable = false, columnDefinition = "text") private String biographyFr;
    @Column(name = "biography_en", nullable = false, columnDefinition = "text") private String biographyEn;
    @Column(length = 500) private String photoUrl;
    @Column(length = 254) private String email;
    @Column(length = 500) private String linkedInUrl;
    @Column(length = 500) private String facebookUrl;
    @Column(nullable = false, length = 20) private String category = "STAFF";
    @Column(name = "display_order", nullable = false) private int displayOrder;
    @Column(nullable = false) private boolean published;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();
}
