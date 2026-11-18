package com.novatechsolution.newsletter.repository;

import com.novatechsolution.newsletter.domain.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber,UUID>{
    Optional<NewsletterSubscriber> findByEmailIgnoreCase(String email);
    Optional<NewsletterSubscriber> findByUnsubscribeTokenHashAndActiveTrue(String hash);
    List<NewsletterSubscriber> findAllByOrderByCreatedAtDesc();
}
