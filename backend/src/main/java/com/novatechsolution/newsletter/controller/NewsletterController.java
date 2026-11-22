package com.novatechsolution.newsletter.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.newsletter.dto.NewsletterSubscriberResponse;
import com.novatechsolution.newsletter.service.NewsletterService;
import com.novatechsolution.shared.web.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.nio.charset.StandardCharsets;
import java.net.URI;
import java.net.URLEncoder;
import java.util.List;

@RestController @RequiredArgsConstructor
public class NewsletterController {
    private final NewsletterService service;
    @Value("${novatech.site.public-url:http://localhost:5173}") private String publicSiteUrl;
    @Operation(tags = "Visiteur · Newsletter", summary = "Se désabonner (API)", description = "Désactive l’abonnement associé au jeton de désabonnement. 204 sans corps ; 404 si le jeton est invalide.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @PostMapping("/api/v1/newsletter/unsubscribe") public ResponseEntity<Void> unsubscribe(@RequestParam String token){service.unsubscribe(token);return ResponseEntity.noContent().build();}
    @Operation(tags = "Visiteur · Newsletter", summary = "Se désabonner depuis un lien", description = "Point d’entrée des liens e-mail : redirige (303) vers la page publique de désabonnement en conservant le jeton.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "303", description = "Redirection vers la page de désabonnement")) @GetMapping("/api/v1/newsletter/unsubscribe") public ResponseEntity<Void> unsubscribeByLink(@RequestParam String token){
        String target=publicSiteUrl.replaceAll("/$", "")+"/newsletter/unsubscribe?token="+URLEncoder.encode(token,StandardCharsets.UTF_8);
        return ResponseEntity.status(303).location(URI.create(target)).build();
    }
    @Operation(tags = "Management · Newsletter", summary = "Lister les abonnés", description = "Retourne les abonnés avec leur statut et leur date d’inscription. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/newsletter/subscribers") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<List<NewsletterSubscriberResponse>> list(){return ApiResponse.of(service.list());}
    @Operation(tags = "Management · Newsletter", summary = "Exporter les abonnés (CSV)", description = "Génère un fichier CSV (email, active, created_at) avec neutralisation des formules de tableur. Type de contenu : text/csv. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping(value="/api/v1/management/newsletter/subscribers/export",produces="text/csv") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<byte[]> export(){String csv="email,active,created_at\r\n"+service.list().stream().map(s->"\""+csvSafe(s.email())+"\","+s.active()+","+s.createdAt()).collect(java.util.stream.Collectors.joining("\r\n"));return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=newsletter.csv").contentType(new MediaType("text","csv",StandardCharsets.UTF_8)).body(("\uFEFF"+csv).getBytes(StandardCharsets.UTF_8));}
    private String csvSafe(String value){if(!value.isEmpty()&&"=+-@\t\r".indexOf(value.charAt(0))>=0)value="'"+value;return value.replace("\"","\"\"");}
}
