package com.novatechsolution.identity.service;

import com.novatechsolution.identity.domain.AdminRole;
import com.novatechsolution.identity.domain.AdminUser;
import com.novatechsolution.identity.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "ADMIN_INITIAL_PASSWORD")
public class AdminBootstrapRunner implements ApplicationRunner {
    private final AdminUserRepository users;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_INITIAL_EMAIL:}")
    private String email;

    @Value("${ADMIN_INITIAL_PASSWORD}")
    private String initialPassword;

    @Value("${ADMIN_INITIAL_NAME:Administrateur NovaTech}")
    private String displayName;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (email.isBlank() || initialPassword.length() < 12
                || !initialPassword.matches("(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+")) {
            throw new IllegalStateException("ADMIN_INITIAL_EMAIL is required; ADMIN_INITIAL_PASSWORD must be at least 12 characters and include upper/lower case letters and a digit");
        }
        String normalizedEmail = email.trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(normalizedEmail)) {
            return;
        }
        AdminUser admin = new AdminUser();
        admin.setEmail(normalizedEmail);
        admin.setDisplayName(displayName.trim());
        admin.setPasswordHash(passwordEncoder.encode(initialPassword));
        admin.setRoles(Set.of(AdminRole.SUPER_ADMIN));
        users.save(admin);
    }
}
