package com.novatechsolution.i18n.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TranslationRequest(@NotNull @Size(max = 2000) String fr, @NotNull @Size(max = 2000) String en) {
}
