package com.novatechsolution.i18n.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.i18n.dto.TranslationEntry;
import com.novatechsolution.i18n.dto.TranslationRequest;
import com.novatechsolution.i18n.service.TranslationService;
import com.novatechsolution.shared.web.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
public class TranslationAdminController {
    private final TranslationService translations;

    @Operation(tags = "Management · Textes du site", summary = "Lister tous les textes modifiables", description = "Retourne chaque clé avec ses valeurs actuelles et d’origine (fr/en) et un indicateur de personnalisation. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/translations")
    public ApiResponse<List<TranslationEntry>> list() { return ApiResponse.of(translations.entries()); }

    @Operation(tags = "Management · Textes du site", summary = "Modifier un texte", description = "Enregistre les valeurs fr et en d’une clé existante ; une valeur identique à l’original supprime la personnalisation. 404 si la clé est inconnue. Rôles requis : SUPER_ADMIN ou EDITOR.") @PutMapping("/api/v1/management/translations/{key}")
    public ApiResponse<TranslationEntry> save(@PathVariable String key, @Valid @RequestBody TranslationRequest request) {
        return ApiResponse.of(translations.save(key, request.fr(), request.en()));
    }

    @Operation(tags = "Management · Textes du site", summary = "Rétablir le texte d’origine", description = "Supprime la personnalisation d’une clé pour revenir aux textes d’origine. Rôles requis : SUPER_ADMIN ou EDITOR.") @DeleteMapping("/api/v1/management/translations/{key}")
    public ApiResponse<TranslationEntry> reset(@PathVariable String key) { return ApiResponse.of(translations.reset(key)); }
}
