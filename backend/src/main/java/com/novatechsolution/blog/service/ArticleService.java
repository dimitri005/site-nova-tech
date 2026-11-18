package com.novatechsolution.blog.service;

import com.novatechsolution.blog.domain.Article;
import com.novatechsolution.blog.domain.ArticleStatus;
import com.novatechsolution.blog.dto.ArticleRequest;
import com.novatechsolution.blog.repository.ArticleRepository;
import com.novatechsolution.shared.domain.Slugger;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class ArticleService {
    private final ArticleRepository articles;
    @Transactional(readOnly=true) public List<Article> publicList(){return articles.findAllByStatusOrderByPublishedAtDesc(ArticleStatus.PUBLISHED);}
    @Transactional(readOnly=true) public Article publicFind(String slug){return articles.findBySlugAndStatus(slug,ArticleStatus.PUBLISHED).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Article introuvable."));}
    @Transactional(readOnly=true) public List<Article> adminList(){return articles.findAllByOrderByCreatedAtDesc();}
    @Transactional(readOnly=true) public long publishedCount(){return articles.countByPublishedTrue();}
    @Transactional public Article create(ArticleRequest r){Article a=new Article();apply(a,r);return articles.save(a);}
    @Transactional public Article update(UUID id,ArticleRequest r){Article a=articles.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Article introuvable."));apply(a,r);return a;}
    @Transactional public void delete(UUID id){if(!articles.existsById(id))throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Article introuvable.");articles.deleteById(id);}
    private void apply(Article a,ArticleRequest r){
        Instant now=Instant.now(); a.setSlug(Slugger.from(r.slug())); a.setTitleFr(r.titleFr().trim()); a.setTitleEn(r.titleEn().trim());
        a.setExcerptFr(r.excerptFr().trim()); a.setExcerptEn(r.excerptEn().trim());
        a.setBodyFr(Jsoup.clean(r.bodyFr(),Safelist.relaxed())); a.setBodyEn(Jsoup.clean(r.bodyEn(),Safelist.relaxed()));
        a.setCategory(r.category().trim()); a.setCoverImageUrl(r.coverImageUrl()); a.setSeoTitleFr(r.seoTitleFr()); a.setSeoTitleEn(r.seoTitleEn());
        a.setSeoDescriptionFr(r.seoDescriptionFr()); a.setSeoDescriptionEn(r.seoDescriptionEn());
        if(r.status()==ArticleStatus.PUBLISHED&&a.getPublishedAt()==null)a.setPublishedAt(now);
        if(r.status()==ArticleStatus.DRAFT)a.setPublishedAt(null);
        a.setStatus(r.status()); a.setUpdatedAt(now);
    }
}
