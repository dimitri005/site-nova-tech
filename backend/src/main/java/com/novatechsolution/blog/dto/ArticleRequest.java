package com.novatechsolution.blog.dto;

import com.novatechsolution.blog.domain.ArticleStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.novatechsolution.shared.validation.SafeUrl;

public record ArticleRequest(@NotBlank @Size(max=160) String slug,
                             @NotBlank @Size(max=180) String titleFr, @NotBlank @Size(max=180) String titleEn,
                             @NotBlank @Size(max=1000) String excerptFr, @NotBlank @Size(max=1000) String excerptEn,
                             @NotBlank @Size(max=40000) String bodyFr, @NotBlank @Size(max=40000) String bodyEn,
                             @NotBlank @Size(max=100) String category, @SafeUrl @Size(max=500) String coverImageUrl,
                             @Size(max=180) String seoTitleFr, @Size(max=180) String seoTitleEn,
                             @Size(max=320) String seoDescriptionFr, @Size(max=320) String seoDescriptionEn,
                             @NotNull ArticleStatus status) {
}
