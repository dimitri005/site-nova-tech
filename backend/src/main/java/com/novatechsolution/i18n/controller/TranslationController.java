package com.novatechsolution.i18n.controller;

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

    @GetMapping("/api/v1/i18n/{locale}")
    public ApiResponse<Map<String, Object>> catalog(@PathVariable String locale) {
        return ApiResponse.of(translations.catalog(locale));
    }
}
