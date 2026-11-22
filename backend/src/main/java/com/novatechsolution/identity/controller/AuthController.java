package com.novatechsolution.identity.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.identity.dto.LoginRequest;
import com.novatechsolution.identity.dto.LoginResponse;
import com.novatechsolution.identity.dto.RefreshRequest;
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

    @Operation(tags = "Authentification · Session", summary = "Ouvrir une session", description = "Vérifie l’e-mail et le mot de passe puis retourne un jeton d’accès JWT à courte durée et un jeton de renouvellement. Débit limité par adresse. 401 si les identifiants sont invalides ou le compte désactivé.") @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.of(identityService.login(request)));
    }

    @Operation(tags = "Authentification · Session", summary = "Renouveler la session", description = "Échange un jeton de renouvellement valide contre une nouvelle paire de jetons ; l’ancien jeton est révoqué (rotation). 401 s’il est expiré, révoqué ou inconnu.") @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(ApiResponse.of(identityService.refresh(request.refreshToken())));
    }

    @Operation(tags = "Authentification · Session", summary = "Fermer la session", description = "Révoque le jeton de renouvellement fourni. Opération idempotente : retourne toujours un succès.") @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) RefreshRequest request) {
        identityService.logout(request == null ? null : request.refreshToken());
        return ResponseEntity.ok(ApiResponse.of(null, "Session terminée."));
    }

}
