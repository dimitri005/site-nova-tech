package com.novatechsolution.testimonials.controller;

import com.novatechsolution.shared.web.ApiResponse;
import com.novatechsolution.testimonials.domain.Testimonial;
import com.novatechsolution.testimonials.dto.TestimonialRequest;
import com.novatechsolution.testimonials.service.TestimonialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor
public class TestimonialController {
    private final TestimonialService service;
    @GetMapping("/api/v1/testimonials") public ApiResponse<List<Testimonial>> publicList() { return ApiResponse.of(service.publicList()); }
    @GetMapping("/api/v1/admin/testimonials") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<List<Testimonial>> adminList() { return ApiResponse.of(service.adminList()); }
    @PostMapping("/api/v1/admin/testimonials") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<ApiResponse<Testimonial>> create(@Valid @RequestBody TestimonialRequest r) { return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(r))); }
    @PutMapping("/api/v1/admin/testimonials/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<Testimonial> update(@PathVariable UUID id,@Valid @RequestBody TestimonialRequest r) { return ApiResponse.of(service.update(id,r)); }
    @DeleteMapping("/api/v1/admin/testimonials/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
