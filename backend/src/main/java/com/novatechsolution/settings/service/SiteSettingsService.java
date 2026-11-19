package com.novatechsolution.settings.service;

import com.novatechsolution.settings.domain.SiteSettings;
import com.novatechsolution.settings.dto.SiteSettingsRequest;
import com.novatechsolution.settings.repository.SiteSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Service @RequiredArgsConstructor
public class SiteSettingsService {
    private static final Set<String> PUBLIC_PREFIXES = Set.of("site.", "contact.", "social.", "footer.", "seo.");
    private final SiteSettingsRepository settings;

    @Transactional(readOnly = true)
    public Map<String, String> publicValues() {
        return settings.findById("default").map(SiteSettings::getValues).orElseGet(LinkedHashMap::new).entrySet().stream()
                .filter(e -> PUBLIC_PREFIXES.stream().anyMatch(e.getKey()::startsWith))
                .collect(LinkedHashMap::new, (m, e) -> m.put(e.getKey(), e.getValue()), LinkedHashMap::putAll);
    }
    @Transactional(readOnly = true)
    public Map<String, String> adminValues() { return settings.findById("default").map(s -> new LinkedHashMap<>(s.getValues())).orElseGet(LinkedHashMap::new); }
    @Transactional
    public Map<String, String> replace(SiteSettingsRequest request) {
        SiteSettings entity = settings.findById("default").orElseGet(SiteSettings::new);
        Map<String, String> cleaned = new LinkedHashMap<>();
        request.values().forEach((key, value) -> {
            if (key == null || !key.matches("[a-z][a-z0-9_.-]{1,159}") || key.toLowerCase().matches(".*(password|secret|token|credential).*"))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Clé de paramètre invalide.");
            if (value == null || value.length() > 4000)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valeur de paramètre invalide.");
            cleaned.put(key, value.trim());
        });
        entity.setValues(cleaned); return new LinkedHashMap<>(settings.save(entity).getValues());
    }
}
