package com.novatechsolution.newsletter.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NewsletterRequest(@Email @Size(max=254) String email, @NotNull Boolean consent,
                                @Size(max=200) String website) {
}
