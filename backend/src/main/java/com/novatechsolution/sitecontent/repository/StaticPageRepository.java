package com.novatechsolution.sitecontent.repository;

import com.novatechsolution.sitecontent.domain.StaticPage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StaticPageRepository extends JpaRepository<StaticPage, String> {
    List<StaticPage> findAllByPublishedTrueOrderBySlugAsc();
    List<StaticPage> findAllByOrderBySlugAsc();
    Optional<StaticPage> findBySlugAndPublishedTrue(String slug);
}
