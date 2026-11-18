package com.novatechsolution.newsletter.dto;

import com.novatechsolution.newsletter.domain.NewsletterSubscriber;
import java.time.Instant;
import java.util.UUID;

public record NewsletterSubscriberResponse(UUID id,String email,boolean active,Instant createdAt,Instant unsubscribedAt){
    public static NewsletterSubscriberResponse from(NewsletterSubscriber s){return new NewsletterSubscriberResponse(s.getId(),s.getEmail(),s.isActive(),s.getCreatedAt(),s.getUnsubscribedAt());}
}
