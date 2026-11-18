package com.novatechsolution.sitecontent.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;

@Entity @Table(name = "static_pages") @Getter @Setter @NoArgsConstructor
public class StaticPage {
    @Id @Column(length = 100) private String slug;
    @Column(name = "title_fr", nullable = false, length = 180) private String titleFr;
    @Column(name = "title_en", nullable = false, length = 180) private String titleEn;
    @Column(name = "body_fr", nullable = false, columnDefinition = "text") private String bodyFr;
    @Column(name = "body_en", nullable = false, columnDefinition = "text") private String bodyEn;
    @Column(nullable = false) private boolean published;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();
}
