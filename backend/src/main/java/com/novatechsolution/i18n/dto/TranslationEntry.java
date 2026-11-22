package com.novatechsolution.i18n.dto;

public record TranslationEntry(String key, String group, String fr, String en, String defaultFr, String defaultEn, boolean overridden) {
}
