package com.novatechsolution.services.repository;

import com.novatechsolution.services.domain.ServiceContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ServiceContentRepository extends JpaRepository<ServiceContent, UUID> {
    List<ServiceContent> findAllByPublishedTrueOrderByDisplayOrderAsc();
    List<ServiceContent> findAllByOrderByDisplayOrderAsc();
    Optional<ServiceContent> findBySlugAndPublishedTrue(String slug);
    Optional<ServiceContent> findBySlug(String slug);
}
