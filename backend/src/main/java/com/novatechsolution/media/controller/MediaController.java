package com.novatechsolution.media.controller;

import com.novatechsolution.media.dto.MediaAssetResponse;
import com.novatechsolution.media.service.MediaService;
import com.novatechsolution.shared.web.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor
@RequestMapping("/api/v1/admin/media")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
public class MediaController {
    private final MediaService service;

    @GetMapping public ApiResponse<List<MediaAssetResponse>> list() { return ApiResponse.of(service.list()); }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MediaAssetResponse>> upload(
            @RequestPart("file") MultipartFile file,
            @RequestPart(value = "altFr", required = false) String altFr,
            @RequestPart(value = "altEn", required = false) String altEn) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.upload(file, altFr, altEn)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
