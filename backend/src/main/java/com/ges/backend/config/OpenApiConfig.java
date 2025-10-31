package com.ges.backend.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info().title("GES Restaurant Stock Management API").version("1.0.0").description("API for restaurant stock management"))
                .externalDocs(new ExternalDocumentation().description("Swagger UI").url("/swagger-ui/index.html"));
    }
}
