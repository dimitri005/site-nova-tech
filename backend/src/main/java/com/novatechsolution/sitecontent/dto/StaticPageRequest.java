package com.novatechsolution.sitecontent.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record StaticPageRequest(@NotBlank @Pattern(regexp = "[a-z0-9-]{2,100}") String slug,
                                @NotBlank @Size(max = 180) String titleFr,
                                @NotBlank @Size(max = 180) String titleEn,
                                @NotBlank @Size(max = 50000) String bodyFr,
                                @NotBlank @Size(max = 50000) String bodyEn,
                                boolean published) {
}
