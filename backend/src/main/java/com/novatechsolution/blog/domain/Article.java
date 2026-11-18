package com.novatechsolution.blog.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "articles") @Getter @Setter @NoArgsConstructor
public class Article {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(nullable = false, unique = true, length = 160) private String slug;
    @Column(name = "title_fr", nullable = false, length = 180) private String titleFr;
    @Column(name = "title_en", nullable = false, length = 180) private String titleEn;
    @Column(name = "excerpt_fr", nullable = false, length = 1000) private String excerptFr;
    @Column(name = "excerpt_en", nullable = false, length = 1000) private String excerptEn;
    @Column(name = "body_fr", nullable = false, columnDefinition = "text") private String bodyFr;
    @Column(name = "body_en", nullable = false, columnDefinition = "text") private String bodyEn;
    @Column(nullable = false, length = 100) private String category;
    @Column(name = "cover_image_url", length = 500) private String coverImageUrl;
    @Column(name = "seo_title_fr", length = 180) private String seoTitleFr;
    @Column(name = "seo_title_en", length = 180) private String seoTitleEn;
    @Column(name = "seo_description_fr", length = 320) private String seoDescriptionFr;
    @Column(name = "seo_description_en", length = 320) private String seoDescriptionEn;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private ArticleStatus status = ArticleStatus.DRAFT;
    @Column(name = "published_at") private Instant publishedAt;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();
    @Transient public boolean isPublished() { return status == ArticleStatus.PUBLISHED; }
}
