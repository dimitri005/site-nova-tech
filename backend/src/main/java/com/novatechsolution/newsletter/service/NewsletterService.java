package com.novatechsolution.newsletter.service;

import com.novatechsolution.newsletter.domain.NewsletterSubscriber;
import com.novatechsolution.newsletter.dto.NewsletterSubscriberResponse;
import com.novatechsolution.newsletter.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.HexFormat;
import java.util.List;

@Service @RequiredArgsConstructor
public class NewsletterService {
    private final NewsletterSubscriberRepository subscribers;
    @Transactional public void unsubscribe(String token){
        NewsletterSubscriber subscriber=subscribers.findByUnsubscribeTokenHashAndActiveTrue(hash(token)).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Lien de désabonnement invalide."));
        subscriber.setActive(false);subscriber.setUnsubscribedAt(Instant.now());
    }
    @Transactional(readOnly=true) public List<NewsletterSubscriberResponse> list(){return subscribers.findAllByOrderByCreatedAtDesc().stream().map(NewsletterSubscriberResponse::from).toList();}
    private String hash(String raw){try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(raw.getBytes(StandardCharsets.UTF_8)));}catch(Exception e){throw new IllegalStateException(e);}}
}
