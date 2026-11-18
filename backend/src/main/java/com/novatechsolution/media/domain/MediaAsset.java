package com.novatechsolution.media.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name = "media_assets") @Getter @Setter @NoArgsConstructor
public class MediaAsset {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @Column(name = "storage_name", nullable = false, unique = true, length = 100) private String storageName;
    @Column(name = "original_name", nullable = false, length = 255) private String originalName;
    @Column(name = "content_type", nullable = false, length = 80) private String contentType;
    @Column(name = "file_size", nullable = false) private long fileSize;
    @Column(name = "alt_fr", length = 300) private String altFr;
    @Column(name = "alt_en", length = 300) private String altEn;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt = Instant.now();
}
