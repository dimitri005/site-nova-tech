package com.novatechsolution.media.dto;

import com.novatechsolution.media.domain.MediaAsset;
import java.time.Instant;
import java.util.UUID;

public record MediaAssetResponse(UUID id, String url, String originalName, String contentType,
                                 long fileSize, String altFr, String altEn, Instant createdAt) {
    public static MediaAssetResponse from(MediaAsset asset) {
        return new MediaAssetResponse(asset.getId(), "/media/" + asset.getStorageName(),
                asset.getOriginalName(), asset.getContentType(), asset.getFileSize(),
                asset.getAltFr(), asset.getAltEn(), asset.getCreatedAt());
    }
}
