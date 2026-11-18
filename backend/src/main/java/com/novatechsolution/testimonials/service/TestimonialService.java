package com.novatechsolution.testimonials.service;

import com.novatechsolution.testimonials.domain.Testimonial;
import com.novatechsolution.testimonials.dto.TestimonialRequest;
import com.novatechsolution.testimonials.repository.TestimonialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class TestimonialService {
    private final TestimonialRepository repository;
    @Transactional(readOnly = true) public List<Testimonial> publicList() { return repository.findAllByPublishedTrueOrderByDisplayOrderAsc(); }
    @Transactional(readOnly = true) public List<Testimonial> adminList() { return repository.findAllByOrderByDisplayOrderAsc(); }
    @Transactional public Testimonial create(TestimonialRequest r) { Testimonial t = new Testimonial(); apply(t,r); return repository.save(t); }
    @Transactional public Testimonial update(UUID id, TestimonialRequest r) { Testimonial t=repository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Témoignage introuvable.")); apply(t,r); return t; }
    @Transactional public void delete(UUID id) { if(!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Témoignage introuvable."); repository.deleteById(id); }
    private void apply(Testimonial t, TestimonialRequest r) { t.setAuthorName(r.authorName().trim()); t.setAuthorRoleFr(r.authorRoleFr()); t.setAuthorRoleEn(r.authorRoleEn()); t.setOrganizationName(r.organizationName()); t.setQuoteFr(r.quoteFr().trim()); t.setQuoteEn(r.quoteEn().trim()); t.setRating(r.rating()); t.setDisplayOrder(r.displayOrder()); t.setPublished(r.published()); }
}
