package com.novatechsolution.i18n.service;

import com.novatechsolution.i18n.dto.TranslationEntry;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Catalogues de textes : fichiers d'origine + modifications enregistrées par l'administration. */
@Service
public class TranslationService {
    private static final TypeReference<Map<String, Object>> CATALOG_TYPE = new TypeReference<>() {};
    private static final List<String> LOCALES = List.of("fr", "en");
    /** Les modifications sont relues au plus toutes les 60 s (plusieurs instances) et immédiatement après chaque écriture. */
    private static final long REFRESH_MILLIS = 60_000;
    private final Map<String, Map<String, String>> baseFlat = new LinkedHashMap<>();
    private final Map<String, Map<String, Object>> catalogCache = new ConcurrentHashMap<>();
    private final JdbcClient jdbc;
    private volatile Map<String, Map<String, String>> overrides = Map.of("fr", Map.of(), "en", Map.of());
    private volatile long loadedAt;

    public TranslationService(ObjectMapper objectMapper, JdbcClient jdbc) {
        this.jdbc = jdbc;
        for (String locale : LOCALES) baseFlat.put(locale, flatten("", loadCatalog(objectMapper, locale), new LinkedHashMap<>()));
    }

    /** Catalogue public : textes d'origine, remplacés par les modifications de l'administration (mis en cache). */
    public Map<String, Object> catalog(String requestedLocale) {
        String locale = normalize(requestedLocale);
        refreshIfStale();
        return catalogCache.computeIfAbsent(locale, key -> {
            Map<String, String> merged = new LinkedHashMap<>(baseFlat.get(key));
            merged.putAll(overrides.get(key));
            return unflatten(merged);
        });
    }

    public List<TranslationEntry> entries() {
        refreshIfStale();
        List<String> keys = new ArrayList<>(baseFlat.get("fr").keySet());
        baseFlat.get("en").keySet().stream().filter(key -> !baseFlat.get("fr").containsKey(key)).forEach(keys::add);
        return keys.stream().map(this::entry).toList();
    }

    @Transactional
    public TranslationEntry save(String key, String fr, String en) {
        requireKey(key);
        store("fr", key, fr);
        store("en", key, en);
        refresh();
        return entry(key);
    }

    @Transactional
    public TranslationEntry reset(String key) {
        requireKey(key);
        jdbc.sql("DELETE FROM translation_overrides WHERE msg_key = :key").param("key", key).update();
        refresh();
        return entry(key);
    }

    private TranslationEntry entry(String key) {
        String defaultFr = baseFlat.get("fr").getOrDefault(key, "");
        String defaultEn = baseFlat.get("en").getOrDefault(key, "");
        Map<String, String> fr = overrides.get("fr");
        Map<String, String> en = overrides.get("en");
        return new TranslationEntry(key, key.contains(".") ? key.substring(0, key.indexOf('.')) : "general",
                fr.getOrDefault(key, defaultFr), en.getOrDefault(key, defaultEn), defaultFr, defaultEn, fr.containsKey(key) || en.containsKey(key));
    }

    private void store(String locale, String key, String value) {
        String cleaned = value == null ? "" : value.trim();
        if (cleaned.equals(baseFlat.get(locale).getOrDefault(key, ""))) {
            jdbc.sql("DELETE FROM translation_overrides WHERE locale = :l AND msg_key = :k").param("l", locale).param("k", key).update();
            return;
        }
        jdbc.sql("""
                INSERT INTO translation_overrides (locale, msg_key, msg_value, updated_at) VALUES (:l, :k, :v, now())
                ON CONFLICT (locale, msg_key) DO UPDATE SET msg_value = EXCLUDED.msg_value, updated_at = now()""")
                .param("l", locale).param("k", key).param("v", cleaned).update();
    }

    private void requireKey(String key) {
        if (!baseFlat.get("fr").containsKey(key) && !baseFlat.get("en").containsKey(key))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Texte introuvable.");
    }

    private void refreshIfStale() {
        if (System.currentTimeMillis() - loadedAt > REFRESH_MILLIS) refresh();
    }

    private synchronized void refresh() {
        Map<String, Map<String, String>> fresh = new LinkedHashMap<>();
        LOCALES.forEach(locale -> fresh.put(locale, new LinkedHashMap<>()));
        jdbc.sql("SELECT locale, msg_key, msg_value FROM translation_overrides").query((rs, row) -> {
            Map<String, String> target = fresh.get(rs.getString("locale"));
            if (target != null) target.put(rs.getString("msg_key"), rs.getString("msg_value"));
            return null;
        }).list();
        overrides = Map.copyOf(fresh);
        catalogCache.clear();
        loadedAt = System.currentTimeMillis();
    }

    private static String normalize(String requestedLocale) {
        String normalized = requestedLocale == null ? "" : requestedLocale.trim().replace('_', '-').toLowerCase(Locale.ROOT).split("-")[0];
        if (!LOCALES.contains(normalized)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Locale non prise en charge.");
        return normalized;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, String> flatten(String prefix, Map<String, Object> node, Map<String, String> out) {
        node.forEach((name, value) -> {
            String key = prefix.isEmpty() ? name : prefix + "." + name;
            if (value instanceof Map<?, ?> child) flatten(key, (Map<String, Object>) child, out);
            else if (value != null) out.put(key, String.valueOf(value));
        });
        return out;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> unflatten(Map<String, String> flat) {
        Map<String, Object> root = new LinkedHashMap<>();
        flat.forEach((key, value) -> {
            String[] parts = key.split("\\.");
            Map<String, Object> cursor = root;
            for (int i = 0; i < parts.length - 1; i++) cursor = (Map<String, Object>) cursor.computeIfAbsent(parts[i], p -> new LinkedHashMap<String, Object>());
            cursor.put(parts[parts.length - 1], value);
        });
        return root;
    }

    private Map<String, Object> loadCatalog(ObjectMapper objectMapper, String locale) {
        try (var input = new ClassPathResource("i18n/messages_" + locale + ".json").getInputStream()) {
            return objectMapper.readValue(input, CATALOG_TYPE);
        } catch (IOException | JacksonException exception) {
            throw new IllegalStateException("Impossible de charger le catalogue de traduction: " + locale, exception);
        }
    }
}
