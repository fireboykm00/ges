# Runbook

## Backend
- Build/run: mvn -DskipTests spring-boot:run (or use scripts/backend/dev-run.sh if present)
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI: docs/api/openapi.yaml (source of truth for endpoints)

### Tests
- Run: mvn -Dspring.profiles.active=test test

## Frontend
- Ensure env: cp frontend/.env.example frontend/.env.local
- Install UI library: scripts/frontend/setup-shadcn.sh
- Dev server: scripts/frontend/dev-run.sh

## Docs
- API: docs/api/openapi.yaml and docs/API/README.md
- ERD: docs/ERD.md
- UI Sitemap: docs/FRONTEND_SITEMAP.md
