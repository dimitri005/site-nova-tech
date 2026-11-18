package com.novatechsolution.inquiries.service;

import com.novatechsolution.inquiries.domain.ContactMessage;
import com.novatechsolution.inquiries.domain.InquiryStatus;
import com.novatechsolution.inquiries.domain.QuoteRequest;
import com.novatechsolution.inquiries.dto.ContactMessageRequest;
import com.novatechsolution.inquiries.dto.InquiryStatusRequest;
import com.novatechsolution.inquiries.dto.QuoteRequestForm;
import com.novatechsolution.inquiries.repository.ContactMessageRepository;
import com.novatechsolution.inquiries.repository.QuoteRequestRepository;
import com.novatechsolution.notifications.service.NotificationService;
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
    private final NotificationService notifications;

    @Transactional
    public ContactMessage createContact(ContactMessageRequest r) {
        requireConsent(r.consent()); if (isSpam(r.website())) return null;
        ContactMessage item = new ContactMessage(); item.setFullName(r.fullName().trim());
        item.setEmail(r.email().trim().toLowerCase()); item.setPhone(r.phone()); item.setSubject(r.subject().trim());
        item.setMessage(r.message().trim()); item.setLanguage(language(r.language())); item.setConsent(true);
        ContactMessage saved = messages.save(item);
        notifications.notifyCompany("Nouveau message - " + saved.getSubject(),
                saved.getFullName() + " <" + saved.getEmail() + ">\n" + saved.getPhone() + "\n\n" + saved.getMessage());
        notifications.send(saved.getEmail(), "Votre message a bien été reçu - NovaTech",
                "Bonjour " + saved.getFullName() + ",\n\nNous avons bien reçu votre message et vous répondrons rapidement.");
        return saved;
    }

    @Transactional
    public QuoteRequest createQuote(QuoteRequestForm r) {
        requireConsent(r.consent()); if (isSpam(r.website())) return null;
        QuoteRequest item = new QuoteRequest(); item.setFullName(r.fullName().trim()); item.setEmail(r.email().trim().toLowerCase());
        item.setPhone(r.phone()); item.setServiceType(r.serviceType().trim()); item.setProjectDescription(r.projectDescription().trim());
        item.setBudgetRange(r.budgetRange()); item.setDesiredDeadline(r.desiredDeadline()); item.setLanguage(language(r.language())); item.setConsent(true);
        QuoteRequest saved = quotes.save(item);
        notifications.notifyCompany("Nouvelle demande de devis NovaTech",
                saved.getFullName() + " <" + saved.getEmail() + ">\nService : " + saved.getServiceType()
                        + "\nBudget : " + saved.getBudgetRange() + "\nDélai : " + saved.getDesiredDeadline()
                        + "\n\n" + saved.getProjectDescription());
        notifications.send(saved.getEmail(), "Votre demande de devis a bien été reçue - NovaTech",
                "Bonjour " + saved.getFullName() + ",\n\nNous avons bien reçu votre demande de devis. Notre équipe vous recontactera.");
        return saved;
    }

    @Transactional(readOnly = true) public List<ContactMessage> messages() { return messages.findAllByOrderByCreatedAtDesc(); }
    @Transactional(readOnly = true) public List<QuoteRequest> quotes() { return quotes.findAllByOrderByCreatedAtDesc(); }
    @Transactional(readOnly = true) public long unreadMessageCount() { return messages.countByStatus(InquiryStatus.NEW); }
    @Transactional(readOnly = true) public long pendingQuoteCount() {
        return quotes.countByStatus(InquiryStatus.NEW) + quotes.countByStatus(InquiryStatus.IN_PROGRESS);
    }

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
    @Transactional
    public void reply(UUID id, String body) {
        ContactMessage m = messages.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message introuvable."));
        notifications.send(m.getEmail(), "Réponse de NovaTech Solution - " + m.getSubject(), body);
        m.setStatus(InquiryStatus.RESOLVED); m.setUpdatedAt(Instant.now());
    }
    @Transactional public void deleteMessage(UUID id) { if (!messages.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Message introuvable."); messages.deleteById(id); }
    @Transactional public void deleteQuote(UUID id) { if (!quotes.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Demande de devis introuvable."); quotes.deleteById(id); }

    private boolean isSpam(String website) { return website != null && !website.isBlank(); }
    private void requireConsent(Boolean consent) { if (!Boolean.TRUE.equals(consent)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le consentement à la politique de confidentialité est requis."); }
    private String language(String value) { return "en".equalsIgnoreCase(value) ? "en" : "fr"; }
}
