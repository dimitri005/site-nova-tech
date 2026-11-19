package com.novatechsolution.newsletter.controller;

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
    @PostMapping("/api/v1/newsletter/unsubscribe") public ResponseEntity<Void> unsubscribe(@RequestParam String token){service.unsubscribe(token);return ResponseEntity.noContent().build();}
    @GetMapping("/api/v1/newsletter/unsubscribe") public ResponseEntity<Void> unsubscribeByLink(@RequestParam String token){
        String target=publicSiteUrl.replaceAll("/$", "")+"/newsletter/unsubscribe?token="+URLEncoder.encode(token,StandardCharsets.UTF_8);
        return ResponseEntity.status(303).location(URI.create(target)).build();
    }
    @GetMapping("/api/v1/admin/newsletter/subscribers") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<List<NewsletterSubscriberResponse>> list(){return ApiResponse.of(service.list());}
    @GetMapping(value="/api/v1/admin/newsletter/subscribers/export",produces="text/csv") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<byte[]> export(){String csv="email,active,created_at\r\n"+service.list().stream().map(s->"\""+csvSafe(s.email())+"\","+s.active()+","+s.createdAt()).collect(java.util.stream.Collectors.joining("\r\n"));return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=newsletter.csv").contentType(new MediaType("text","csv",StandardCharsets.UTF_8)).body(("\uFEFF"+csv).getBytes(StandardCharsets.UTF_8));}
    private String csvSafe(String value){if(!value.isEmpty()&&"=+-@\t\r".indexOf(value.charAt(0))>=0)value="'"+value;return value.replace("\"","\"\"");}
}
