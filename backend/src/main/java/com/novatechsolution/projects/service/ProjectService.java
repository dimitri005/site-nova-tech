package com.novatechsolution.projects.service;

import com.novatechsolution.projects.domain.Project;
import com.novatechsolution.projects.dto.ProjectRequest;
import com.novatechsolution.projects.repository.ProjectRepository;
import com.novatechsolution.shared.domain.Slugger;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projects;
    @Transactional(readOnly = true) public List<Project> publicList() { return projects.findAllByPublishedTrueOrderByProjectDateDesc(); }
    @Transactional(readOnly = true) public List<Project> adminList() { return projects.findAllByOrderByCreatedAtDesc(); }
    @Transactional(readOnly = true) public long publishedCount() { return projects.countByPublishedTrue(); }
    @Transactional(readOnly = true) public Project publicFind(String slug) {
        return projects.findBySlugAndPublishedTrue(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Réalisation introuvable."));
    }
    @Transactional
    public Project create(ProjectRequest request) { Project project = new Project(); apply(project, request); return projects.save(project); }
    @Transactional
    public Project update(UUID id, ProjectRequest request) {
        Project project = projects.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Réalisation introuvable."));
        apply(project, request); project.setUpdatedAt(Instant.now()); return project;
    }
    @Transactional
    public void delete(UUID id) { if (!projects.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Réalisation introuvable."); projects.deleteById(id); }
    private void apply(Project p, ProjectRequest r) {
        p.setSlug(Slugger.from(r.slug())); p.setTitleFr(r.titleFr().trim()); p.setTitleEn(r.titleEn().trim());
        p.setDescriptionFr(r.descriptionFr().trim()); p.setDescriptionEn(r.descriptionEn().trim()); p.setCategory(r.category().trim());
        p.setClientName(r.clientName()); p.setTechnologies(r.technologies() == null ? List.of() : r.technologies().stream().distinct().toList());
        p.setGalleryUrls(r.galleryUrls() == null ? List.of() : List.copyOf(r.galleryUrls())); p.setCoverImageUrl(r.coverImageUrl());
        p.setProjectDate(r.projectDate()); p.setProjectUrl(r.projectUrl()); p.setFeatured(r.featured()); p.setPublished(r.published());
    }
}
