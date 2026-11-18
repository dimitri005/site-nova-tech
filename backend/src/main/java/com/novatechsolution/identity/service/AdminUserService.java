package com.novatechsolution.identity.service;

import com.novatechsolution.identity.domain.AdminRole;
import com.novatechsolution.identity.domain.AdminUser;
import com.novatechsolution.identity.dto.AdminUserRequest;
import com.novatechsolution.identity.dto.AdminUserResponse;
import com.novatechsolution.identity.repository.AdminUserRepository;
import com.novatechsolution.identity.repository.RefreshSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class AdminUserService {
    private final AdminUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final RefreshSessionRepository refreshSessions;

    @Transactional(readOnly = true)
    public List<AdminUserResponse> list() { return users.findAll().stream().map(AdminUserResponse::from).toList(); }

    @Transactional
    public AdminUserResponse create(AdminUserRequest request) {
        if (request.password() == null || request.password().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un mot de passe initial est obligatoire.");
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Cette adresse e-mail est déjà utilisée.");
        AdminUser user = new AdminUser(); apply(user, request, true); user.setEmail(email);
        return AdminUserResponse.from(users.save(user));
    }

    @Transactional
    public AdminUserResponse update(UUID id, AdminUserRequest request) {
        AdminUser user = users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compte introuvable."));
        String email = request.email().trim().toLowerCase();
        users.findByEmailIgnoreCase(email).filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Cette adresse e-mail est déjà utilisée."); });
        preserveLastSuperAdmin(user, request.roles(), request.enabled());
        boolean revokeSessions = !request.enabled() || (request.password() != null && !request.password().isBlank())
                || !user.getRoles().equals(request.roles()) || !user.getEmail().equalsIgnoreCase(email);
        apply(user, request, false); user.setEmail(email);
        if (revokeSessions) refreshSessions.findAllByAdminUserIdAndRevokedAtIsNull(id).forEach(session -> session.setRevokedAt(java.time.Instant.now()));
        return AdminUserResponse.from(user);
    }

    @Transactional
    public void delete(UUID id) {
        AdminUser user = users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compte introuvable."));
        preserveLastSuperAdmin(user, java.util.Set.of(), false);
        refreshSessions.findAllByAdminUserIdAndRevokedAtIsNull(id).forEach(session -> session.setRevokedAt(java.time.Instant.now()));
        users.delete(user);
    }

    private void apply(AdminUser user, AdminUserRequest request, boolean create) {
        user.setDisplayName(request.displayName().trim()); user.setRoles(java.util.Set.copyOf(request.roles()));
        user.setEnabled(request.enabled());
        if (request.password() != null && !request.password().isBlank()) user.setPasswordHash(passwordEncoder.encode(request.password()));
        else if (create) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un mot de passe initial est obligatoire.");
    }

    private void preserveLastSuperAdmin(AdminUser user, java.util.Set<AdminRole> newRoles, boolean enabled) {
        if (user.getRoles().contains(AdminRole.SUPER_ADMIN) && (!newRoles.contains(AdminRole.SUPER_ADMIN) || !enabled)) {
            long activeAdmins = users.findAll().stream()
                    .filter(AdminUser::isEnabled).filter(candidate -> candidate.getRoles().contains(AdminRole.SUPER_ADMIN)).count();
            if (activeAdmins <= 1) throw new ResponseStatusException(HttpStatus.CONFLICT, "Le dernier super administrateur actif ne peut pas être désactivé, supprimé ou rétrogradé.");
        }
    }
}
