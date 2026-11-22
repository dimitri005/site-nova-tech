package com.novatechsolution.i18n.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.i18n.service.TranslationService;
import com.novatechsolution.shared.web.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TranslationController {
    private final TranslationService translations;

    @Operation(tags = "Visiteur · Textes du site", summary = "Charger le catalogue de textes", description = "Retourne le catalogue de traduction (fr ou en) utilisé par le site : textes d’origine fusionnés avec les modifications de l’administration. Réponse mise en cache côté serveur (relecture toutes les 60 s).") @GetMapping("/api/v1/i18n/{locale}")
    public ApiResponse<Map<String, Object>> catalog(@PathVariable String locale) {
        return ApiResponse.of(translations.catalog(locale));
    }
}
