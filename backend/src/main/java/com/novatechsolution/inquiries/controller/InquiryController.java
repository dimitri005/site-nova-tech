package com.novatechsolution.inquiries.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.inquiries.domain.ContactMessage;
import com.novatechsolution.inquiries.domain.QuoteRequest;
import com.novatechsolution.inquiries.dto.ContactMessageRequest;
import com.novatechsolution.inquiries.dto.InquiryStatusRequest;
import com.novatechsolution.inquiries.dto.QuoteRequestForm;
import com.novatechsolution.inquiries.service.InquiryService;
import com.novatechsolution.shared.web.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor
public class InquiryController {
    private final InquiryService service;

    @Operation(tags = "Visiteur · Contact et devis", summary = "Envoyer un message de contact", description = "Enregistre un message (nom, e-mail, sujet, message, consentement obligatoire). Un champ piège anti-robot est ignoré et le débit est limité par adresse. Retourne 201.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping("/api/v1/contact-messages")
    public ResponseEntity<ApiResponse<ContactMessage>> contact(@Valid @RequestBody ContactMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.createContact(request), "Message reçu."));
    }
    @Operation(tags = "Visiteur · Contact et devis", summary = "Demander un devis", description = "Enregistre une demande de devis (service, budget, délai, description, consentement obligatoire). Débit limité par adresse. Retourne 201.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping("/api/v1/quote-requests")
    public ResponseEntity<ApiResponse<QuoteRequest>> quote(@Valid @RequestBody QuoteRequestForm request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.createQuote(request), "Demande de devis reçue."));
    }
    @Operation(tags = "Management · Messages de contact", summary = "Lister les messages de contact", description = "Retourne tous les messages reçus, du plus récent au plus ancien. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/contact-messages") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<ContactMessage>> messages() { return ApiResponse.of(service.messages()); }
    @Operation(tags = "Management · Messages de contact", summary = "Changer le statut d’un message", description = "Fait évoluer le statut de traitement (NEW, READ, IN_PROGRESS, RESOLVED…). 404 si inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.") @PatchMapping("/api/v1/management/contact-messages/{id}/status") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<ContactMessage> setMessageStatus(@PathVariable UUID id, @Valid @RequestBody InquiryStatusRequest request) {
        return ApiResponse.of(service.setMessageStatus(id, request));
    }
    @Operation(tags = "Management · Messages de contact", summary = "Supprimer un message", description = "Suppression définitive ; 204 sans corps. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/api/v1/management/contact-messages/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID id) { service.deleteMessage(id); return ResponseEntity.noContent().build(); }

    @Operation(tags = "Management · Demandes de devis", summary = "Lister les demandes de devis", description = "Retourne toutes les demandes, du plus récent au plus ancien. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/quote-requests") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<QuoteRequest>> quotes() { return ApiResponse.of(service.quotes()); }
    @Operation(tags = "Management · Demandes de devis", summary = "Changer le statut et les notes d’un devis", description = "Met à jour le statut (NEW, IN_PROGRESS, ACCEPTED, REJECTED…) et les notes internes, invisibles du demandeur. 404 si inconnue. Rôles requis : SUPER_ADMIN ou EDITOR.") @PatchMapping("/api/v1/management/quote-requests/{id}/status") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<QuoteRequest> setQuoteStatus(@PathVariable UUID id, @Valid @RequestBody InquiryStatusRequest request) {
        return ApiResponse.of(service.setQuoteStatus(id, request));
    }
    @Operation(tags = "Management · Demandes de devis", summary = "Supprimer une demande de devis", description = "Suppression définitive ; 204 sans corps. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/api/v1/management/quote-requests/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> deleteQuote(@PathVariable UUID id) { service.deleteQuote(id); return ResponseEntity.noContent().build(); }
}
