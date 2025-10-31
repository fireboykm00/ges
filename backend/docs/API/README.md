# GES Restaurant Stock Management API

- Swagger UI: `http://localhost:8080/swagger-ui`
- OpenAPI JSON: `http://localhost:8080/api/openapi.json`
- Spec (static): `../api/openapi.yaml`
- Base URL: `http://localhost:8080/api`
- Auth: Bearer JWT (`Authorization: Bearer <token>`) for protected endpoints

## Quick start
- Register: POST /api/auth/register
- Login: POST /api/auth/login -> returns `{ token, user }`
- Example curl:
  ```bash
  curl -s http://localhost:8080/api/openapi.json | jq '.info, .paths | keys | length'
  ```

## Modules
- Auth: POST /auth/login, POST /auth/register
- Stocks: CRUD at /stocks
- Suppliers: CRUD at /suppliers
- Purchases: POST /purchases (with items), GET /purchases
- Usage: POST /usages, GET /usages
- Expenses: CRUD at /expenses
- Reports: GET /reports/monthly?month=YYYY-MM
