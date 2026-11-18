package com.novatechsolution.shared.domain;

import java.text.Normalizer;
import java.util.Locale;

public final class Slugger {
    private Slugger() {
    }

    public static String from(String value) {
        String ascii = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "").toLowerCase(Locale.ROOT);
        return ascii.replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
    }
}
