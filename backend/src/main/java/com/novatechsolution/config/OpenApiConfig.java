package com.novatechsolution.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class OpenApiConfig {

    @Value("${novatech.notifications.to:contact@novatech.cm}")
    private String contactEmail;

    @Bean
    OpenAPI novaTechOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("NovaTech Solution API")
                        .version("v1")
                        .description("API REST bilingue du site vitrine et de son espace d'administration.")
                        .contact(new Contact().name("NovaTech Solution").email(contactEmail)))
                .components(new Components().addSecuritySchemes("bearerAuth",
                        new SecurityScheme().type(SecurityScheme.Type.HTTP)
                                .scheme("bearer").bearerFormat("JWT")));
    }
}
