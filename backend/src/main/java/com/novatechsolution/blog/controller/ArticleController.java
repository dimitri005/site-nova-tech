package com.novatechsolution.blog.controller;

import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(tags = "Visiteur · Actualités", summary = "Lister les articles publiés", description = "Retourne uniquement les articles publiés, triés du plus récent au plus ancien (date de publication). Lecture seule, sans authentification.") @GetMapping("/api/v1/articles") public ApiResponse<List<Article>> publicList(){return ApiResponse.of(service.publicList());}
    @Operation(tags = "Visiteur · Actualités", summary = "Consulter un article publié", description = "Retourne le détail d'un article publié à partir de son identifiant lisible (slug). Répond 404 si le contenu n'existe pas ou n'est pas publié.") @GetMapping("/api/v1/articles/{slug}") public ApiResponse<Article> publicFind(@PathVariable String slug){return ApiResponse.of(service.publicFind(slug));}
    @Operation(tags = "Management · Actualités", summary = "Lister tous les articles", description = "Retourne l'ensemble des articles, publiés ou non, pour l'édition dans l'espace de gestion. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/articles") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<List<Article>> adminList(){return ApiResponse.of(service.adminList());}
    @Operation(tags = "Management · Actualités", summary = "Créer un article", description = "Crée un article. Le corps est validé (Bean Validation) ; les erreurs sont renvoyées champ par champ. Retourne 201 et la ressource créée. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping("/api/v1/management/articles") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<ApiResponse<Article>> create(@Valid @RequestBody ArticleRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(r)));}
    @Operation(tags = "Management · Actualités", summary = "Modifier un article", description = "Remplace les champs de un article identifié par son UUID. Répond 404 si l'identifiant est inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.") @PutMapping("/api/v1/management/articles/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<Article> update(@PathVariable UUID id,@Valid @RequestBody ArticleRequest r){return ApiResponse.of(service.update(id,r));}
    @Operation(tags = "Management · Actualités", summary = "Supprimer un article", description = "Suppression définitive de un article identifié par son UUID ; retourne 204 sans corps, 404 si inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/api/v1/management/articles/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<Void> delete(@PathVariable UUID id){service.delete(id);return ResponseEntity.noContent().build();}
}
