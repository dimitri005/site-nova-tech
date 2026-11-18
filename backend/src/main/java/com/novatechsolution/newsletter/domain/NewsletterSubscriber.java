package com.novatechsolution.newsletter.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="newsletter_subscribers") @Getter @Setter @NoArgsConstructor
public class NewsletterSubscriber {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(nullable=false,unique=true,length=254) private String email;
    @Column(name="unsubscribe_token_hash",nullable=false,length=64) private String unsubscribeTokenHash;
    @Column(nullable=false) private boolean consent;
    @Column(nullable=false) private boolean active=true;
    @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt=Instant.now();
    @Column(name="unsubscribed_at") private Instant unsubscribedAt;
}
