package com.novatechsolution.identity.controller;

import com.novatechsolution.identity.dto.LoginRequest;
import com.novatechsolution.identity.dto.LoginResponse;
import com.novatechsolution.identity.dto.RefreshRequest;
import com.novatechsolution.identity.dto.ForgotPasswordRequest;
import com.novatechsolution.identity.dto.ResetPasswordRequest;
import com.novatechsolution.identity.service.IdentityService;
import com.novatechsolution.shared.web.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final IdentityService identityService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.of(identityService.login(request)));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(ApiResponse.of(identityService.refresh(request.refreshToken())));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) RefreshRequest request) {
        identityService.logout(request == null ? null : request.refreshToken());
        return ResponseEntity.ok(ApiResponse.of(null, "Session terminée."));
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        identityService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.of(null, "Si ce compte existe, un lien de réinitialisation sera envoyé par e-mail."));
    }

    @PostMapping("/password/reset")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        identityService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.of(null, "Mot de passe mis à jour."));
    }
}
