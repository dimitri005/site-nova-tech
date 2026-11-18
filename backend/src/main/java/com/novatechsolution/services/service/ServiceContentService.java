package com.novatechsolution.services.service;

import com.novatechsolution.services.domain.ServiceContent;
import com.novatechsolution.services.dto.ServiceContentRequest;
import com.novatechsolution.services.repository.ServiceContentRepository;
import com.novatechsolution.shared.domain.Slugger;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServiceContentService {
    private final ServiceContentRepository services;

    @Transactional(readOnly = true)
    public List<ServiceContent> publicList() { return services.findAllByPublishedTrueOrderByDisplayOrderAsc(); }

    @Transactional(readOnly = true)
    public ServiceContent publicFind(String slug) {
        return services.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service introuvable."));
    }

    @Transactional(readOnly = true)
    public List<ServiceContent> adminList() { return services.findAllByOrderByDisplayOrderAsc(); }

    @Transactional
    public ServiceContent create(ServiceContentRequest request) {
        ServiceContent content = new ServiceContent();
        apply(content, request);
        return services.save(content);
    }

    @Transactional
    public ServiceContent update(UUID id, ServiceContentRequest request) {
        ServiceContent content = services.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service introuvable."));
        apply(content, request);
        content.setUpdatedAt(Instant.now());
        return content;
    }

    @Transactional
    public void delete(UUID id) {
        if (!services.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service introuvable.");
        services.deleteById(id);
    }

    private void apply(ServiceContent item, ServiceContentRequest request) {
        item.setSlug(Slugger.from(request.slug()));
        item.setCategory(request.category().trim());
        item.setTitleFr(request.titleFr().trim()); item.setTitleEn(request.titleEn().trim());
        item.setDescriptionFr(request.descriptionFr().trim()); item.setDescriptionEn(request.descriptionEn().trim());
        item.setImageUrl(request.imageUrl()); item.setDisplayOrder(request.displayOrder());
        item.setPublished(request.published());
    }
}
