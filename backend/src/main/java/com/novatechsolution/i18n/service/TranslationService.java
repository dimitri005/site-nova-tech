package com.novatechsolution.i18n.service;

import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;

@Service
public class TranslationService {
    private static final TypeReference<Map<String, Object>> CATALOG_TYPE = new TypeReference<>() {};
    private final Map<String, Map<String, Object>> catalogs;

    public TranslationService(ObjectMapper objectMapper) {
        this.catalogs = Map.of(
                "fr", loadCatalog(objectMapper, "fr"),
                "en", loadCatalog(objectMapper, "en")
        );
    }

    public Map<String, Object> catalog(String requestedLocale) {
        String normalized = requestedLocale == null ? "" : requestedLocale.trim()
                .replace('_', '-').toLowerCase(Locale.ROOT).split("-")[0];
        Map<String, Object> catalog = catalogs.get(normalized);
        if (catalog == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Locale non prise en charge.");
        }
        return catalog;
    }

    private Map<String, Object> loadCatalog(ObjectMapper objectMapper, String locale) {
        try (var input = new ClassPathResource("i18n/messages_" + locale + ".json").getInputStream()) {
            return objectMapper.readValue(input, CATALOG_TYPE);
        } catch (IOException | JacksonException exception) {
            throw new IllegalStateException("Impossible de charger le catalogue de traduction: " + locale, exception);
        }
    }
}
