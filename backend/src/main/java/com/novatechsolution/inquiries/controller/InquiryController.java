package com.novatechsolution.inquiries.controller;

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

    @PostMapping("/api/v1/contact-messages")
    public ResponseEntity<ApiResponse<ContactMessage>> contact(@Valid @RequestBody ContactMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.createContact(request), "Message reçu."));
    }
    @PostMapping("/api/v1/quote-requests")
    public ResponseEntity<ApiResponse<QuoteRequest>> quote(@Valid @RequestBody QuoteRequestForm request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.createQuote(request), "Demande de devis reçue."));
    }
    @GetMapping("/api/v1/admin/contact-messages") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<ContactMessage>> messages() { return ApiResponse.of(service.messages()); }
    @PatchMapping("/api/v1/admin/contact-messages/{id}/status") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<ContactMessage> setMessageStatus(@PathVariable UUID id, @Valid @RequestBody InquiryStatusRequest request) {
        return ApiResponse.of(service.setMessageStatus(id, request));
    }
    @DeleteMapping("/api/v1/admin/contact-messages/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID id) { service.deleteMessage(id); return ResponseEntity.noContent().build(); }

    @GetMapping("/api/v1/admin/quote-requests") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<QuoteRequest>> quotes() { return ApiResponse.of(service.quotes()); }
    @PatchMapping("/api/v1/admin/quote-requests/{id}/status") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<QuoteRequest> setQuoteStatus(@PathVariable UUID id, @Valid @RequestBody InquiryStatusRequest request) {
        return ApiResponse.of(service.setQuoteStatus(id, request));
    }
    @DeleteMapping("/api/v1/admin/quote-requests/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> deleteQuote(@PathVariable UUID id) { service.deleteQuote(id); return ResponseEntity.noContent().build(); }
}
