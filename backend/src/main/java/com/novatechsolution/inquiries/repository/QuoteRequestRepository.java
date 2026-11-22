package com.novatechsolution.inquiries.repository;

import com.novatechsolution.inquiries.domain.QuoteRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, UUID> {
    List<QuoteRequest> findAllByOrderByCreatedAtDesc();
}
