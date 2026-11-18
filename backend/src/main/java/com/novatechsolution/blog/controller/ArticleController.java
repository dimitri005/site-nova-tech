package com.novatechsolution.blog.controller;

import com.novatechsolution.blog.domain.Article;
import com.novatechsolution.blog.dto.ArticleRequest;
import com.novatechsolution.blog.service.ArticleService;
import com.novatechsolution.shared.web.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor
public class ArticleController {
    private final ArticleService service;
    @GetMapping("/api/v1/articles") public ApiResponse<List<Article>> publicList(){return ApiResponse.of(service.publicList());}
    @GetMapping("/api/v1/articles/{slug}") public ApiResponse<Article> publicFind(@PathVariable String slug){return ApiResponse.of(service.publicFind(slug));}
    @GetMapping("/api/v1/admin/articles") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<List<Article>> adminList(){return ApiResponse.of(service.adminList());}
    @PostMapping("/api/v1/admin/articles") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<ApiResponse<Article>> create(@Valid @RequestBody ArticleRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(r)));}
    @PutMapping("/api/v1/admin/articles/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<Article> update(@PathVariable UUID id,@Valid @RequestBody ArticleRequest r){return ApiResponse.of(service.update(id,r));}
    @DeleteMapping("/api/v1/admin/articles/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<Void> delete(@PathVariable UUID id){service.delete(id);return ResponseEntity.noContent().build();}
}
