package com.novatechsolution.enrollment.controller;

import com.novatechsolution.enrollment.domain.Enrollment;
import com.novatechsolution.enrollment.dto.EnrollmentRequest;
import com.novatechsolution.enrollment.dto.EnrollmentStatusRequest;
import com.novatechsolution.enrollment.service.EnrollmentService;
import com.novatechsolution.shared.web.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor
public class EnrollmentController {
    private final EnrollmentService service;

    @PostMapping("/api/v1/enrollments")
    public ResponseEntity<ApiResponse<Enrollment>> create(@Valid @RequestBody EnrollmentRequest request) {
        Enrollment enrollment = service.create(request);
        if (enrollment == null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(null, "Pré-inscription reçue."));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(enrollment, "Pré-inscription reçue."));
    }

    @GetMapping("/api/v1/admin/enrollments") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<Enrollment>> forSession(@RequestParam UUID sessionId) {
        return ApiResponse.of(service.forSession(sessionId));
    }

    @PatchMapping("/api/v1/admin/enrollments/{id}/status") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<Enrollment> changeStatus(@PathVariable UUID id, @Valid @RequestBody EnrollmentStatusRequest request) {
        return ApiResponse.of(service.changeStatus(id, request.status()));
    }

    @GetMapping(value = "/api/v1/admin/enrollments/export", produces = "text/csv")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<byte[]> export(@RequestParam UUID sessionId) {
        StringBuilder csv = new StringBuilder("id,nom,email,téléphone,statut,créé_le\r\n");
        service.forSession(sessionId).forEach(item -> csv.append(item.getId()).append(',')
                .append(escape(item.getFullName())).append(',').append(escape(item.getEmail())).append(',')
                .append(escape(item.getPhone())).append(',').append(item.getStatus()).append(',')
                .append(item.getCreatedAt()).append("\r\n"));
        byte[] content = ("\uFEFF" + csv).getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=pre-inscriptions-" + sessionId + ".csv")
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8)).body(content);
    }

    private String escape(String value) {
        if (!value.isEmpty() && "=+-@\t\r".indexOf(value.charAt(0)) >= 0) value = "'" + value;
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}
