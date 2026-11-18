package com.novatechsolution.blog.repository;

import com.novatechsolution.blog.domain.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {
    List<Article> findAllByStatusOrderByPublishedAtDesc(com.novatechsolution.blog.domain.ArticleStatus status);
    List<Article> findAllByOrderByCreatedAtDesc();
    Optional<Article> findBySlugAndStatus(String slug, com.novatechsolution.blog.domain.ArticleStatus status);
    long countByStatus(com.novatechsolution.blog.domain.ArticleStatus status);
    default long countByPublishedTrue() { return countByStatus(com.novatechsolution.blog.domain.ArticleStatus.PUBLISHED); }
}
