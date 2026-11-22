package com.novatechsolution.media.controller;

import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/v1/management/media")
@PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
public class MediaController {
    private final MediaService service;

    @Operation(tags = "Management · Médiathèque", summary = "Lister les médias", description = "Retourne les images téléversées avec leur URL publique, leur taille et leurs textes alternatifs. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping public ApiResponse<List<MediaAssetResponse>> list() { return ApiResponse.of(service.list()); }

    @Operation(tags = "Management · Médiathèque", summary = "Téléverser une image", description = "Reçoit un fichier JPEG ou PNG (multipart/form-data, 10 Mo maximum). Le contenu réel est vérifié, l’image est redimensionnée et compressée avant stockage. Retourne 201. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MediaAssetResponse>> upload(
            @RequestPart("file") MultipartFile file,
            @RequestPart(value = "altFr", required = false) String altFr,
            @RequestPart(value = "altEn", required = false) String altEn) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.upload(file, altFr, altEn)));
    }

    @Operation(tags = "Management · Médiathèque", summary = "Supprimer un média", description = "Supprime la fiche et le fichier ; 204 sans corps. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
