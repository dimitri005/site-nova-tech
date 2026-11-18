package com.novatechsolution.testimonials.repository;

import com.novatechsolution.testimonials.domain.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TestimonialRepository extends JpaRepository<Testimonial, UUID> {
    List<Testimonial> findAllByPublishedTrueOrderByDisplayOrderAsc();
    List<Testimonial> findAllByOrderByDisplayOrderAsc();
    long countByPublishedTrue();
}
