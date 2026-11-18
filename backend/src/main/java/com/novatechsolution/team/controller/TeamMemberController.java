package com.novatechsolution.team.controller;

import com.novatechsolution.shared.web.ApiResponse;
import com.novatechsolution.team.domain.TeamMember;
import com.novatechsolution.team.dto.TeamMemberRequest;
import com.novatechsolution.team.service.TeamMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor
public class TeamMemberController {
    private final TeamMemberService service;
    @GetMapping("/api/v1/team") public ApiResponse<List<PublicTeamMember>> publicList() {
        return ApiResponse.of(service.publicList().stream().map(PublicTeamMember::from).toList());
    }
    @GetMapping("/api/v1/admin/team") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<TeamMember>> adminList() { return ApiResponse.of(service.adminList()); }
    @PostMapping("/api/v1/admin/team") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<TeamMember>> create(@Valid @RequestBody TeamMemberRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(request)));
    }
    @PutMapping("/api/v1/admin/team/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<TeamMember> update(@PathVariable UUID id, @Valid @RequestBody TeamMemberRequest request) {
        return ApiResponse.of(service.update(id, request));
    }
    @DeleteMapping("/api/v1/admin/team/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
