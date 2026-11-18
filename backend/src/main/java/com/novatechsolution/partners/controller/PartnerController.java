package com.novatechsolution.partners.controller;

import com.novatechsolution.partners.domain.Partner;
import com.novatechsolution.partners.dto.PartnerRequest;
import com.novatechsolution.partners.service.PartnerService;
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
public class PartnerController {
    private final PartnerService service;
    @GetMapping("/api/v1/partners") public ApiResponse<List<Partner>> publicList(){return ApiResponse.of(service.publicList());}
    @GetMapping("/api/v1/admin/partners") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<List<Partner>> adminList(){return ApiResponse.of(service.adminList());}
    @PostMapping("/api/v1/admin/partners") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<ApiResponse<Partner>> create(@Valid @RequestBody PartnerRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(r)));}
    @PutMapping("/api/v1/admin/partners/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<Partner> update(@PathVariable UUID id,@Valid @RequestBody PartnerRequest r){return ApiResponse.of(service.update(id,r));}
    @DeleteMapping("/api/v1/admin/partners/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<Void> delete(@PathVariable UUID id){service.delete(id);return ResponseEntity.noContent().build();}
}
