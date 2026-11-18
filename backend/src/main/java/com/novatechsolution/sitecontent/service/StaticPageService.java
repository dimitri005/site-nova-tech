package com.novatechsolution.sitecontent.service;

import com.novatechsolution.sitecontent.domain.StaticPage;
import com.novatechsolution.sitecontent.dto.StaticPageRequest;
import com.novatechsolution.sitecontent.repository.StaticPageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import java.time.Instant;
import java.util.List;

@Service @RequiredArgsConstructor
public class StaticPageService {
    private final StaticPageRepository pages;
    @Transactional(readOnly = true) public List<StaticPage> publicList() { return pages.findAllByPublishedTrueOrderBySlugAsc(); }
    @Transactional(readOnly = true) public List<StaticPage> adminList() { return pages.findAllByOrderBySlugAsc(); }
    @Transactional(readOnly = true) public StaticPage publicFind(String slug) {
        return pages.findBySlugAndPublishedTrue(slug).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Page introuvable."));
    }
    @Transactional public StaticPage save(StaticPageRequest r) {
        StaticPage p = pages.findById(r.slug()).orElseGet(StaticPage::new); p.setSlug(r.slug());
        p.setTitleFr(r.titleFr().trim()); p.setTitleEn(r.titleEn().trim());
        p.setBodyFr(Jsoup.clean(r.bodyFr(), Safelist.relaxed())); p.setBodyEn(Jsoup.clean(r.bodyEn(), Safelist.relaxed()));
        p.setPublished(r.published()); p.setUpdatedAt(Instant.now()); return pages.save(p);
    }
    @Transactional public void delete(String slug) { if (!pages.existsById(slug)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Page introuvable."); pages.deleteById(slug); }
}
