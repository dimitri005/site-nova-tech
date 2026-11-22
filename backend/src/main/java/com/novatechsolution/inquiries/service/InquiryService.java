package com.novatechsolution.inquiries.service;

import com.novatechsolution.inquiries.domain.ContactMessage;
import com.novatechsolution.inquiries.domain.InquiryStatus;
import com.novatechsolution.inquiries.domain.QuoteRequest;
import com.novatechsolution.inquiries.dto.ContactMessageRequest;
import com.novatechsolution.inquiries.dto.InquiryStatusRequest;
import com.novatechsolution.inquiries.dto.QuoteRequestForm;
import com.novatechsolution.inquiries.repository.ContactMessageRepository;
import com.novatechsolution.inquiries.repository.QuoteRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class InquiryService {
    private final ContactMessageRepository messages;
    private final QuoteRequestRepository quotes;

    @Transactional
    public ContactMessage createContact(ContactMessageRequest r) {
        requireConsent(r.consent()); if (isSpam(r.website())) return null;
        ContactMessage item = new ContactMessage(); item.setFullName(r.fullName().trim());
        item.setEmail(r.email().trim().toLowerCase()); item.setPhone(r.phone()); item.setSubject(r.subject().trim());
        item.setMessage(r.message().trim()); item.setLanguage(language(r.language())); item.setConsent(true);
        ContactMessage saved = messages.save(item);
        return saved;
    }

    @Transactional
    public QuoteRequest createQuote(QuoteRequestForm r) {
        requireConsent(r.consent()); if (isSpam(r.website())) return null;
        QuoteRequest item = new QuoteRequest(); item.setFullName(r.fullName().trim()); item.setEmail(r.email().trim().toLowerCase());
        item.setPhone(r.phone()); item.setServiceType(r.serviceType().trim()); item.setProjectDescription(r.projectDescription().trim());
        item.setBudgetRange(r.budgetRange()); item.setDesiredDeadline(r.desiredDeadline()); item.setLanguage(language(r.language())); item.setConsent(true);
        QuoteRequest saved = quotes.save(item);
        return saved;
    }

    @Transactional(readOnly = true) public List<ContactMessage> messages() { return messages.findAllByOrderByCreatedAtDesc(); }
    @Transactional(readOnly = true) public List<QuoteRequest> quotes() { return quotes.findAllByOrderByCreatedAtDesc(); }
    @Transactional
    public ContactMessage setMessageStatus(UUID id, InquiryStatusRequest r) {
        if (!java.util.Set.of(InquiryStatus.NEW, InquiryStatus.READ, InquiryStatus.RESOLVED).contains(r.status()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Statut invalide pour un message de contact.");
        ContactMessage m = messages.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message introuvable."));
        m.setStatus(r.status()); m.setUpdatedAt(Instant.now()); return m;
    }
    @Transactional
    public QuoteRequest setQuoteStatus(UUID id, InquiryStatusRequest r) {
        if (!java.util.Set.of(InquiryStatus.NEW, InquiryStatus.IN_PROGRESS, InquiryStatus.ACCEPTED, InquiryStatus.REJECTED).contains(r.status()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Statut invalide pour une demande de devis.");
        QuoteRequest q = quotes.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Demande de devis introuvable."));
        q.setStatus(r.status()); q.setInternalNotes(r.internalNotes()); q.setUpdatedAt(Instant.now()); return q;
    }
    @Transactional public void deleteMessage(UUID id) { if (!messages.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Message introuvable."); messages.deleteById(id); }
    @Transactional public void deleteQuote(UUID id) { if (!quotes.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Demande de devis introuvable."); quotes.deleteById(id); }

    private boolean isSpam(String website) { return website != null && !website.isBlank(); }
    private void requireConsent(Boolean consent) { if (!Boolean.TRUE.equals(consent)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le consentement à la politique de confidentialité est requis."); }
    private String language(String value) { return "en".equalsIgnoreCase(value) ? "en" : "fr"; }
}
