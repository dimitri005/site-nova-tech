package com.novatechsolution.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.tags.Tag;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Documentation OpenAPI de l'API v1.
 * Toutes les routes sont affichées sur une seule page, regroupées par tag « acteur · fonction technique ».
 */
@Configuration(proxyBeanMethods = false)
public class OpenApiConfig {
    private static final String BEARER = "bearerAuth";
    private static final String MANAGEMENT_PREFIX = "/api/v1/management";

    private static final String DESCRIPTION = "API REST bilingue (français / anglais) du site vitrine NovaTech Solution et de son espace de gestion.";

    @Bean
    OpenAPI novaTechOpenApi() {
        OpenAPI api = new OpenAPI()
                .info(new Info()
                        .title("NovaTech Solution API")
                        .version("v1")
                        .description(DESCRIPTION)
                        .contact(new Contact().name("NovaTech Solution")))
                .components(new Components()
                        .addSecuritySchemes(BEARER, new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")
                                .description("Jeton d'accès obtenu via POST /api/v1/auth/login."))
                        .addSchemas("ApiError", new ObjectSchema().description("Erreur normalisée de l'API")
                                .addProperty("timestamp", new StringSchema().format("date-time"))
                                .addProperty("status", new Schema<Integer>().type("integer"))
                                .addProperty("message", new StringSchema())
                                .addProperty("fields", new ObjectSchema().description("Messages de validation par nom de champ")
                                        .additionalProperties(new StringSchema()))));
        ApiTags.TAGS.forEach((name, description) -> api.addTagsItem(new Tag().name(name).description(description)));
        return api;
    }

    /** Complète chaque opération : exigence de sécurité, réponses d'erreur communes, et ne garde que les tags utilisés. */
    @Bean
    OpenApiCustomizer documentation() {
        return openApi -> {
            Set<String> usedTags = new HashSet<>();
            if (openApi.getPaths() == null) return;
            openApi.getPaths().forEach((path, item) -> item.readOperationsMap().forEach((method, operation) -> {
                boolean management = path.startsWith(MANAGEMENT_PREFIX);
                boolean write = switch (method) { case POST, PUT, PATCH -> true; default -> false; };
                ApiResponses responses = operation.getResponses() == null ? new ApiResponses() : operation.getResponses();
                operation.setResponses(responses);
                if (responses.containsKey("201") || responses.containsKey("204") || responses.containsKey("303")) responses.remove("200");
                if (management) {
                    operation.addSecurityItem(new SecurityRequirement().addList(BEARER));
                    error(responses, "401", "Jeton absent, expiré ou invalide.");
                    error(responses, "403", "Rôle insuffisant pour cette opération.");
                } else if (write && !path.startsWith("/api/v1/auth/")) {
                    error(responses, "429", "Trop de requêtes : limite de débit atteinte pour cette adresse.");
                }
                if (path.startsWith("/api/v1/auth/login") || path.startsWith("/api/v1/auth/refresh")) error(responses, "401", "Identifiants ou jeton invalides.");
                if (write && !path.startsWith("/api/v1/auth/logout")) error(responses, "400", "Données invalides : le détail est fourni champ par champ dans `fields`.");
                if (path.contains("{")) error(responses, "404", "Ressource introuvable.");
                if (operation.getTags() != null) usedTags.addAll(operation.getTags());
            }));
            if (openApi.getTags() != null) openApi.setTags(openApi.getTags().stream().filter((tag) -> usedTags.contains(tag.getName())).toList());
        };
    }

    private static void error(ApiResponses responses, String code, String description) {
        if (responses.containsKey(code)) return;
        responses.addApiResponse(code, new ApiResponse().description(description).content(new Content().addMediaType("application/json",
                new MediaType().schema(new Schema<>().$ref("#/components/schemas/ApiError")))));
    }
}
