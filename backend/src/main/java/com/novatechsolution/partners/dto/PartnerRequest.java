package com.novatechsolution.partners.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.novatechsolution.shared.validation.SafeUrl;

public record PartnerRequest(@NotBlank @Size(max=180) String name, @NotBlank @SafeUrl @Size(max=500) String logoUrl,
                             @SafeUrl @Size(max=500) String websiteUrl, int displayOrder, boolean published) {
}
