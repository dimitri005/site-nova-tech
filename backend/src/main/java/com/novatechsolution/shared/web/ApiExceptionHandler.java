package com.novatechsolution.shared.web;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.metadata.ConstraintDescriptor;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> invalidRequest(MethodArgumentNotValidException exception) {
        Map<String, String> fields = new LinkedHashMap<>();
        for (FieldError error : exception.getBindingResult().getFieldErrors()) {
            fields.putIfAbsent(error.getField(), validationMessage(error));
        }
        return ResponseEntity.badRequest().body(new ApiError(Instant.now(), 400,
                fields.isEmpty() ? "La demande est invalide." : "Corrigez les champs indiqués.", fields));
    }

    private String validationMessage(FieldError error) {
        String code = error.getCode();
        if ("NotBlank".equals(code)) return "Ce champ est obligatoire.";
        if ("NotNull".equals(code)) return "Choisissez une valeur pour ce champ.";
        if ("Email".equals(code)) return "Saisissez une adresse e-mail valide.";
        if ("SafeUrl".equals(code)) return "Saisissez une URL HTTP/HTTPS valide ou un chemin /media/.";
        if ("Positive".equals(code)) return "La valeur doit être supérieure à zéro.";
        if ("Pattern".equals(code)) {
            String defaultMessage = error.getDefaultMessage();
            return defaultMessage != null && !defaultMessage.startsWith("must ")
                    ? defaultMessage : "Le format de cette valeur n’est pas valide.";
        }
        if ("Size".equals(code)) {
            try {
                ConstraintDescriptor<?> descriptor = error.unwrap(ConstraintViolation.class).getConstraintDescriptor();
                Object minValue = descriptor.getAttributes().get("min");
                Object maxValue = descriptor.getAttributes().get("max");
                int min = minValue instanceof Number number ? number.intValue() : 0;
                int max = maxValue instanceof Number number ? number.intValue() : Integer.MAX_VALUE;
                String unit = error.getRejectedValue() instanceof CharSequence ? "caractères" : "éléments";
                if (min > 0 && max < Integer.MAX_VALUE)
                    return "Cette valeur doit contenir entre " + min + " et " + max + " " + unit + ".";
                if (min > 0) return "Cette valeur doit contenir au moins " + min + " " + unit + ".";
                if (max < Integer.MAX_VALUE) return "Cette valeur ne peut pas dépasser " + max + " " + unit + ".";
            } catch (RuntimeException ignored) {
                // Keep a clear fallback if the validation provider cannot expose the constraint metadata.
            }
            return "La longueur de cette valeur n’est pas valide.";
        }
        return "Vérifiez cette valeur.";
    }

    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<ApiError> statusError(ResponseStatusException exception) {
        HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());
        return ResponseEntity.status(status).body(new ApiError(Instant.now(), status.value(),
                exception.getReason() == null ? status.getReasonPhrase() : exception.getReason(), Map.of()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<ApiError> conflict(DataIntegrityViolationException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiError(Instant.now(), 409,
                "Une donnée identique existe déjà ou viole une contrainte.", Map.of()));
    }

    public record ApiError(Instant timestamp, int status, String message, Map<String, String> fields) {
    }
}
