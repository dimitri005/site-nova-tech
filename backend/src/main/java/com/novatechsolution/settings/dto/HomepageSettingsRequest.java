package com.novatechsolution.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Map;

public record HomepageSettingsRequest(
        @NotNull @Size(max = 200) Map<@NotBlank @Size(max = 160) String, @NotNull @Size(max = 4000) String> values) {
}
