#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../../backend"

POM=pom.xml

echo "[i] Add springdoc-openapi-ui dependency to $POM (no changes applied if already present)"

if ! grep -q "springdoc-openapi-starter-webmvc-ui" "$POM"; then
  tmp=$(mktemp)
  awk '
    /<dependencies>/ && !x {print; print "        <dependency>\n            <groupId>org.springdoc</groupId>\n            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>\n            <version>2.5.0</version>\n        </dependency>"; x=1; next}1
  ' "$POM" > "$tmp"
  mv "$tmp" "$POM"
  echo "[+] Added springdoc dependency"
else
  echo "[=] Dependency already present"
fi

cat > src/main/java/com/ges/backend/config/OpenApiConfig.java <<'JAVA'
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
                .info(new Info().title("GES API").version("1.0.0").description("REST API for GES"))
                .externalDocs(new ExternalDocumentation().description("Docs").url("/swagger-ui/index.html"));
    }
}
JAVA

echo "[i] Build to expose Swagger UI at /swagger-ui/index.html"
echo "mvn -q -DskipTests spring-boot:run"
