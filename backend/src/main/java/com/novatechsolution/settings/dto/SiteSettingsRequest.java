package com.novatechsolution.settings.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.Map;

public record SiteSettingsRequest(@NotNull @Size(max = 100) Map<@Size(max = 160) String, @Size(max = 4000) String> values) {
}
