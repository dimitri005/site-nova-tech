package com.novatechsolution.newsletter.service;

import com.novatechsolution.newsletter.domain.NewsletterSubscriber;
import com.novatechsolution.newsletter.dto.NewsletterSubscriberResponse;
import com.novatechsolution.newsletter.repository.NewsletterSubscriberRepository;
import com.novatechsolution.notifications.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;

@Service @RequiredArgsConstructor
public class NewsletterService {
    private static final SecureRandom RANDOM=new SecureRandom();
    private final NewsletterSubscriberRepository subscribers;
    private final NotificationService notifications;
    @Value("${novatech.site.public-url:http://localhost:5173}") private String siteUrl;

    @Transactional public NewsletterSubscriberResponse subscribe(String email,boolean consent,String honeypot){
        if(honeypot!=null&&!honeypot.isBlank())return null;
        if(!consent)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Le consentement est requis.");
        if(email==null||email.isBlank())throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Adresse e-mail invalide.");
        String normalized=email.trim().toLowerCase();
        NewsletterSubscriber subscriber=subscribers.findByEmailIgnoreCase(normalized).orElseGet(NewsletterSubscriber::new);
        if(subscriber.isActive()&&subscriber.getId()!=null)return NewsletterSubscriberResponse.from(subscriber);
        byte[] bytes=new byte[32];RANDOM.nextBytes(bytes);String token=Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        subscriber.setEmail(normalized);subscriber.setConsent(true);subscriber.setActive(true);subscriber.setUnsubscribedAt(null);subscriber.setUnsubscribeTokenHash(hash(token));
        NewsletterSubscriber saved=subscribers.save(subscriber);
        notifications.send(normalized,"Inscription à la newsletter NovaTech", "Vous êtes inscrit(e) à la newsletter NovaTech. Pour vous désabonner, ouvrez ce lien :\n"+siteUrl+"/newsletter/unsubscribe?token="+token);
        return NewsletterSubscriberResponse.from(saved);
    }
    @Transactional public void unsubscribe(String token){
        NewsletterSubscriber subscriber=subscribers.findByUnsubscribeTokenHashAndActiveTrue(hash(token)).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Lien de désabonnement invalide."));
        subscriber.setActive(false);subscriber.setUnsubscribedAt(Instant.now());
    }
    @Transactional(readOnly=true) public List<NewsletterSubscriberResponse> list(){return subscribers.findAllByOrderByCreatedAtDesc().stream().map(NewsletterSubscriberResponse::from).toList();}
    private String hash(String raw){try{return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(raw.getBytes(StandardCharsets.UTF_8)));}catch(Exception e){throw new IllegalStateException(e);}}
}
