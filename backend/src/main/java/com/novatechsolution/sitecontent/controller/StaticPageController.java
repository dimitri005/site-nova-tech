package com.novatechsolution.sitecontent.controller;

import com.novatechsolution.shared.web.ApiResponse;
import com.novatechsolution.sitecontent.domain.StaticPage;
import com.novatechsolution.sitecontent.dto.StaticPageRequest;
import com.novatechsolution.sitecontent.service.StaticPageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequiredArgsConstructor
public class StaticPageController {
    private final StaticPageService service;
    @GetMapping("/api/v1/site-content/pages") public ApiResponse<List<StaticPage>> publicList() { return ApiResponse.of(service.publicList()); }
    @GetMapping("/api/v1/site-content/pages/{slug}") public ApiResponse<StaticPage> publicFind(@PathVariable String slug) { return ApiResponse.of(service.publicFind(slug)); }
    @GetMapping("/api/v1/admin/site-content/pages") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<StaticPage>> adminList() { return ApiResponse.of(service.adminList()); }
    @PutMapping("/api/v1/admin/site-content/pages") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<StaticPage>> save(@Valid @RequestBody StaticPageRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(service.save(request)));
    }
    @DeleteMapping("/api/v1/admin/site-content/pages/{slug}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> delete(@PathVariable String slug) { service.delete(slug); return ResponseEntity.noContent().build(); }
}
