package com.novatechsolution.testimonials.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TestimonialRequest(@NotBlank @Size(max = 140) String authorName,
                                 @Size(max = 140) String authorRoleFr, @Size(max = 140) String authorRoleEn,
                                 @Size(max = 180) String organizationName,
                                 @NotBlank @Size(max = 5000) String quoteFr,
                                 @NotBlank @Size(max = 5000) String quoteEn,
                                 @Min(1) @Max(5) int rating, int displayOrder, boolean published) {
}
